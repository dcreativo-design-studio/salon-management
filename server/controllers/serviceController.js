// controllers/serviceController.js
const { asyncHandler } = require('../middleware/errorHandler');
const Service = require('../models/Service');
const Staff = require('../models/Staff');
const Appointment = require('../models/Appointment');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = asyncHandler(async (req, res) => {
  // Filtering
  let query = {};

  // Filter by category
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Filter by active status
  if (req.query.active) {
    query.isActive = req.query.active === 'true';
  } else {
    // By default, only show active services
    query.isActive = true;
  }

  // Search by name or description
  if (req.query.search) {
    query.$text = { $search: req.query.search };
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const startIndex = (page - 1) * limit;

  // Sorting
  const sort = {};
  if (req.query.sort) {
    const sortFields = req.query.sort.split(',');
    sortFields.forEach(field => {
      if (field.startsWith('-')) {
        sort[field.substring(1)] = -1;
      } else {
        sort[field] = 1;
      }
    });
  } else {
    // Default sort by category and name
    sort.category = 1;
    sort.name = 1;
  }

  // Execute query
  const services = await Service.find(query)
    .sort(sort)
    .skip(startIndex)
    .limit(limit);

  // Get total count
  const total = await Service.countDocuments(query);

  // Pagination result
  const pagination = {
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    perPage: limit
  };

  res.status(200).json({
    success: true,
    count: services.length,
    pagination,
    data: services
  });
});

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  // Get staff members who provide this service
  const staffMembers = await Staff.find({
    availableServices: service._id,
    isActive: true
  }).populate('userId', 'firstName lastName');

  res.status(200).json({
    success: true,
    data: {
      service,
      staffMembers: staffMembers.map(staff => ({
        _id: staff._id,
        name: `${staff.userId.firstName} ${staff.userId.lastName}`,
        title: staff.title,
        specialties: staff.specialties
      }))
    }
  });
});

// @desc    Create new service
// @route   POST /api/services
// @access  Private/Admin
const createService = asyncHandler(async (req, res) => {
  // Add current user as creator
  req.body.createdBy = req.user.id;

  const service = await Service.create(req.body);

  res.status(201).json({
    success: true,
    data: service
  });
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = asyncHandler(async (req, res) => {
  let service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  // If changing the duration, need to check for scheduling conflicts
  if (req.body.duration && req.body.duration !== service.duration) {
    // Find future appointments for this service
    const futureAppointments = await Appointment.find({
      service: service._id,
      date: { $gte: new Date() },
      status: { $nin: ['cancelled', 'no-show'] }
    });

    if (futureAppointments.length > 0) {
      res.status(400);
      throw new Error(`Cannot change duration for a service with ${futureAppointments.length} future appointments. Please reschedule or cancel these appointments first.`);
    }
  }

  // Update service
  service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: service
  });
});

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  // Check if service has any appointments
  const appointments = await Appointment.find({ service: service._id });

  if (appointments.length > 0) {
    res.status(400);
    throw new Error('Cannot delete service with existing appointments. Deactivate it instead.');
  }

  // Check if service is assigned to any staff members
  const staffWithService = await Staff.find({ availableServices: service._id });

  if (staffWithService.length > 0) {
    // Remove service from all staff members
    for (const staff of staffWithService) {
      staff.availableServices = staff.availableServices.filter(
        id => id.toString() !== service._id.toString()
      );
      await staff.save();
    }
  }

  await service.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get service categories
// @route   GET /api/services/categories
// @access  Public
const getServiceCategories = asyncHandler(async (req, res) => {
  const categories = await Service.distinct('category');

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories
  });
});

// @desc    Upload service image
// @route   PUT /api/services/:id/image
// @access  Private/Admin
const uploadServiceImage = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  // Save file path to database
  service.image = `/uploads/services/${req.file.filename}`;
  await service.save();

  res.status(200).json({
    success: true,
    data: service
  });
});

module.exports = {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  getServiceCategories,
  uploadServiceImage
};
