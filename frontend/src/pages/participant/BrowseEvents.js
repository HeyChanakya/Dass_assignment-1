import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import EventCard from '../../components/common/EventCard';
import { eventService } from '../../services/services';
import './Participant.css';

const BrowseEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    eventType: '',
    eligibility: '',
    dateRange: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [filters, searchTerm]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filters.eventType) params.eventType = filters.eventType;
      if (filters.eligibility) params.eligibility = filters.eligibility;

      const data = await eventService.getAllEvents(params);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div>
      <Navbar role="participant" onLogout={handleLogout} />
      <div className="browse-container">
        <h1>Browse Events</h1>
        
        <div className="filters-panel">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select 
            value={filters.eventType}
            onChange={(e) => setFilters({...filters, eventType: e.target.value})}
          >
            <option value="">All Types</option>
            <option value="Normal">Normal</option>
            <option value="Merchandise">Merchandise</option>
          </select>

          <select 
            value={filters.eligibility}
            onChange={(e) => setFilters({...filters, eligibility: e.target.value})}
          >
            <option value="">All Eligibility</option>
            <option value="IIIT">IIIT Only</option>
            <option value="Non-IIIT">Non-IIIT</option>
            <option value="Both">Both</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">Loading events...</div>
        ) : (
          <div className="events-grid">
            {events.length > 0 ? (
              events.map((event) => (
                <div 
                  key={event._id} 
                  className="event-card clickable"
                  onClick={() => navigate(`/participant/events/${event._id}`)}
                >
                  <h3>{event.eventName}</h3>
                  <p className="organizer">{event.organizer?.organizerName}</p>
                  <p className="description">{event.eventDescription}</p>
                  <div className="event-meta">
                    <span className="badge">{event.eventType}</span>
                    <span className="badge">{event.eligibility}</span>
                    {event.registrationFee > 0 && (
                      <span className="fee">₹{event.registrationFee}</span>
                    )}
                  </div>
                  <p className="deadline">
                    Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="no-results">No events found. Try adjusting your filters.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseEvents;
