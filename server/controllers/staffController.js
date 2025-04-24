// controllers/staffController.js
const { asyncHandler } = require('../middleware/errorHandler');
const Staff = require('../models/Staff');
const User = require('../models/User');
const Schedule = require('../models/Schedule');
const Vacation = require('../models/Vacation');
const Appointment = require('../models/Appointment');

// @desc    Get all staff members
// @route   GET /api/staff
// @access  Public
const getStaffMembers = asyncHandler(async (req, res) => {
  // Filtering
  let query = {};

  // Filter by active status
  if (req.query.active) {
    query.isActive = req.query.active === 'true';
  } else {
    // By default, only show active staff
    query.isActive = true;
  }

  // Filter by specialty
  if (req.query.specialty) {
    query.specialties = req.query.specialty;
  }

  // Filter by service
  if (req.query.service) {
    query.availableServices = req.query.service;
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const startIndex = (page - 1) * limit;

  // Execute query
  const staffMembers = await Staff.find(query)
    .populate('userId', 'firstName lastName email')
    .populate('availableServices', 'name price duration')
    .sort({ title: 1 })
    .skip(startIndex)
    .limit(limit);

  // Get total count
  const total = await Staff.countDocuments(query);

  // Pagination result
  const pagination = {
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    perPage: limit
  };

  res.status(200).json({
    success: true,
    count: staffMembers.length,
    pagination,
    data: staffMembers
  });
});

// @desc    Get single staff member
// @route   GET /api/staff/:id
// @access  Public
const getStaffMember = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id)
    .populate('userId', 'firstName lastName email')
    .populate('availableServices', 'name price duration category');

  if (!staff) {
    res.status(404);
    throw new Error('Staff member not found');
  }

  res.status(200).json({
    success: true,
    data: staff
  });
});

// @desc    Get staff member by user ID
// @route   GET /api/staff/user/:userId
// @access  Private
const getStaffByUserId = asyncHandler(async (req, res) => {
  const staff = await Staff.findOne({ userId: req.params.userId })
    .populate('userId', 'firstName lastName email')
    .populate('availableServices', 'name price duration category');
    // controllers/staffController.js (continued)
  if (!staff) {
    res.status(404);
    throw new Error('Staff member not found');
  }

  // Only allow admin or the staff member themselves to access this
  if (req.user.role !== 'admin' && req.user.id !== req.params.userId) {
    res.status(403);
    throw new Error('Not authorized to access this resource');
  }

  res.status(200).json({
    success: true,
    data: staff
  });
});

// @desc    Update staff member
// @route   PUT /api/staff/:id
// @access  Private/Admin
const updateStaffMember = asyncHandler(async (req, res) => {
  let staff = await Staff.findById(req.params.id);

  if (!staff) {
    res.status(404);
    throw new Error('Staff member not found');
  }

  // Update staff record
  staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
    .populate('userId', 'firstName lastName email')
    .populate('availableServices', 'name price duration');

  res.status(200).json({
    success: true,
    data: staff
  });
});

// @desc    Update own staff profile (for staff users)
// @route   PUT /api/staff/profile
// @access  Private/Staff
const updateOwnProfile = asyncHandler(async (req, res) => {
  // Find staff record for current user
  const staff = await Staff.findOne({ userId: req.user.id });

  if (!staff) {
    res.status(404);
    throw new Error('Staff profile not found');
  }

  // Staff can only update certain fields
  const allowedUpdates = {
    bio: req.body.bio,
    specialties: req.body.specialties
  };

  // Filter out undefined fields
  Object.keys(allowedUpdates).forEach(key => {
    if (allowedUpdates[key] === undefined) {
      delete allowedUpdates[key];
    }
  });

  // Update staff record
  const updatedStaff = await Staff.findByIdAndUpdate(staff._id, allowedUpdates, {
    new: true,
    runValidators: true
  })
    .populate('userId', 'firstName lastName email')
    .populate('availableServices', 'name price duration');

  res.status(200).json({
    success: true,
    data: updatedStaff
  });
});

// @desc    Get staff schedules
// @route   GET /api/staff/:id/schedules
// @access  Private
const getStaffSchedules = asyncHandler(async (req, res) => {
  // Verify staff exists
  const staff = await Staff.findById(req.params.id);

  if (!staff) {
    res.status(404);
    throw new Error('Staff member not found');
  }

  // If not admin and not the staff member, deny access
  if (req.user.role !== 'admin') {
    const staffRecord = await Staff.findOne({ userId: req.user.id });
    if (!staffRecord || staffRecord._id.toString() !== req.params.id) {
      res.status(403);
      throw new Error('Not authorized to access these schedules');
    }
  }

  // Get all schedules for this staff member
  const schedules = await Schedule.find({ staff: req.params.id });

  res.status(200).json({
    success: true,
    count: schedules.length,
    data: schedules
  });
});

// @desc    Create or update staff schedule
// @route   PUT /api/staff/:id/schedules/:dayOfWeek
// @access  Private/Staff,Admin
const updateSchedule = asyncHandler(async (req, res) => {
  // Verify staff exists
  const staff = await Staff.findById(req.params.id);

  if (!staff) {
    res.status(404);
    throw new Error('Staff member not found');
  }

  // If not admin and not the staff member, deny access
  if (req.user.role !== 'admin') {
    const staffRecord = await Staff.findOne({ userId: req.user.id });
    if (!staffRecord || staffRecord._id.toString() !== req.params.id) {
      res.status(403);
      throw new Error('Not authorized to update these schedules');
    }
  }

  const dayOfWeek = parseInt(req.params.dayOfWeek, 10);

  // Validate day of week
  if (isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
    res.status(400);
    throw new Error('Day of week must be between 0 (Sunday) and 6 (Saturday)');
  }

  // Find existing schedule for this day
  let schedule = await Schedule.findOne({
    staff: req.params.id,
    dayOfWeek,
    effectiveTo: null // Get current active schedule
  });

  // If schedule exists, update it
  if (schedule) {
    // If changing from working to non-working or vice versa, check for appointments
    if (req.body.isWorkingDay !== undefined && req.body.isWorkingDay !== schedule.isWorkingDay) {
      // If changing to non-working day, check for future appointments
      if (req.body.isWorkingDay === false) {
        // Get next date for this day of week
        const nextDate = getNextDayOfWeek(new Date(), dayOfWeek);
        const nextDateEnd = new Date(nextDate);
        nextDateEnd.setDate(nextDateEnd.getDate() + 1);

        // Check for appointments on this day of week in the future
        const appointments = await Appointment.find({
          staff: req.params.id,
          status: { $nin: ['cancelled', 'no-show'] },
          date: {
            $gte: nextDate,
            $lt: nextDateEnd
          }
        });

        if (appointments.length > 0) {
          res.status(400);
          throw new Error(`Cannot set as non-working day. There are ${appointments.length} appointments scheduled for this day.`);
        }
      }
    }

    // Update existing schedule
    Object.assign(schedule, req.body);
    await schedule.save();
  } else {
    // Create new schedule
    schedule = await Schedule.create({
      staff: req.params.id,
      dayOfWeek,
      ...req.body
    });
  }

  res.status(200).json({
    success: true,
    data: schedule
  });
});

// @desc    Get staff vacations
// @route   GET /api/staff/:id/vacations
// @access  Private
const getStaffVacations = asyncHandler(async (req, res) => {
  // Verify staff exists
  const staff = await Staff.findById(req.params.id);

  if (!staff) {
    res.status(404);
    throw new Error('Staff member not found');
  }

  // If not admin and not the staff member, deny access
  if (req.user.role !== 'admin') {
    const staffRecord = await Staff.findOne({ userId: req.user.id });
    if (!staffRecord || staffRecord._id.toString() !== req.params.id) {
      res.status(403);
      throw new Error('Not authorized to access these vacations');
    }
  }

  // Filter by status if provided
  let query = { staff: req.params.id };
  if (req.query.status) {
    query.status = req.query.status;
  }

  // Filter by date if provided
  if (req.query.upcoming === 'true') {
    query.endDate = { $gte: new Date() };
  }

  // Get all vacations for this staff member
  const vacations = await Vacation.find(query).sort({ startDate: 1 });

  res.status(200).json({
    success: true,
    count: vacations.length,
    data: vacations
  });
});

// @desc    Request vacation
// @route   POST /api/staff/:id/vacations
// @access  Private/Staff,Admin
const requestVacation = asyncHandler(async (req, res) => {
  // Verify staff exists
  const staff = await Staff.findById(req.params.id);

  if (!staff) {
    res.status(404);
    throw new Error('Staff member not found');
  }

  // If not admin and not the staff member, deny access
  if (req.user.role !== 'admin') {
    const staffRecord = await Staff.findOne({ userId: req.user.id });
    if (!staffRecord || staffRecord._id.toString() !== req.params.id) {
      res.status(403);
      throw new Error('Not authorized to request vacation for this staff member');
    }
  }

  // Set initial status based on role
  let initialStatus = 'pending';

  // If admin is creating the vacation, auto-approve it
  if (req.user.role === 'admin') {
    initialStatus = 'approved';
  }

  // Create vacation request
  const vacation = await Vacation.create({
    staff: req.params.id,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    reason: req.body.reason,
    status: initialStatus,
    approvedBy: initialStatus === 'approved' ? req.user.id : undefined
  });

  // If created as approved by admin, check for conflicts with appointments
  if (initialStatus === 'approved') {
    // Find appointments during vacation period
    const appointments = await Appointment.find({
      staff: req.params.id,
      status: { $nin: ['cancelled', 'no-show'] },
      date: {
        $gte: vacation.startDate,
        $lte: vacation.endDate
      }
    });

    if (appointments.length > 0) {
      res.status(200).json({
        success: true,
        message: `Vacation approved but there are ${appointments.length} appointments during this period that need to be rescheduled.`,
        data: {
          vacation,
          conflictingAppointments: appointments
        }
      });
    } else {
      res.status(201).json({
        success: true,
        data: vacation
      });
    }
  } else {
    res.status(201).json({
      success: true,
      data: vacation
    });
  }
});

// @desc    Approve or reject vacation request
// @route   PUT /api/staff/vacations/:id
// @access  Private/Admin
const updateVacationStatus = asyncHandler(async (req, res) => {
  const vacation = await Vacation.findById(req.params.id);

  if (!vacation) {
    res.status(404);
    throw new Error('Vacation request not found');
  }

  // Only admin can approve/reject
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update vacation status');
  }

  // Validate status
  if (!['approved', 'rejected'].includes(req.body.status)) {
    res.status(400);
    throw new Error('Status must be either approved or rejected');
  }

  // Update vacation status
  vacation.status = req.body.status;
  vacation.approvedBy = req.user.id;

  if (req.body.status === 'rejected' && req.body.rejectionReason) {
    vacation.rejectionReason = req.body.rejectionReason;
  }

  await vacation.save();

  // If approved, check for conflicts with appointments
  if (req.body.status === 'approved') {
    // Find appointments during vacation period
    const appointments = await Appointment.find({
      staff: vacation.staff,
      status: { $nin: ['cancelled', 'no-show'] },
      date: {
        $gte: vacation.startDate,
        $lte: vacation.endDate
      }
    });

    if (appointments.length > 0) {
      res.status(200).json({
        success: true,
        message: `Vacation approved but there are ${appointments.length} appointments during this period that need to be rescheduled.`,
        data: {
          vacation,
          conflictingAppointments: appointments
        }
      });
      return;
    }
  }

  res.status(200).json({
    success: true,
    data: vacation
  });
});

// @desc    Cancel vacation request
// @route   DELETE /api/staff/vacations/:id
// @access  Private
const cancelVacation = asyncHandler(async (req, res) => {
  const vacation = await Vacation.findById(req.params.id);

  if (!vacation) {
    res.status(404);
    throw new Error('Vacation request not found');
  }

  // Only admin or the staff member can cancel
  if (req.user.role !== 'admin') {
    const staffRecord = await Staff.findOne({ userId: req.user.id });
    if (!staffRecord || staffRecord._id.toString() !== vacation.staff.toString()) {
      res.status(403);
      throw new Error('Not authorized to cancel this vacation');
    }
  }

  // Only pending or approved vacations can be cancelled
  if (!['pending', 'approved'].includes(vacation.status)) {
    res.status(400);
    throw new Error(`Cannot cancel vacation with status: ${vacation.status}`);
  }

  // Can only cancel future vacations
  if (vacation.startDate <= new Date()) {
    res.status(400);
    throw new Error('Cannot cancel vacation that has already started');
  }

  await vacation.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Upload staff image
// @route   PUT /api/staff/:id/image
// @access  Private
const uploadStaffImage = asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);

  if (!staff) {
    res.status(404);
    throw new Error('Staff member not found');
  }

  // If not admin and not the staff member, deny access
  if (req.user.role !== 'admin') {
    const staffRecord = await Staff.findOne({ userId: req.user.id });
    if (!staffRecord || staffRecord._id.toString() !== req.params.id) {
      res.status(403);
      throw new Error('Not authorized to update this staff member');
    }
  }

  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  // Save file path to database
  staff.image = `/uploads/staff/${req.file.filename}`;
  await staff.save();

  res.status(200).json({
    success: true,
    data: staff
  });
});

// @desc    Get staff specialties
// @route   GET /api/staff/specialties
// @access  Public
const getStaffSpecialties = asyncHandler(async (req, res) => {
  const specialties = await Staff.schema.path('specialties').enumValues;

  res.status(200).json({
    success: true,
    count: specialties.length,
    data: specialties
  });
});

// Helper function to get next date for a given day of week
function getNextDayOfWeek(date, dayOfWeek) {
  const resultDate = new Date(date.getTime());
  resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
  return resultDate;
}

module.exports = {
  getStaffMembers,
  getStaffMember,
  getStaffByUserId,
  updateStaffMember,
  updateOwnProfile,
  getStaffSchedules,
  updateSchedule,
  getStaffVacations,
  requestVacation,
  updateVacationStatus,
  cancelVacation,
  uploadStaffImage,
  getStaffSpecialties
};
