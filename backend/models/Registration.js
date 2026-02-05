// Registration Model
const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant',
    required: true
  },
  ticketId: {
    type: String,
    required: true,
    unique: true
  },
  registrationStatus: {
    type: String,
    enum: ['Registered', 'Completed', 'Cancelled', 'Rejected'],
    default: 'Registered'
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending', 'Failed'],
    default: 'Pending'
  },
  // For Normal Events - Custom Form Responses
  formResponses: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  // For Merchandise
  merchandisePurchase: {
    variant: {
      size: String,
      color: String
    },
    quantity: Number
  },
  qrCode: {
    type: String
  },
  attendance: {
    marked: {
      type: Boolean,
      default: false
    },
    timestamp: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Registration', registrationSchema);
