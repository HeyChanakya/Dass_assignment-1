// Main server file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const connectDB = require('./config/db');
connectDB();

// Import Routes
const authRoutes = require('./routes/authRoutes');
const participantRoutes = require('./routes/participantRoutes');
const organizerRoutes = require('./routes/organizerRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/organizers', organizerRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/admin', adminRoutes);

// Seed admin account
const seedAdmin = async () => {
  try {
    const Admin = require('./models/Admin');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@felicity.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await Admin.create({ email: adminEmail, password: adminPassword });
      console.log('Admin account created:', adminEmail);
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

// Seed admin after DB connection
setTimeout(seedAdmin, 2000);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
