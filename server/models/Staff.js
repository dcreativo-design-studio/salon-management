// models/Staff.js
const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    enum: [
      'Senior Stylist',
      'Stylist',
      'Junior Stylist',
      'Color Specialist',
      'Assistant',
      'Manager'
    ]
  },
  bio: {
    type: String,
    required: [true, 'Please add a bio'],
    maxlength: [1000, 'Bio cannot be more than 1000 characters']
  },
  specialties: [{
    type: String,
    enum: [
      'haircuts',
      'coloring',
      'highlights',
      'balayage',
      'styling',
      'extensions',
      'treatments',
      'updos',
      'bridal'
    ]
  }],
  availableServices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  experience: {
    type: Number,
    required: [true, 'Please add years of experience'],
    min: [0, 'Experience must be at least 0 years']
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Populate user info when fetching staff
StaffSchema.virtual('userInfo', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Add staff by default when a new staff user is created
StaffSchema.statics.createDefaultStaff = async function(userId, title) {
  await this.create({
    userId,
    title: title || 'Junior Stylist',
    bio: 'New team member',
    specialties: ['haircuts'],
    experience: 0,
    isActive: true
  });
};

module.exports = mongoose.model('Staff', StaffSchema);
