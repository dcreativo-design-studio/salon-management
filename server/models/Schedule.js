// models/Schedule.js
const mongoose = require('mongoose');

// Time schema for storing hour and minute
const TimeSchema = new mongoose.Schema({
  hours: {
    type: Number,
    required: true,
    min: 0,
    max: 23
  },
  minutes: {
    type: Number,
    required: true,
    min: 0,
    max: 59,
    default: 0
  }
}, { _id: false });

// Break time schema
const BreakSchema = new mongoose.Schema({
  startTime: {
    type: TimeSchema,
    required: true
  },
  endTime: {
    type: TimeSchema,
    required: true
  },
  name: {
    type: String,
    default: 'Break'
  }
}, { _id: false });

// Main schedule schema
const ScheduleSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  dayOfWeek: {
    type: Number,
    required: true,
    min: 0,  // Sunday
    max: 6   // Saturday
  },
  isWorkingDay: {
    type: Boolean,
    default: true
  },
  startTime: {
    type: TimeSchema,
    required: function() {
      return this.isWorkingDay;
    }
  },
  endTime: {
    type: TimeSchema,
    required: function() {
      return this.isWorkingDay;
    }
  },
  breaks: [BreakSchema],
  effectiveFrom: {
    type: Date,
    default: Date.now
  },
  effectiveTo: {
    type: Date,
    default: null
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index for quick lookups
ScheduleSchema.index({ staff: 1, dayOfWeek: 1, effectiveFrom: 1 });

// Validate that end time is after start time
ScheduleSchema.pre('validate', function(next) {
  if (this.isWorkingDay) {
    const startMinutes = this.startTime.hours * 60 + this.startTime.minutes;
    const endMinutes = this.endTime.hours * 60 + this.endTime.minutes;

    if (endMinutes <= startMinutes) {
      this.invalidate('endTime', 'End time must be after start time');
    }

    // Validate breaks
    this.breaks.forEach((breakItem, index) => {
      const breakStart = breakItem.startTime.hours * 60 + breakItem.startTime.minutes;
      const breakEnd = breakItem.endTime.hours * 60 + breakItem.endTime.minutes;

      if (breakEnd <= breakStart) {
        this.invalidate(`breaks.${index}.endTime`, 'Break end time must be after start time');
      }

      if (breakStart < startMinutes || breakEnd > endMinutes) {
        this.invalidate(`breaks.${index}`, 'Break must be within working hours');
      }
    });
  }
  next();
});

// Create default schedules for new staff
ScheduleSchema.statics.createDefaultSchedules = async function(staffId) {
  // Default schedule: Monday to Friday, 9 AM to 6 PM with 1-hour lunch break
  const defaultSchedules = [];

  for (let day = 1; day <= 5; day++) {  // Monday to Friday
    defaultSchedules.push({
      staff: staffId,
      dayOfWeek: day,
      isWorkingDay: true,
      startTime: { hours: 9, minutes: 0 },
      endTime: { hours: 18, minutes: 0 },
      breaks: [
        {
          name: 'Lunch',
          startTime: { hours: 12, minutes: 0 },
          endTime: { hours: 13, minutes: 0 }
        }
      ],
      isDefault: true
    });
  }

  // Weekends off by default
  for (let day of [0, 6]) {  // Sunday and Saturday
    defaultSchedules.push({
      staff: staffId,
      dayOfWeek: day,
      isWorkingDay: false,
      isDefault: true
    });
  }

  return this.insertMany(defaultSchedules);
};

module.exports = mongoose.model('Schedule', ScheduleSchema);
