# Felicity Event Management System

## Project Overview
This is a comprehensive event management system for Felicity fest, built using the MERN stack (MongoDB, Express.js, React, Node.js).

## Features Implemented

### Core Features (Part 1 - 70 Marks)
- [ ] Authentication & Security (8 marks)
- [ ] User Onboarding & Preferences (3 marks)
- [ ] User Data Models (2 marks)
- [ ] Event Types (2 marks)
- [ ] Event Attributes (2 marks)
- [ ] Participant Features (22 marks)
- [ ] Organizer Features (18 marks)
- [ ] Admin Features (6 marks)
- [ ] Deployment (5 marks)

### Advanced Features (Part 2 - 30 Marks)
**Selected Features:**
- Tier A: (Choose 2 - 16 marks total)
  - [ ] Feature 1: [To be selected]
  - [ ] Feature 2: [To be selected]

- Tier B: (Choose 2 - 12 marks total)
  - [ ] Feature 1: [To be selected]
  - [ ] Feature 2: [To be selected]

- Tier C: (Choose 1 - 2 marks)
  - [ ] Feature: [To be selected]

## Tech Stack
- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT with bcrypt
- **Additional Libraries**: 
  - nodemailer (email)
  - qrcode (QR generation)
  - react-router-dom (routing)
  - axios (HTTP client)

## Project Structure

```
DASS_ASS/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── organizerController.js
│   │   ├── participantController.js
│   │   └── registrationController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Event.js
│   │   ├── Organizer.js
│   │   ├── Participant.js
│   │   └── Registration.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── organizerRoutes.js
│   │   ├── participantRoutes.js
│   │   └── registrationRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── qrCodeGenerator.js
│   │   └── sendEmail.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── common/
│   │   │   │   ├── EventCard.js
│   │   │   │   ├── Navbar.js
│   │   │   │   └── PrivateRoute.js
│   │   │   ├── organizer/
│   │   │   └── participant/
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.js
│   │   │   │   └── ManageOrganizers.js
│   │   │   ├── auth/
│   │   │   │   ├── Login.js
│   │   │   │   └── Register.js
│   │   │   ├── organizer/
│   │   │   │   ├── CreateEvent.js
│   │   │   │   ├── Dashboard.js
│   │   │   │   └── Profile.js
│   │   │   └── participant/
│   │   │       ├── BrowseEvents.js
│   │   │       ├── ClubsListing.js
│   │   │       ├── Dashboard.js
│   │   │       ├── EventDetails.js
│   │   │       └── Profile.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── services.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── deployment.txt
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- npm or yarn package manager

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   - MongoDB connection string
   - JWT secret
   - Email credentials
   - Admin credentials

5. Start the backend server:
   ```bash
   npm run dev  # For development with nodemon
   npm start    # For production
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with the backend API URL

5. Start the frontend development server:
   ```bash
   npm start
   ```

### Database Setup
1. Create a MongoDB database (MongoDB Atlas recommended)
2. Update the `MONGODB_URI` in the backend `.env` file
3. The database will be populated automatically when the server starts

## API Endpoints

### Authentication Routes (`/api/auth`)
- POST `/register/participant` - Register new participant
- POST `/login` - Login user (all roles)
- GET `/me` - Get current user info (Protected)

### Participant Routes (`/api/participants`)
- GET `/profile` - Get participant profile (Protected)
- PUT `/profile` - Update participant profile (Protected)
- GET `/dashboard` - Get participant dashboard (Protected)
- POST `/follow/:organizerId` - Follow/unfollow organizer (Protected)

### Organizer Routes (`/api/organizers`)
- GET `/` - Get all organizers (Public)
- GET `/:id` - Get organizer by ID (Public)
- GET `/profile` - Get organizer profile (Protected - Organizer)
- PUT `/profile` - Update organizer profile (Protected - Organizer)
- GET `/dashboard` - Get organizer dashboard (Protected - Organizer)

### Event Routes (`/api/events`)
- GET `/` - Get all events with filters (Public)
- GET `/trending` - Get trending events (Public)
- GET `/:id` - Get event by ID (Public)
- POST `/` - Create new event (Protected - Organizer)
- PUT `/:id` - Update event (Protected - Organizer)
- DELETE `/:id` - Delete event (Protected - Organizer)

### Registration Routes (`/api/registrations`)
- POST `/` - Register for event (Protected - Participant)
- GET `/` - Get user registrations (Protected - Participant)
- GET `/event/:eventId` - Get event participants (Protected - Organizer)
- DELETE `/:id` - Cancel registration (Protected - Participant)

### Admin Routes (`/api/admin`)
- GET `/dashboard` - Get admin dashboard (Protected - Admin)
- POST `/organizers` - Create organizer (Protected - Admin)
- GET `/organizers` - Get all organizers (Protected - Admin)
- DELETE `/organizers/:id` - Delete organizer (Protected - Admin)

## User Roles

### Participant
- IIIT Students (require IIIT email)
- Non-IIIT Participants
- Features: Browse events, register for events, view tickets, manage profile

### Organizer
- Clubs, Councils, Fest Teams
- Created by Admin
- Features: Create/manage events, view participants, analytics

### Admin
- System administrator
- Features: Create/remove organizers, manage system

## Development Notes
- All passwords are hashed using bcrypt
- JWT authentication is implemented for all protected routes
- Role-based access control is enforced
- Email notifications for event registrations
- QR code generation for tickets

## Deployment
See `deployment.txt` for deployment URLs and instructions.

## Testing
TODO: Add testing instructions

## Contributors
[Your Name] - [Roll Number]

## License
This project is created for academic purposes as part of the DASS course assignment.
