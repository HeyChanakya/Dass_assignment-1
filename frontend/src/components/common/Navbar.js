import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ role, onLogout }) => {
  const getNavLinks = () => {
    switch (role) {
      case 'participant':
        return (
          <>
            <Link to="/participant/dashboard">Dashboard</Link>
            <Link to="/participant/browse-events">Browse Events</Link>
            <Link to="/participant/clubs">Clubs</Link>
            <Link to="/participant/profile">Profile</Link>
          </>
        );
      case 'organizer':
        return (
          <>
            <Link to="/organizer/dashboard">Dashboard</Link>
            <Link to="/organizer/create-event">Create Event</Link>
            <Link to="/organizer/profile">Profile</Link>
          </>
        );
      case 'admin':
        return (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/organizers">Manage Organizers</Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">Felicity</div>
      <div className="navbar-links">
        {getNavLinks()}
        <button onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
