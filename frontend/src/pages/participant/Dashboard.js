import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';

const ParticipantDashboard = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    // TODO: Fetch participant's registered events
  }, []);

  const handleLogout = () => {
    // TODO: Implement logout
  };

  return (
    <div>
      <Navbar role="participant" onLogout={handleLogout} />
      <div className="dashboard-container">
        <h1>My Dashboard</h1>
        <section>
          <h2>Upcoming Events</h2>
          {/* TODO: Display upcoming events */}
        </section>
        <section>
          <h2>Participation History</h2>
          {/* TODO: Display participation history with tabs */}
        </section>
      </div>
    </div>
  );
};

export default ParticipantDashboard;
