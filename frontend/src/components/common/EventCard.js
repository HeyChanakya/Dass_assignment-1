import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="event-card clickable" 
      onClick={() => navigate(`/participant/events/${event._id}`)}
      style={{ cursor: 'pointer' }}
    >
      <h3>{event.eventName}</h3>
      <p>{event.eventDescription}</p>
      <p>Type: {event.eventType}</p>
      <p>Date: {new Date(event.eventStartDate).toLocaleDateString()}</p>
      <p>Organizer: {event.organizer?.organizerName}</p>
      <p>Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}</p>
      <p>Spots: {event.currentRegistrations || 0}/{event.registrationLimit}</p>
      {event.registrationFee > 0 && <p>Fee: ₹{event.registrationFee}</p>}
    </div>
  );
};

export default EventCard;
