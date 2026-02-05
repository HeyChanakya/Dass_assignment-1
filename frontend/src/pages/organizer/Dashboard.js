import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { organizerService } from '../../services/services';
import './Organizer.css';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await organizerService.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <Navbar role="organizer" onLogout={handleLogout} />
      <div className="dashboard-container">
        <h1>Organizer Dashboard</h1>
        
        <div className="analytics-cards">
          <div className="stat-card">
            <h3>{dashboardData?.totalEvents || 0}</h3>
            <p>Total Events</p>
          </div>
          <div className="stat-card">
            <h3>{dashboardData?.totalRegistrations || 0}</h3>
            <p>Total Registrations</p>
          </div>
          <div className="stat-card">
            <h3>₹{dashboardData?.totalRevenue || 0}</h3>
            <p>Total Revenue</p>
          </div>
        </div>

        <section className="events-carousel">
          <h2>My Events</h2>
          <div className="carousel-controls">
            <button onClick={() => navigate('/organizer/create-event')}>
              Create New Event
            </button>
          </div>
          <div className="events-list">
            {dashboardData?.events && dashboardData.events.length > 0 ? (
              dashboardData.events.map((event) => (
                <div key={event._id} className="event-item">
                  <h4>{event.eventName}</h4>
                  <span className={`status-badge ${event.status.toLowerCase()}`}>
                    {event.status}
                  </span>
                  <p>{event.eventDescription}</p>
                  <div className="event-stats">
                    <span>📅 {new Date(event.eventStartDate).toLocaleDateString()}</span>
                    <span>👥 {event.currentRegistrations || 0}/{event.registrationLimit}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No events yet. Create your first event!</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
