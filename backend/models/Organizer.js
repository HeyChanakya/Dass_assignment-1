// Organizer Model
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const organizerSchema = new mongoose.Schema({
  organizerName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  loginEmail: {
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
  contactNumber: {
    type: String,
    trim: true
  },
  discordWebhook: {
    type: String,
    trim: true
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant'
  }],
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }]
}, {
  timestamps: true
});

// Hash password before saving
organizerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
organizerSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Organizer', organizerSchema);
