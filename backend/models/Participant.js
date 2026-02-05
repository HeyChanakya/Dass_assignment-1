// Participant Model
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const participantSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  participantType: {
    type: String,
    enum: ['IIIT', 'Non-IIIT'],
    required: true
  },
  collegeName: {
    type: String,
    trim: true
  },
  contactNumber: {
    type: String,
    trim: true
  },
  areasOfInterest: [{
    type: String
  }],
  followedClubs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organizer'
  }],
  registeredEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }]
}, {
  timestamps: true
});

// Hash password before saving
participantSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
participantSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Participant', participantSchema);
