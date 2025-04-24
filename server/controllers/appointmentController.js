// controllers/appointmentController.js
const mongoose = require('mongoose');
const { asyncHandler } = require('../middleware/errorHandler');
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const Staff = require('../models/Staff');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');
const { formatDate, formatTime } = require('../utils/dateUtils');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private/Admin
const getAppointments = asyncHandler(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  // Filtering
  let query = {};

  // Date filters
  if (req.query.date) {
    const date = new Date(req.query.date);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    query.date = {
      $gte: date,
      $lt: nextDay
    };
  } else if (req.query.startDate && req.query.endDate) {
    query.date = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  }

  // Status filter
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Staff filter
  if (req.query.staff) {
    query.staff = req.query.staff;
  }

  // Client filter
  if (req.query.client) {
    query.client = req.query.client;
  }

  // Service filter
  if (req.query.service) {
    query.service = req.query.service;
  }

  // Execute query with pagination
  const appointments = await Appointment.find(query)
    .populate('client', 'firstName lastName email phone')
    .populate({
      path: 'staff',
      populate: {
        path: 'userId',
        model: 'User',
        select: 'firstName lastName email'
      }
    })
    .populate('service', 'name price duration')
    .sort({ date: 1 })
    .skip(startIndex)
    .limit(limit);

  // Get total count
  const total = await Appointment.countDocuments(query);

  // Pagination result
  const pagination = {
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    perPage: limit
  };

  res.status(200).json({
    success: true,
    count: appointments.length,
    pagination,
    data: appointments
  });
});

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
const getAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate('client', 'firstName lastName email phone')
    .populate({
      path: 'staff',
      populate: {
        path: 'userId',
        model: 'User',
        select: 'firstName lastName email'
      }
    })
    .populate('service', 'name price duration description');

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Check if the user is authorized to view this appointment
  if (req.user.role === 'client' && appointment.client._id.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to view this appointment');
  }

  res.status(200).json({
    success: true,
    data: appointment
  });
});

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = asyncHandler(async (req, res) => {
  const { serviceId, staffId, date, notes } = req.body;

  // Validate required fields
  if (!serviceId || !staffId || !date) {
    res.status(400);
    throw new Error('Please provide service, staff, and date');
  }

  // Check if service exists
  const service = await Service.findById(serviceId);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  // Check if staff exists
  const staff = await Staff.findById(staffId).populate('userId', 'firstName lastName email');
  if (!staff) {
    res.status(404);
    throw new Error('Staff not found');
  }

  // Calculate end time based on service duration
  const startDate = new Date(date);
  const endDate = new Date(startDate.getTime() + service.duration * 60000); // Adding minutes

  // Create appointment
  const appointmentData = {
    client: req.user.id,
    staff: staffId,
    service: serviceId,
    date: startDate,
    endTime: endDate,
    notes: notes || ''
  };

  // Try to create appointment (validation will check conflicts)
  try {
    const appointment = await Appointment.create(appointmentData);

    // Populate the created appointment
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('client', 'firstName lastName email phone')
      .populate({
        path: 'staff',
        populate: {
          path: 'userId',
          model: 'User',
          select: 'firstName lastName email'
        }
      })
      .populate('service', 'name price duration');

    // Send confirmation email to client
    const client = await User.findById(req.user.id);

    const clientEmailContent = {
      to: client.email,
      subject: 'Appointment Confirmation',
      text: `Hello ${client.firstName},\n\nYour appointment has been confirmed for ${formatDate(startDate)} at ${formatTime(startDate)} with ${staff.userId.firstName} ${staff.userId.lastName} for ${service.name}.\n\nThank you for choosing our salon!`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Appointment Confirmation</h2>
          <p>Hello ${client.firstName},</p>
          <p>Your appointment has been confirmed!</p>
          <div style="background-color: #f9f9f9; border-left: 4px solid #6a1b9a; padding: 15px; margin: 15px 0;">
            <p><strong>Date:</strong> ${formatDate(startDate)}</p>
            <p><strong>Time:</strong> ${formatTime(startDate)} - ${formatTime(endDate)}</p>
            <p><strong>Stylist:</strong> ${staff.userId.firstName} ${staff.userId.lastName}</p>
            <p><strong>Service:</strong> ${service.name}</p>
            <p><strong>Duration:</strong> ${service.duration} minutes</p>
            <p><strong>Price:</strong> $${service.price.toFixed(2)}</p>
          </div>
          <p>Thank you for choosing our salon!</p>
          <p>If you need to cancel or reschedule, please contact us at least 24 hours in advance.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #777;">This is an automated email, please do not reply.</p>
          </div>
        </div>
      `
    };

    try {
      await sendEmail(clientEmailContent);
      appointment.confirmationSent = true;
      await appointment.save();
    } catch (error) {
      console.error('Error sending client confirmation email:', error);
      // Continue even if email fails
    }

    // Send notification to staff
    const staffEmailContent = {
      to: staff.userId.email,
      subject: 'New Appointment Notification',
      text: `Hello ${staff.userId.firstName},\n\nYou have a new appointment scheduled for ${formatDate(startDate)} at ${formatTime(startDate)} with ${client.firstName} ${client.lastName} for ${service.name}.\n\nPlease check your schedule.`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>New Appointment Notification</h2>
          <p>Hello ${staff.userId.firstName},</p>
          <p>You have a new appointment scheduled:</p>
          <div style="background-color: #f9f9f9; border-left: 4px solid #6a1b9a; padding: 15px; margin: 15px 0;">
            <p><strong>Date:</strong> ${formatDate(startDate)}</p>
            <p><strong>Time:</strong> ${formatTime(startDate)} - ${formatTime(endDate)}</p>
            <p><strong>Client:</strong> ${client.firstName} ${client.lastName}</p>
            <p><strong>Service:</strong> ${service.name}</p>
            <p><strong>Duration:</strong> ${service.duration} minutes</p>
          </div>
          <p>Please check your schedule in the staff portal.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #777;">This is an automated email, please do not reply.</p>
          </div>
        </div>
      `
    };

    try {
      await sendEmail(staffEmailContent);
    } catch (error) {
      console.error('Error sending staff notification email:', error);
      // Continue even if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: populatedAppointment
    });
  } catch (error) {
    // Handle specific booking errors
    if (error.name === 'BookingConflictError') {
      res.status(409);
      throw new Error('The selected time slot is already booked');
    } else if (error.name === 'StaffUnavailableError') {
      res.status(400);
      throw new Error('Staff is not available on this day');
    } else if (error.name === 'OutsideWorkingHoursError') {
      res.status(400);
      throw new Error('This time is outside of staff working hours');
    } else if (error.name === 'BreakConflictError') {
      res.status(400);
      throw new Error('This time conflicts with staff break time');
    } else if (error.name === 'VacationConflictError') {
      res.status(400);
      throw new Error('Staff is on vacation during this date');
    } else {
      throw error;
    }
  }
});

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = asyncHandler(async (req, res) => {
  let appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Check authorization - client can only update their own appointments
  if (req.user.role === 'client' && appointment.client.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this appointment');
  }

  // Can only update appointments that are pending or confirmed
  if (!['pending', 'confirmed'].includes(appointment.status)) {
    res.status(400);
    throw new Error(`Cannot update appointment with status: ${appointment.status}`);
  }

  // Prepare update fields
  const updateFields = {};

  // Clients can only update notes
  if (req.user.role === 'client') {
    if (req.body.notes !== undefined) {
      updateFields.notes = req.body.notes;
    }
  } else {
    // Staff and Admin can update more fields
    if (req.body.serviceId) {
      // Check if service exists
      const service = await Service.findById(req.body.serviceId);
      if (!service) {
        res.status(404);
        throw new Error('Service not found');
      }
      updateFields.service = req.body.serviceId;

      // If service is changed, we need to recalculate the end time
      if (req.body.date || (service._id.toString() !== appointment.service.toString())) {
        const startDate = req.body.date ? new Date(req.body.date) : appointment.date;
        updateFields.date = startDate;
        updateFields.endTime = new Date(startDate.getTime() + service.duration * 60000);
      }
    } else if (req.body.date) {
      // If only date is changed but not service
      const service = await Service.findById(appointment.service);
      const startDate = new Date(req.body.date);
      updateFields.date = startDate;
      updateFields.endTime = new Date(startDate.getTime() + service.duration * 60000);
    }

    if (req.body.staffId) {
      // Check if staff exists
      const staff = await Staff.findById(req.body.staffId);
      if (!staff) {
        res.status(404);
        throw new Error('Staff not found');
      }
      updateFields.staff = req.body.staffId;
    }

    if (req.body.status) {
      updateFields.status = req.body.status;
    }

    if (req.body.notes !== undefined) {
      updateFields.notes = req.body.notes;
    }
  }

  // Only attempt update if there are fields to update
  if (Object.keys(updateFields).length === 0) {
    res.status(400);
    throw new Error('No update fields provided');
  }

  try {
    // Apply updates with validation
    Object.assign(appointment, updateFields);
    await appointment.save();

    // Fetch updated appointment with populated fields
    const updatedAppointment = await Appointment.findById(req.params.id)
      .populate('client', 'firstName lastName email phone')
      .populate({
        path: 'staff',
        populate: {
          path: 'userId',
          model: 'User',
          select: 'firstName lastName email'
        }
      })
      .populate('service', 'name price duration');

    // Send update notification email if significant changes (date, service, staff, status)
    if (updateFields.date || updateFields.service || updateFields.staff || updateFields.status) {
      const client = await User.findById(appointment.client);
      const staff = await Staff.findById(updatedAppointment.staff._id).populate('userId');
      const service = await Service.findById(updatedAppointment.service._id);

      // Prepare email content
      const emailContent = {
        to: client.email,
        subject: 'Appointment Updated',
        text: `Hello ${client.firstName},\n\nYour appointment has been updated. New details: ${formatDate(updatedAppointment.date)} at ${formatTime(updatedAppointment.date)} with ${staff.userId.firstName} for ${service.name}. Status: ${updatedAppointment.status}.\n\nThank you for choosing our salon!`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Appointment Update</h2>
            <p>Hello ${client.firstName},</p>
            <p>Your appointment has been updated. Here are the new details:</p>
            <div style="background-color: #f9f9f9; border-left: 4px solid #6a1b9a; padding: 15px; margin: 15px 0;">
              <p><strong>Date:</strong> ${formatDate(updatedAppointment.date)}</p>
              <p><strong>Time:</strong> ${formatTime(updatedAppointment.date)} - ${formatTime(updatedAppointment.endTime)}</p>
              <p><strong>Stylist:</strong> ${staff.userId.firstName} ${staff.userId.lastName}</p>
              <p><strong>Service:</strong> ${service.name}</p>
              <p><strong>Duration:</strong> ${service.duration} minutes</p>
              <p><strong>Status:</strong> ${updatedAppointment.status.charAt(0).toUpperCase() + updatedAppointment.status.slice(1)}</p>
            </div>
            <p>Thank you for choosing our salon!</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #777;">This is an automated email, please do not reply.</p>
            </div>
          </div>
        `
      };

      try {
        await sendEmail(emailContent);
      } catch (error) {
        console.error('Error sending appointment update email:', error);
        // Continue even if email fails
      }
    }

    res.status(200).json({
      success: true,
      message: 'Appointment updated successfully',
      data: updatedAppointment
    });
  } catch (error) {
    // Handle specific booking errors
    if (error.name === 'BookingConflictError') {
      res.status(409);
      throw new Error('The selected time slot is already booked');
    } else if (error.name === 'StaffUnavailableError') {
      res.status(400);
      throw new Error('Staff is not available on this day');
    } else if (error.name === 'OutsideWorkingHoursError') {
      res.status(400);
      throw new Error('This time is outside of staff working hours');
    } else if (error.name === 'BreakConflictError') {
      res.status(400);
      throw new Error('This time conflicts with staff break time');
    } else if (error.name === 'VacationConflictError') {
      res.status(400);
      throw new Error('Staff is on vacation during this date');
    } else {
      throw error;
    }
  }
});

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Check authorization - client can only cancel their own appointments
  if (req.user.role === 'client' && appointment.client.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to cancel this appointment');
  }

  // Can only cancel appointments that are pending or confirmed
  if (!['pending', 'confirmed'].includes(appointment.status)) {
    res.status(400);
    throw new Error(`Cannot cancel appointment with status: ${appointment.status}`);
  }

  // Update appointment
  appointment.status = 'cancelled';
  appointment.cancelledBy = req.user.id;
  appointment.cancelReason = req.body.reason || 'No reason provided';

  await appointment.save();

  // Fetch updated appointment with populated fields
  const updatedAppointment = await Appointment.findById(req.params.id)
    .populate('client', 'firstName lastName email phone')
    .populate({
      path: 'staff',
      populate: {
        path: 'userId',
        model: 'User',
        select: 'firstName lastName email'
      }
    })
    .populate('service', 'name price duration');

  // Send cancellation email to client
  const client = await User.findById(appointment.client);
  const staff = await Staff.findById(appointment.staff).populate('userId');
  const service = await Service.findById(appointment.service);

  const cancelledBy = req.user.role === 'client' ? 'you' : 'the salon';

  // Prepare email content for client
  const clientEmailContent = {
    to: client.email,
    subject: 'Appointment Cancelled',
    text: `Hello ${client.firstName},\n\nYour appointment for ${formatDate(appointment.date)} at ${formatTime(appointment.date)} with ${staff.userId.firstName} for ${service.name} has been cancelled by ${cancelledBy}.\n\nReason: ${appointment.cancelReason}\n\nThank you for choosing our salon!`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Appointment Cancellation</h2>
        <p>Hello ${client.firstName},</p>
        <p>Your appointment has been cancelled by ${cancelledBy}.</p>
        <div style="background-color: #f9f9f9; border-left: 4px solid #e53935; padding: 15px; margin: 15px 0;">
          <p><strong>Date:</strong> ${formatDate(appointment.date)}</p>
          <p><strong>Time:</strong> ${formatTime(appointment.date)}</p>
          <p><strong>Stylist:</strong> ${staff.userId.firstName} ${staff.userId.lastName}</p>
          <p><strong>Service:</strong> ${service.name}</p>
          <p><strong>Reason:</strong> ${appointment.cancelReason}</p>
        </div>
        <p>Please feel free to reschedule at your convenience.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #777;">This is an automated email, please do not reply.</p>
        </div>
      </div>
    `
  };

  try {
    await sendEmail(clientEmailContent);
  } catch (error) {
    console.error('Error sending client cancellation email:', error);
    // Continue even if email fails
  }

  // If cancelled by client, notify staff
  if (req.user.role === 'client') {
    const staffEmailContent = {
      to: staff.userId.email,
      subject: 'Appointment Cancelled by Client',
      text: `Hello ${staff.userId.firstName},\n\nAn appointment has been cancelled by the client. Details: ${formatDate(appointment.date)} at ${formatTime(appointment.date)} with ${client.firstName} ${client.lastName} for ${service.name}.\n\nReason: ${appointment.cancelReason}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Appointment Cancellation Notice</h2>
          <p>Hello ${staff.userId.firstName},</p>
          <p>An appointment has been cancelled by the client.</p>
          <div style="background-color: #f9f9f9; border-left: 4px solid #e53935; padding: 15px; margin: 15px 0;">
            <p><strong>Date:</strong> ${formatDate(appointment.date)}</p>
            <p><strong>Time:</strong> ${formatTime(appointment.date)}</p>
            <p><strong>Client:</strong> ${client.firstName} ${client.lastName}</p>
            <p><strong>Service:</strong> ${service.name}</p>
            <p><strong>Reason:</strong> ${appointment.cancelReason}</p>
          </div>
          <p>Your schedule has been updated accordingly.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #777;">This is an automated email, please do not reply.</p>
          </div>
        </div>
      `
    };

    try {
      await sendEmail(staffEmailContent);
    } catch (error) {
      console.error('Error sending staff cancellation email:', error);
      // Continue even if email fails
    }
  }

  res.status(200).json({
    success: true,
    message: 'Appointment cancelled successfully',
    data: updatedAppointment
  });
});

// @desc    Get client's appointments
// @route   GET /api/appointments/me
// @access  Private
const getMyAppointments = asyncHandler(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  // Base query
  let query = { client: req.user.id };

  // Filtering
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Date filtering
  if (req.query.upcoming === 'true') {
    query.date = { $gte: new Date() };
    query.status = { $nin: ['cancelled', 'no-show'] };
  } else if (req.query.past === 'true') {
    query.$or = [
      { date: { $lt: new Date() } },
      { status: { $in: ['completed', 'cancelled', 'no-show'] } }
    ];
  }

  // Execute query with pagination
  const appointments = await Appointment.find(query)
    .populate({
      path: 'staff',
      populate: {
        path: 'userId',
        model: 'User',
        select: 'firstName lastName'
      }
    })
    .populate('service', 'name price duration')
    .sort({ date: -1 })
    .skip(startIndex)
    .limit(limit);

  // Get total count
  const total = await Appointment.countDocuments(query);

  // Pagination result
  const pagination = {
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    perPage: limit
  };

  res.status(200).json({
    success: true,
    count: appointments.length,
    pagination,
    data: appointments
  });
});

// @desc    Get staff's appointments
// @route   GET /api/appointments/staff/:staffId
// @access  Private/Admin,Staff
const getStaffAppointments = asyncHandler(async (req, res) => {
  const staffId = req.params.staffId;

  // Verify staff exists
  const staff = await Staff.findById(staffId);
  if (!staff) {
    res.status(404);
    throw new Error('Staff not found');
  }

  // Staff can only view their own appointments
  if (req.user.role === 'staff') {
    const staffRecord = await Staff.findOne({ userId: req.user.id });
    if (!staffRecord || staffRecord._id.toString() !== staffId) {
      res.status(403);
      throw new Error('Not authorized to view these appointments');
    }
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  // Base query
  let query = { staff: staffId };

  // Filtering
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Date filtering
  if (req.query.date) {
    const date = new Date(req.query.date);
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);

    query.date = {
      $gte: date,
      $lt: nextDay
    };
  } else if (req.query.startDate && req.query.endDate) {
    query.date = {
      $gte: new Date(req.query.startDate),
      $lte: new Date(req.query.endDate)
    };
  } else if (req.query.upcoming === 'true') {
    query.date = { $gte: new Date() };
    query.status = { $nin: ['cancelled', 'no-show'] };
  }

  // Execute query with pagination
  const appointments = await Appointment.find(query)
    .populate('client', 'firstName lastName email phone')
    .populate('service', 'name price duration')
    .sort({ date: 1 })
    .skip(startIndex)
    .limit(limit);

  // Get total count
  const total = await Appointment.countDocuments(query);

  // Pagination result
  const pagination = {
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    perPage: limit
  };

  res.status(200).json({
    success: true,
    count: appointments.length,
    pagination,
    data: appointments
  });
});

// @desc    Mark appointment as completed
// @route   PUT /api/appointments/:id/complete
// @access  Private/Staff,Admin
const completeAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Only staff assigned to the appointment or admin can mark as completed
  if (req.user.role === 'staff') {
    const staffRecord = await Staff.findOne({ userId: req.user.id });
    if (!staffRecord || staffRecord._id.toString() !== appointment.staff.toString()) {
      res.status(403);
      throw new Error('Not authorized to complete this appointment');
    }
  }

  // Can only complete appointments that are confirmed
  if (appointment.status !== 'confirmed') {
    res.status(400);
    throw new Error(`Cannot complete appointment with status: ${appointment.status}`);
  }

  // Update appointment
  appointment.status = 'completed';
  await appointment.save();

  // Fetch updated appointment with populated fields
  // controllers/appointmentController.js (continued)
  // Fetch updated appointment with populated fields
  const updatedAppointment = await Appointment.findById(req.params.id)
    .populate('client', 'firstName lastName email phone')
    .populate({
      path: 'staff',
      populate: {
        path: 'userId',
        model: 'User',
        select: 'firstName lastName email'
      }
    })
    .populate('service', 'name price duration');

  // Send completion email to client
  const client = await User.findById(appointment.client);

  const emailContent = {
    to: client.email,
    subject: 'Thank You for Your Visit',
    text: `Hello ${client.firstName},\n\nThank you for visiting our salon today. We hope you enjoyed your service and look forward to seeing you again soon!\n\nIf you have a moment, we would love to hear your feedback.`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Thank You for Your Visit!</h2>
        <p>Hello ${client.firstName},</p>
        <p>Thank you for visiting our salon today. We hope you enjoyed your service and look forward to seeing you again soon!</p>
        <p>If you have a moment, we would appreciate your feedback on your experience.</p>
        <div style="background-color: #f9f9f9; border-left: 4px solid #4CAF50; padding: 15px; margin: 15px 0;">
          <p><strong>Service:</strong> ${updatedAppointment.service.name}</p>
          <p><strong>Stylist:</strong> ${updatedAppointment.staff.userId.firstName} ${updatedAppointment.staff.userId.lastName}</p>
          <p><strong>Date:</strong> ${formatDate(updatedAppointment.date)}</p>
        </div>
        <p>Book your next appointment easily through our online booking system.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #777;">This is an automated email, please do not reply.</p>
        </div>
      </div>
    `
  };

  try {
    await sendEmail(emailContent);
  } catch (error) {
    console.error('Error sending completion email:', error);
    // Continue even if email fails
  }

  res.status(200).json({
    success: true,
    message: 'Appointment marked as completed',
    data: updatedAppointment
  });
});

// @desc    Mark appointment as no-show
// @route   PUT /api/appointments/:id/no-show
// @access  Private/Staff,Admin
const markNoShow = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  // Only staff assigned to the appointment or admin can mark as no-show
  if (req.user.role === 'staff') {
    const staffRecord = await Staff.findOne({ userId: req.user.id });
    if (!staffRecord || staffRecord._id.toString() !== appointment.staff.toString()) {
      res.status(403);
      throw new Error('Not authorized to mark this appointment as no-show');
    }
  }

  // Can only mark appointments that are confirmed
  if (appointment.status !== 'confirmed') {
    res.status(400);
    throw new Error(`Cannot mark appointment with status: ${appointment.status} as no-show`);
  }

  // Update appointment
  appointment.status = 'no-show';
  await appointment.save();

  // Fetch updated appointment with populated fields
  const updatedAppointment = await Appointment.findById(req.params.id)
    .populate('client', 'firstName lastName email phone')
    .populate({
      path: 'staff',
      populate: {
        path: 'userId',
        model: 'User',
        select: 'firstName lastName email'
      }
    })
    .populate('service', 'name price duration');

  res.status(200).json({
    success: true,
    message: 'Appointment marked as no-show',
    data: updatedAppointment
  });
});

// @desc    Get available time slots for a staff member on a specific date
// @route   GET /api/appointments/available-slots
// @access  Private
const getAvailableSlots = asyncHandler(async (req, res) => {
  const { staffId, date, serviceId } = req.query;

  if (!staffId || !date || !serviceId) {
    res.status(400);
    throw new Error('Please provide staffId, date, and serviceId');
  }

  // Check if staff exists
  const staff = await Staff.findById(staffId);
  if (!staff) {
    res.status(404);
    throw new Error('Staff not found');
  }

  // Check if service exists
  const service = await Service.findById(serviceId);
  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  // Check if staff provides this service
  const providesService = staff.availableServices.some(
    id => id.toString() === serviceId
  );

  if (!providesService && staff.availableServices.length > 0) {
    res.status(400);
    throw new Error('This staff member does not provide the selected service');
  }

  // Parse the requested date
  const requestedDate = new Date(date);
  const dayOfWeek = requestedDate.getDay(); // 0 for Sunday, 1 for Monday, etc.

  // Get the staff schedule for that day
  const schedule = await mongoose.model('Schedule').findOne({
    staff: staffId,
    dayOfWeek,
    isWorkingDay: true,
    $or: [
      { effectiveTo: null },
      { effectiveTo: { $gte: requestedDate } }
    ],
    effectiveFrom: { $lte: requestedDate }
  });

  if (!schedule || !schedule.isWorkingDay) {
    return res.status(200).json({
      success: true,
      message: 'Staff is not available on this day',
      data: []
    });
  }

  // Check if staff is on vacation
  const vacation = await mongoose.model('Vacation').findOne({
    staff: staffId,
    startDate: { $lte: requestedDate },
    endDate: { $gte: requestedDate },
    status: 'approved'
  });

  if (vacation) {
    return res.status(200).json({
      success: true,
      message: 'Staff is on vacation on this day',
      data: []
    });
  }

  // Service duration in minutes
  const serviceDuration = service.duration;

  // Get working hours in minutes
  const workStart = schedule.startTime.hours * 60 + schedule.startTime.minutes;
  const workEnd = schedule.endTime.hours * 60 + schedule.endTime.minutes;

  // Create array of breaks in minutes
  const breaks = schedule.breaks.map(breakTime => ({
    start: breakTime.startTime.hours * 60 + breakTime.startTime.minutes,
    end: breakTime.endTime.hours * 60 + breakTime.endTime.minutes
  }));

  // Get all appointments for this staff on this date
  const startDate = new Date(requestedDate);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(requestedDate);
  endDate.setHours(23, 59, 59, 999);

  const existingAppointments = await Appointment.find({
    staff: staffId,
    date: { $gte: startDate, $lte: endDate },
    status: { $nin: ['cancelled', 'no-show'] }
  }).select('date endTime');

  // Convert appointments to time ranges in minutes
  const bookedSlots = existingAppointments.map(app => ({
    start: app.date.getHours() * 60 + app.date.getMinutes(),
    end: app.endTime.getHours() * 60 + app.endTime.getMinutes()
  }));

  // Generate available time slots at 15-minute intervals
  const availableSlots = [];
  const interval = 15; // 15-minute intervals

  // Start from working hours start time
  for (let time = workStart; time <= workEnd - serviceDuration; time += interval) {
    // Create appointment end time
    const slotEnd = time + serviceDuration;

    // Skip if appointment would end after working hours
    if (slotEnd > workEnd) continue;

    // Check if slot conflicts with any break
    const breakConflict = breaks.some(
      breakTime =>
        (time >= breakTime.start && time < breakTime.end) || // Slot starts during break
        (slotEnd > breakTime.start && slotEnd <= breakTime.end) || // Slot ends during break
        (time <= breakTime.start && slotEnd >= breakTime.end) // Slot contains break
    );

    if (breakConflict) continue;

    // Check if slot conflicts with any existing appointment
    const appointmentConflict = bookedSlots.some(
      slot =>
        (time >= slot.start && time < slot.end) || // Slot starts during appointment
        (slotEnd > slot.start && slotEnd <= slot.end) || // Slot ends during appointment
        (time <= slot.start && slotEnd >= slot.end) // Slot contains appointment
    );

    if (appointmentConflict) continue;

    // Format start time for slot
    const slotDate = new Date(requestedDate);
    slotDate.setHours(Math.floor(time / 60), time % 60, 0, 0);

    // Format end time for slot
    const slotEndDate = new Date(requestedDate);
    slotEndDate.setHours(Math.floor(slotEnd / 60), slotEnd % 60, 0, 0);

    availableSlots.push({
      start: slotDate,
      end: slotEndDate,
      duration: serviceDuration
    });
  }

  res.status(200).json({
    success: true,
    count: availableSlots.length,
    data: availableSlots
  });
});

// @desc    Get appointment statistics
// @route   GET /api/appointments/stats
// @access  Private/Admin
const getAppointmentStats = asyncHandler(async (req, res) => {
  // Optional date range filtering
  let dateFilter = {};

  if (req.query.startDate && req.query.endDate) {
    dateFilter = {
      date: {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      }
    };
  }

  // Get total counts by status
  const statusCounts = await Appointment.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Get counts by service
  const serviceCounts = await Appointment.aggregate([
    { $match: { ...dateFilter, status: { $nin: ['cancelled', 'no-show'] } } },
    {
      $group: {
        _id: '$service',
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'services',
        localField: '_id',
        foreignField: '_id',
        as: 'serviceInfo'
      }
    },
    {
      $unwind: '$serviceInfo'
    },
    {
      $project: {
        serviceName: '$serviceInfo.name',
        count: 1
      }
    },
    { $sort: { count: -1 } }
  ]);

  // Get counts by staff
  const staffCounts = await Appointment.aggregate([
    { $match: { ...dateFilter, status: { $nin: ['cancelled', 'no-show'] } } },
    {
      $group: {
        _id: '$staff',
        count: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'staffs',
        localField: '_id',
        foreignField: '_id',
        as: 'staffInfo'
      }
    },
    {
      $unwind: '$staffInfo'
    },
    {
      $lookup: {
        from: 'users',
        localField: 'staffInfo.userId',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    {
      $unwind: '$userInfo'
    },
    {
      $project: {
        staffName: { $concat: ['$userInfo.firstName', ' ', '$userInfo.lastName'] },
        count: 1
      }
    },
    { $sort: { count: -1 } }
  ]);

  // Get appointments by day of week
  const dayOfWeekCounts = await Appointment.aggregate([
    { $match: { ...dateFilter, status: { $nin: ['cancelled', 'no-show'] } } },
    {
      $project: {
        dayOfWeek: { $dayOfWeek: '$date' } // 1 for Sunday, 2 for Monday, etc.
      }
    },
    {
      $group: {
        _id: '$dayOfWeek',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Format day of week data for easier consumption
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const formattedDayOfWeekCounts = dayOfWeekCounts.map(item => ({
    day: daysOfWeek[item._id - 1],
    count: item.count
  }));

  // Get appointments by hour of day
  const hourCounts = await Appointment.aggregate([
    { $match: { ...dateFilter, status: { $nin: ['cancelled', 'no-show'] } } },
    {
      $project: {
        hour: { $hour: '$date' }
      }
    },
    {
      $group: {
        _id: '$hour',
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Format status counts for easier consumption
  const formattedStatusCounts = {};
  statusCounts.forEach(item => {
    formattedStatusCounts[item._id] = item.count;
  });

  res.status(200).json({
    success: true,
    data: {
      statusCounts: formattedStatusCounts,
      serviceStats: serviceCounts,
      staffStats: staffCounts,
      dayOfWeekStats: formattedDayOfWeekCounts,
      hourStats: hourCounts
    }
  });
});

// @desc    Send appointment reminder emails
// @route   POST /api/appointments/send-reminders
// @access  Private/Admin
const sendAppointmentReminders = asyncHandler(async (req, res) => {
  // Get appointments for tomorrow that have not had reminders sent
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  const appointments = await Appointment.find({
    date: { $gte: tomorrow, $lt: dayAfterTomorrow },
    status: 'confirmed',
    reminderSent: false
  })
    .populate('client', 'firstName lastName email')
    .populate({
      path: 'staff',
      populate: {
        path: 'userId',
        model: 'User',
        select: 'firstName lastName'
      }
    })
    .populate('service', 'name duration');

  // Send reminder email for each appointment
  const sentReminders = [];
  const failedReminders = [];

  for (const appointment of appointments) {
    const emailContent = {
      to: appointment.client.email,
      subject: 'Appointment Reminder',
      text: `Hello ${appointment.client.firstName},\n\nThis is a reminder that you have an appointment tomorrow, ${formatDate(appointment.date)} at ${formatTime(appointment.date)} with ${appointment.staff.userId.firstName} for a ${appointment.service.name}.\n\nWe look forward to seeing you!\n\nIf you need to cancel or reschedule, please contact us as soon as possible.`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Appointment Reminder</h2>
          <p>Hello ${appointment.client.firstName},</p>
          <p>This is a friendly reminder that you have an appointment tomorrow:</p>
          <div style="background-color: #f9f9f9; border-left: 4px solid #6a1b9a; padding: 15px; margin: 15px 0;">
            <p><strong>Date:</strong> ${formatDate(appointment.date)}</p>
            <p><strong>Time:</strong> ${formatTime(appointment.date)}</p>
            <p><strong>Stylist:</strong> ${appointment.staff.userId.firstName} ${appointment.staff.userId.lastName}</p>
            <p><strong>Service:</strong> ${appointment.service.name}</p>
            <p><strong>Duration:</strong> ${appointment.service.duration} minutes</p>
          </div>
          <p>We look forward to seeing you!</p>
          <p>If you need to cancel or reschedule, please contact us as soon as possible.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #777;">This is an automated email, please do not reply.</p>
          </div>
        </div>
      `
    };

    try {
      await sendEmail(emailContent);

      // Mark reminder as sent
      appointment.reminderSent = true;
      await appointment.save();

      sentReminders.push(appointment._id);
    } catch (error) {
      console.error(`Error sending reminder for appointment ${appointment._id}:`, error);
      failedReminders.push({
        id: appointment._id,
        error: error.message
      });
    }
  }

  res.status(200).json({
    success: true,
    message: `Sent ${sentReminders.length} reminders, ${failedReminders.length} failed`,
    data: {
      total: appointments.length,
      sent: sentReminders,
      failed: failedReminders
    }
  });
});

module.exports = {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getMyAppointments,
  getStaffAppointments,
  completeAppointment,
  markNoShow,
  getAvailableSlots,
  getAppointmentStats,
  sendAppointmentReminders
};
