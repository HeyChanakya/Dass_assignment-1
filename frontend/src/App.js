import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Participant Pages
import ParticipantDashboard from './pages/participant/Dashboard';
import BrowseEvents from './pages/participant/BrowseEvents';
import EventDetails from './pages/participant/EventDetails';
import ParticipantProfile from './pages/participant/Profile';
import ClubsListing from './pages/participant/ClubsListing';

// Organizer Pages
import OrganizerDashboard from './pages/organizer/Dashboard';
import CreateEvent from './pages/organizer/CreateEvent';
import OrganizerProfile from './pages/organizer/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageOrganizers from './pages/admin/ManageOrganizers';

// Components
import PrivateRoute from './components/common/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Participant Routes */}
            <Route 
              path="/participant/dashboard" 
              element={
                <PrivateRoute role="participant">
                  <ParticipantDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/participant/browse-events" 
              element={
                <PrivateRoute role="participant">
                  <BrowseEvents />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/participant/events/:id" 
              element={
                <PrivateRoute role="participant">
                  <EventDetails />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/participant/profile" 
              element={
                <PrivateRoute role="participant">
                  <ParticipantProfile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/participant/clubs" 
              element={
                <PrivateRoute role="participant">
                  <ClubsListing />
                </PrivateRoute>
              } 
            />

            {/* Organizer Routes */}
            <Route 
              path="/organizer/dashboard" 
              element={
                <PrivateRoute role="organizer">
                  <OrganizerDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/organizer/create-event" 
              element={
                <PrivateRoute role="organizer">
                  <CreateEvent />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/organizer/profile" 
              element={
                <PrivateRoute role="organizer">
                  <OrganizerProfile />
                </PrivateRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <PrivateRoute role="admin">
                  <AdminDashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/admin/organizers" 
              element={
                <PrivateRoute role="admin">
                  <ManageOrganizers />
                </PrivateRoute>
              } 
            />

            {/* Default Route */}
            <Route path="/" element={<Login />} />
          </Routes>
          <ToastContainer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
