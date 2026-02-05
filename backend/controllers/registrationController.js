// Registration Controller
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Participant = require('../models/Participant');
const generateQRCode = require('../utils/qrCodeGenerator');
const sendEmail = require('../utils/sendEmail');
const { v4: uuidv4 } = require('uuid');

// @desc    Register for event
// @route   POST /api/registrations
// @access  Private (Participant)
const registerForEvent = async (req, res) => {
  try {
    const { eventId, formResponses, merchandisePurchase } = req.body;

    const event = await Event.findById(eventId).populate('organizer');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check registration deadline
    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({ message: 'Registration deadline has passed' });
    }

    // Check registration limit
    if (event.currentRegistrations >= event.registrationLimit) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Check if already registered
    const existingReg = await Registration.findOne({
      event: eventId,
      participant: req.user._id
    });

    if (existingReg) {
      return res.status(400).json({ message: 'Already registered for this event' });
    }

    // Generate ticket ID
    const ticketId = `TICKET-${uuidv4().substring(0, 8).toUpperCase()}`;

    // Generate QR code
    const qrData = {
      ticketId,
      eventName: event.eventName,
      participantEmail: req.user.email,
      eventDate: event.eventStartDate
    };
    const qrCode = await generateQRCode(qrData);

    // Create registration
    const registration = await Registration.create({
      event: eventId,
      participant: req.user._id,
      ticketId,
      qrCode,
      formResponses: formResponses || {},
      merchandisePurchase: merchandisePurchase || {},
      paymentStatus: event.registrationFee > 0 ? 'Pending' : 'Paid'
    });

    // Update event
    event.currentRegistrations += 1;
    event.participants.push(registration._id);
    await event.save();

    // Update participant
    await Participant.findByIdAndUpdate(req.user._id, {
      $push: { registeredEvents: eventId }
    });

    // Send confirmation email
    try {
      await sendEmail({
        email: req.user.email,
        subject: `Registration Confirmed - ${event.eventName}`,
        message: `
          <h2>Registration Successful!</h2>
          <p>You have successfully registered for <strong>${event.eventName}</strong></p>
          <p><strong>Ticket ID:</strong> ${ticketId}</p>
          <p><strong>Event Date:</strong> ${new Date(event.eventStartDate).toLocaleString()}</p>
          <p>Please save this email and bring your ticket to the event.</p>
        `
      });
    } catch (emailError) {
      console.error('Email send error:', emailError);
    }

    res.status(201).json({
      message: 'Registration successful',
      registration: await Registration.findById(registration._id)
        .populate('event')
        .populate('participant', 'firstName lastName email')
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Get user registrations
// @route   GET /api/registrations
// @access  Private (Participant)
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ participant: req.user._id })
      .populate({
        path: 'event',
        populate: { path: 'organizer', select: 'organizerName' }
      })
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get event participants (for organizer)
// @route   GET /api/registrations/event/:eventId
// @access  Private (Organizer)
const getEventParticipants = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const registrations = await Registration.find({ event: req.params.eventId })
      .populate('participant', 'firstName lastName email collegeName contactNumber')
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    console.error('Get event participants error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cancel registration
// @route   DELETE /api/registrations/:id
// @access  Private (Participant)
const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    if (registration.participant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const event = await Event.findById(registration.event);
    if (event) {
      event.currentRegistrations -= 1;
      await event.save();
    }

    registration.registrationStatus = 'Cancelled';
    await registration.save();

    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerForEvent,
  getMyRegistrations,
  getEventParticipants,
  cancelRegistration
};
