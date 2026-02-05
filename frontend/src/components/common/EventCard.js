import React from 'react';

const EventCard = ({ event }) => {
  return (
    <div className="event-card">
      <h3>{event.eventName}</h3>
      <p>{event.eventDescription}</p>
      <p>Type: {event.eventType}</p>
      <p>Date: {new Date(event.eventStartDate).toLocaleDateString()}</p>
      <p>Organizer: {event.organizer?.organizerName}</p>
      {/* TODO: Add more event details and styling */}
    </div>
  );
};

export default EventCard;
