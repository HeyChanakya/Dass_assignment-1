import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import EventCard from '../../components/common/EventCard';

const BrowseEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    eventType: '',
    eligibility: '',
    dateRange: ''
  });

  useEffect(() => {
    // TODO: Fetch events based on filters
  }, [filters, searchTerm]);

  const handleLogout = () => {
    // TODO: Implement logout
  };

  return (
    <div>
      <Navbar role="participant" onLogout={handleLogout} />
      <div className="browse-events-container">
        <h1>Browse Events</h1>
        <div className="search-filter-section">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* TODO: Add filter dropdowns */}
        </div>
        <div className="events-grid">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrowseEvents;
