import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    // TODO: Fetch event details by ID
  }, [id]);

  const handleRegister = () => {
    // TODO: Implement registration logic
  };

  const handleLogout = () => {
    // TODO: Implement logout
  };

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar role="participant" onLogout={handleLogout} />
      <div className="event-details-container">
        <h1>{event.eventName}</h1>
        <p>{event.eventDescription}</p>
        {/* TODO: Display complete event details */}
        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
};

export default EventDetails;
