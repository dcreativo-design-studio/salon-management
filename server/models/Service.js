// models/Service.js
const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a service name'],
    trim: true,
    maxlength: [100, 'Service name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price must be at least 0']
  },
  duration: {
    type: Number,
    required: [true, 'Please add a duration in minutes'],
    min: [5, 'Duration must be at least 5 minutes']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'haircut',
      'coloring',
      'styling',
      'treatment',
      'extensions',
      'special'
    ]
  },
  image: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create index for quick searches
ServiceSchema.index({ name: 'text', description: 'text', category: 1 });

module.exports = mongoose.model('Service', ServiceSchema);
