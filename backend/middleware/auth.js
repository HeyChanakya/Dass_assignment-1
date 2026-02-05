// Authentication Middleware
const jwt = require('jsonwebtoken');
const Participant = require('../models/Participant');
const Organizer = require('../models/Organizer');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request based on role
      if (decoded.role === 'participant') {
        req.user = await Participant.findById(decoded.id).select('-password');
      } else if (decoded.role === 'organizer') {
        req.user = await Organizer.findById(decoded.id).select('-password');
      } else if (decoded.role === 'admin') {
        req.user = await Admin.findById(decoded.id).select('-password');
      }

      req.userRole = decoded.role;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Role-based access control
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ 
        message: `User role ${req.userRole} is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
