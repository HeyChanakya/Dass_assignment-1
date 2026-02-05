# 🚀 Quick Start Guide - Felicity Event Management System

## 📦 Prerequisites

Before starting, ensure you have installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (for local development) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

---

## 🏃‍♂️ Running Locally

### 1. Clone & Setup

```bash
# Navigate to project
cd DASS_ASS

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

#### Backend (.env)
Create `/backend/.env`:
```bash
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/felicity

# JWT
JWT_SECRET=your_super_secret_jwt_key_for_development
JWT_EXPIRE=7d

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Admin credentials
ADMIN_EMAIL=admin@felicity.com
ADMIN_PASSWORD=Admin@123
```

#### Frontend (.env)
Create `/frontend/.env`:
```bash
REACT_APP_API_URL=http://localhost:5000
```

### 3. Start MongoDB

```bash
# Start MongoDB service
# Windows
net start MongoDB

# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 4. Run Backend

```bash
cd backend
npm start

# Should see:
# "Server running on port 5000"
# "Connected to MongoDB"
# "Admin user seeded successfully"
```

### 5. Run Frontend

```bash
# In a new terminal
cd frontend
npm start

# Browser should open at http://localhost:3000
```

---

## 🧪 Testing the Application

### Quick Test Flow

1. **Admin Login**
   - Go to http://localhost:3000
   - Email: `admin@felicity.com`
   - Password: `Admin@123`
   - You should see Admin Dashboard

2. **Create Organizer**
   - Click "Manage Clubs/Organizers"
   - Click "Add New Organizer"
   - Fill form:
     - Name: `Tech Club`
     - Category: `Technical`
     - Description: `Technology and innovation club`
     - Email: `tech@felicity.com`
   - Click "Create Organizer"
   - **IMPORTANT**: Copy the generated credentials!

3. **Create Event (as Organizer)**
   - Logout
   - Login with organizer credentials (from step 2)
   - Click "Create Event"
   - Fill event form:
     - Name: `Hackathon 2024`
     - Type: `Normal`
     - Description: `24-hour coding marathon`
     - Eligibility: `Both`
     - Deadline: (tomorrow's date)
     - Start Date: (next week)
     - End Date: (day after start)
     - Limit: `50`
     - Fee: `0`
     - Tags: `coding, tech, innovation`
   - Add custom field:
     - Field Name: `Team Name`
     - Type: `Text`
     - Required: ✓
   - Submit

4. **Register as Participant**
   - Logout
   - Click "Register"
   - Fill form:
     - First Name: `John`
     - Last Name: `Doe`
     - Email: `john@iiit.ac.in`
     - Password: `John@123`
     - Type: `IIIT`
     - Phone: `9876543210`
     - Interests: `Coding, AI`
   - Submit

5. **Register for Event**
   - Login as John
   - Click "Browse Events"
   - Click on "Hackathon 2024"
   - Fill custom field (Team Name)
   - Click "Register Now"
   - Check email for QR ticket!

---

## 🎯 Test Credentials

### Admin (Auto-created)
```
Email: admin@felicity.com
Password: Admin@123
```

### Organizer (Created by admin)
```
Email: organizer0001@felicity.com  (example)
Password: [shown after creation]
```

### Participant (Self-registered)
```
Email: your-email@iiit.ac.in
Password: [your choice]
```

---

## 🔍 What to Test

### ✅ Authentication
- [ ] Register new participant (IIIT)
- [ ] Register new participant (Non-IIIT)
- [ ] Try invalid email domain (should fail)
- [ ] Login as participant
- [ ] Login as organizer
- [ ] Login as admin
- [ ] Logout and login again
- [ ] Token persists on page refresh

### ✅ Participant Features
- [ ] View dashboard (empty initially)
- [ ] Browse all events
- [ ] Search events by name
- [ ] Filter by event type
- [ ] Filter by eligibility
- [ ] Click event to view details
- [ ] Register for event
- [ ] Fill custom form fields
- [ ] See event in dashboard after registration
- [ ] Check email for QR ticket
- [ ] Update profile
- [ ] View clubs listing
- [ ] Follow a club
- [ ] Unfollow a club
- [ ] Browse only followed clubs' events

### ✅ Organizer Features
- [ ] View dashboard (shows 0 initially)
- [ ] Create Normal event
- [ ] Add custom form fields
- [ ] Create Merchandise event
- [ ] View created events
- [ ] See registration count update
- [ ] View analytics (events, registrations, revenue)
- [ ] Update profile
- [ ] Try to delete event with registrations (should fail)

### ✅ Admin Features
- [ ] View system statistics
- [ ] See recent participants
- [ ] See recent events
- [ ] Create new organizer
- [ ] Copy generated credentials
- [ ] View all organizers
- [ ] Try to delete organizer with events (should fail)
- [ ] Delete organizer without events

### ✅ Email Features
- [ ] Registration confirmation received
- [ ] QR code visible in email
- [ ] Correct event details in email
- [ ] Valid ticket ID shown

---

## 🐛 Troubleshooting

### Backend won't start

**Error**: `EADDRINUSE :::5000`
```bash
# Port 5000 is in use, kill the process
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill
```

**Error**: `MongoServerError: connect ECONNREFUSED`
```bash
# MongoDB is not running
# Start MongoDB (see step 3 above)
```

**Error**: `Admin user seeding failed`
```bash
# Check .env file exists and has correct format
# Ensure ADMIN_EMAIL and ADMIN_PASSWORD are set
```

### Frontend won't connect to backend

**Error**: `Network Error` or `Failed to fetch`
```bash
# Check backend is running on http://localhost:5000
# Check .env has REACT_APP_API_URL=http://localhost:5000
# Restart frontend: Ctrl+C, then npm start
```

### Email not sending

**Error**: `Email sending failed`
```bash
# Check Gmail app password is correct
# Ensure 2-Step Verification is enabled
# Try regenerating app password
# Test email: send to yourself first
```

### Login not working

**Error**: `Invalid credentials`
```bash
# For admin: Use exact credentials from .env
# For organizer: Use credentials shown at creation
# For participant: Use email with correct domain
# Check password has uppercase, lowercase, number, special char
```

---

## 📊 Database Inspection

### Using MongoDB Compass
1. Download [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Connect to `mongodb://localhost:27017`
3. Open `felicity` database
4. Inspect collections:
   - `admins` - Admin users
   - `participants` - Registered participants
   - `organizers` - Created organizers
   - `events` - All events
   - `registrations` - Event registrations

### Using Mongo Shell
```bash
mongo
use felicity
show collections

# View all participants
db.participants.find().pretty()

# View all events
db.events.find().pretty()

# View all registrations
db.registrations.find().pretty()

# Count documents
db.participants.countDocuments()
db.events.countDocuments()
```

---

## 🔧 Development Tips

### Auto-restart on changes
```bash
# Install nodemon globally
npm install -g nodemon

# Run backend with nodemon
cd backend
nodemon server.js
```

### Clear database
```bash
mongo
use felicity
db.dropDatabase()

# Restart backend to reseed admin
```

### Check logs
```bash
# Backend logs show in terminal where you ran npm start
# Frontend logs show in browser console (F12)
```

### Test API directly
```bash
# Using curl
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@felicity.com","password":"Admin@123"}'

# Should return JWT token and user data
```

---

## 📱 Mobile Testing

Frontend is responsive! Test on mobile:
1. Find your computer's IP address
2. Update frontend `.env`:
   ```bash
   REACT_APP_API_URL=http://YOUR_IP:5000
   ```
3. Access from mobile: `http://YOUR_IP:3000`

---

## 🎓 Learning Resources

- **React**: https://react.dev/learn
- **Express**: https://expressjs.com/
- **MongoDB**: https://docs.mongodb.com/
- **JWT**: https://jwt.io/introduction
- **Mongoose**: https://mongoosejs.com/docs/guide.html

---

## 📞 Need Help?

1. **Check logs**: Look at terminal output for errors
2. **Browser console**: F12 → Console for frontend errors
3. **Network tab**: F12 → Network to see API calls
4. **Postman**: Test API endpoints directly
5. **MongoDB Compass**: Inspect database state

---

## ✨ Features to Explore

1. **QR Code Generation**: Check email after event registration
2. **Custom Form Fields**: Create event with dynamic forms
3. **Trending Events**: Register 5+ users for one event to see it trend
4. **Follow Clubs**: Follow clubs and filter events by followed clubs
5. **Dashboard Analytics**: View organizer dashboard after registrations
6. **Admin Stats**: See system-wide statistics in admin dashboard

---

## 🎉 You're All Set!

Your Felicity Event Management System is ready to use!

For deployment to production, see `DEPLOYMENT_GUIDE.md`.

For complete feature list, see `PROJECT_SUMMARY.md`.

**Happy Testing! 🚀**
