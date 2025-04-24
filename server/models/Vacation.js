// models/Vacation.js
const mongoose = require('mongoose');

const VacationSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date']
  },
  reason: {
    type: String,
    maxlength: [500, 'Reason cannot be more than 500 characters'],
    default: 'Time off'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: {
    type: String,
    maxlength: [500, 'Rejection reason cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

// Validate that end date is after start date
VacationSchema.pre('validate', function(next) {
  if (this.endDate <= this.startDate) {
    this.invalidate('endDate', 'End date must be after start date');
  }
  next();
});

// Check for overlapping vacations for the same staff
VacationSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('startDate') || this.isModified('endDate') || this.isModified('staff')) {
    const overlappingVacation = await this.constructor.findOne({
      _id: { $ne: this._id },
      staff: this.staff,
      status: { $in: ['pending', 'approved'] },
      $or: [
        // New vacation starts during an existing vacation
        {
          startDate: { $lte: this.startDate },
          endDate: { $gte: this.startDate }
        },
        // New vacation ends during an existing vacation
        {
          startDate: { $lte: this.endDate },
          endDate: { $gte: this.endDate }
        },
        // New vacation contains an existing vacation
        {
          startDate: { $gte: this.startDate },
          endDate: { $lte: this.endDate }
        }
      ]
    });

    if (overlappingVacation) {
      const error = new Error('This vacation period overlaps with an existing vacation');
      error.name = 'VacationOverlapError';
      return next(error);
    }
  }
  next();
});

// Check for existing appointments during vacation
VacationSchema.pre('save', async function(next) {
  if ((this.isNew || this.isModified('startDate') || this.isModified('endDate') ||
       this.isModified('staff')) && this.status === 'approved') {

    try {
      const Appointment = mongoose.model('Appointment');

      // Find any appointments during the vacation period
      const conflictingAppointments = await Appointment.find({
        staff: this.staff,
        status: { $nin: ['cancelled', 'no-show'] },
        date: { $gte: this.startDate, $lte: this.endDate }
      });

      if (conflictingAppointments.length > 0) {
        const error = new Error(`Staff has ${conflictingAppointments.length} appointment(s) during this vacation period`);
        error.name = 'AppointmentConflictError';
        error.appointments = conflictingAppointments;
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Vacation', VacationSchema);
