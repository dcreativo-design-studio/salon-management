// models/Appointment.js
const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a client']
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: [true, 'Please provide a staff member']
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Please provide a service']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date and time']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  confirmationSent: {
    type: Boolean,
    default: false
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelReason: {
    type: String,
    maxlength: [200, 'Cancel reason cannot be more than 200 characters']
  }
}, {
  timestamps: true
});

// Index for quick lookups
AppointmentSchema.index({ date: 1, staff: 1 });
AppointmentSchema.index({ client: 1, date: 1 });
AppointmentSchema.index({ status: 1 });

// Prevent double bookings
AppointmentSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('date') || this.isModified('staff') || this.isModified('endTime')) {
    const Appointment = this.constructor;

    // Find any overlapping appointments
    const overlappingAppointment = await Appointment.findOne({
      _id: { $ne: this._id }, // Exclude current appointment when updating
      staff: this.staff,
      status: { $nin: ['cancelled', 'no-show'] },
      $or: [
        // New appointment starts during an existing appointment
        {
          date: { $lte: this.date },
          endTime: { $gt: this.date }
        },
        // New appointment ends during an existing appointment
        {
          date: { $lt: this.endTime },
          endTime: { $gte: this.endTime }
          // models/Appointment.js (continued)
        },
        // New appointment contains an existing appointment
        {
          date: { $gte: this.date },
          endTime: { $lte: this.endTime }
        },
        // New appointment is contained within an existing appointment
        {
          date: { $lte: this.date },
          endTime: { $gte: this.endTime }
        }
      ]
    });

    if (overlappingAppointment) {
      const error = new Error('This time slot is already booked');
      error.name = 'BookingConflictError';
      return next(error);
    }
  }
  next();
});

// Check if staff is available (using Schedule model)
AppointmentSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('date') || this.isModified('staff') || this.isModified('endTime')) {
    try {
      const Schedule = mongoose.model('Schedule');
      const appointmentDay = this.date.getDay(); // 0 for Sunday, 1 for Monday, etc.
      const appointmentStartTime = this.date.getHours() * 60 + this.date.getMinutes();
      const appointmentEndTime = this.endTime.getHours() * 60 + this.endTime.getMinutes();

      // Find schedule for that staff member and day
      const staffSchedule = await Schedule.findOne({
        staff: this.staff,
        dayOfWeek: appointmentDay,
        isWorkingDay: true
      });

      if (!staffSchedule) {
        const error = new Error('Staff is not available on this day');
        error.name = 'StaffUnavailableError';
        return next(error);
      }

      // Check if appointment is within working hours
      const workStartTime = staffSchedule.startTime.hours * 60 + staffSchedule.startTime.minutes;
      const workEndTime = staffSchedule.endTime.hours * 60 + staffSchedule.endTime.minutes;

      if (appointmentStartTime < workStartTime || appointmentEndTime > workEndTime) {
        const error = new Error('Appointment is outside of staff working hours');
        error.name = 'OutsideWorkingHoursError';
        return next(error);
      }

      // Check if appointment conflicts with breaks
      const breakConflict = staffSchedule.breaks.some(breakTime => {
        const breakStart = breakTime.startTime.hours * 60 + breakTime.startTime.minutes;
        const breakEnd = breakTime.endTime.hours * 60 + breakTime.endTime.minutes;

        return (
          (appointmentStartTime >= breakStart && appointmentStartTime < breakEnd) ||
          (appointmentEndTime > breakStart && appointmentEndTime <= breakEnd) ||
          (appointmentStartTime <= breakStart && appointmentEndTime >= breakEnd)
        );
      });

      if (breakConflict) {
        const error = new Error('Appointment conflicts with staff break time');
        error.name = 'BreakConflictError';
        return next(error);
      }

      // Check if the date falls within any vacation periods
      const Vacation = mongoose.model('Vacation');
      const vacationConflict = await Vacation.findOne({
        staff: this.staff,
        startDate: { $lte: this.date },
        endDate: { $gte: this.date },
        status: 'approved'
      });

      if (vacationConflict) {
        const error = new Error('Staff is on vacation during this date');
        error.name = 'VacationConflictError';
        return next(error);
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
