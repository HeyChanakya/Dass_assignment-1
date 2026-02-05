// Event Model
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    trim: true
  },
  eventDescription: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    enum: ['Normal', 'Merchandise'],
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organizer',
    required: true
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  eventStartDate: {
    type: Date,
    required: true
  },
  eventEndDate: {
    type: Date,
    required: true
  },
  eligibility: {
    type: String,
    required: true
  },
  registrationLimit: {
    type: Number,
    required: true
  },
  registrationFee: {
    type: Number,
    default: 0
  },
  eventTags: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Draft', 'Published', 'Ongoing', 'Completed', 'Closed'],
    default: 'Draft'
  },
  // For Normal Events - Custom Registration Form
  customFormFields: [{
    fieldName: String,
    fieldType: String, // text, dropdown, checkbox, file, etc.
    isRequired: Boolean,
    options: [String] // For dropdown/checkbox
  }],
  // For Merchandise Events
  merchandiseDetails: {
    itemName: String,
    variants: [{
      size: String,
      color: String,
      stock: Number
    }],
    purchaseLimit: Number
  },
  currentRegistrations: {
    type: Number,
    default: 0
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
