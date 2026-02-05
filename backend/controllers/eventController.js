// Event Controller
const Event = require('../models/Event');
const Organizer = require('../models/Organizer');

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizer)
const createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      organizer: req.user._id,
      status: 'Draft'
    };

    const event = await Event.create(eventData);

    // Add event to organizer's events array
    await Organizer.findByIdAndUpdate(req.user._id, {
      $push: { events: event._id }
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error creating event' });
  }
};

// @desc    Get all events (with filters)
// @route   GET /api/events
// @access  Public
const getAllEvents = async (req, res) => {
  try {
    const { search, eventType, eligibility, startDate, endDate, followedClubs, organizerId } = req.query;
    
    let query = { status: 'Published' };

    // Search by name or organizer
    if (search) {
      const organizers = await Organizer.find({
        organizerName: { $regex: search, $options: 'i' }
      }).select('_id');
      
      query.$or = [
        { eventName: { $regex: search, $options: 'i' } },
        { organizer: { $in: organizers.map(o => o._id) } }
      ];
    }

    // Filter by event type
    if (eventType) {
      query.eventType = eventType;
    }

    // Filter by eligibility
    if (eligibility) {
      query.eligibility = { $regex: eligibility, $options: 'i' };
    }

    // Filter by date range
    if (startDate || endDate) {
      query.eventStartDate = {};
      if (startDate) query.eventStartDate.$gte = new Date(startDate);
      if (endDate) query.eventStartDate.$lte = new Date(endDate);
    }

    // Filter by followed clubs
    if (followedClubs) {
      const clubIds = followedClubs.split(',');
      query.organizer = { $in: clubIds };
    }

    // Filter by specific organizer
    if (organizerId) {
      query.organizer = organizerId;
    }

    const events = await Event.find(query)
      .populate('organizer', 'organizerName category')
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error fetching events' });
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'organizerName category contactEmail');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Organizer)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if organizer owns this event
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    // Editing rules based on status
    if (event.status === 'Draft') {
      // Allow all edits for drafts
      Object.assign(event, req.body);
    } else if (event.status === 'Published') {
      // Allow limited edits
      const allowedUpdates = ['eventDescription', 'registrationDeadline', 'registrationLimit'];
      allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) event[field] = req.body[field];
      });
      if (req.body.status === 'Closed') event.status = 'Closed';
    } else if (event.status === 'Ongoing' || event.status === 'Completed') {
      // Only allow status change
      if (req.body.status) event.status = req.body.status;
    }

    await event.save();
    res.json(event);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Organizer)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Only allow deletion if no registrations
    if (event.currentRegistrations > 0) {
      return res.status(400).json({ message: 'Cannot delete event with registrations' });
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get trending events
// @route   GET /api/events/trending
// @access  Public
const getTrendingEvents = async (req, res) => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const events = await Event.find({
      status: 'Published',
      createdAt: { $gte: oneDayAgo }
    })
      .populate('organizer', 'organizerName')
      .sort({ currentRegistrations: -1 })
      .limit(5);

    res.json(events);
  } catch (error) {
    console.error('Get trending events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getTrendingEvents
};
