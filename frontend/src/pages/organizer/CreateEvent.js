import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar';

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    eventName: '',
    eventDescription: '',
    eventType: 'Normal',
    registrationDeadline: '',
    eventStartDate: '',
    eventEndDate: '',
    eligibility: '',
    registrationLimit: 0,
    registrationFee: 0,
    eventTags: []
  });

  const handleChange = (e) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement event creation logic
    console.log('Event created', eventData);
  };

  const handleLogout = () => {
    // TODO: Implement logout
  };

  return (
    <div>
      <Navbar role="organizer" onLogout={handleLogout} />
      <div className="create-event-container">
        <h1>Create New Event</h1>
        <form onSubmit={handleSubmit}>
          {/* TODO: Add complete event creation form */}
          <button type="submit">Create Event</button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
