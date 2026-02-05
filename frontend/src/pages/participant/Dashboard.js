import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { participantService } from '../../services/services';
import './Participant.css';

const ParticipantDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await participantService.getDashboard();
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

  const getFilteredHistory = () => {
    if (!dashboardData) return [];
    
    const allRegistrations = [
      ...(dashboardData.upcomingEvents || []),
      ...(dashboardData.completedEvents || []),
      ...(dashboardData.cancelledEvents || [])
    ];

    switch (activeTab) {
      case 'normal':
        return dashboardData.normalEvents || [];
      case 'merchandise':
        return dashboardData.merchandiseEvents || [];
      case 'completed':
        return dashboardData.completedEvents || [];
      case 'cancelled':
        return dashboardData.cancelledEvents || [];
      default:
        return allRegistrations;
    }
  };

  return (
    <div>
      <Navbar role="participant" onLogout={handleLogout} />
      <div className="dashboard-container">
        <h1>My Dashboard</h1>
        
        <section className="dashboard-section">
          <h2>Upcoming Events</h2>
          <div className="events-grid">
            {dashboardData?.upcomingEvents?.length > 0 ? (
              dashboardData.upcomingEvents.map((reg) => (
                <div key={reg._id} className="event-card">
                  <h3>{reg.event?.eventName}</h3>
                  <p><strong>Type:</strong> {reg.event?.eventType}</p>
                  <p><strong>Organizer:</strong> {reg.event?.organizer?.organizerName}</p>
                  <p><strong>Date:</strong> {reg.event && new Date(reg.event.eventStartDate).toLocaleDateString()}</p>
                  <p><strong>Ticket ID:</strong> {reg.ticketId}</p>
                </div>
              ))
            ) : (
              <p>No upcoming events. Browse events to register!</p>
            )}
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Participation History</h2>
          <div className="tabs">
            {['all', 'normal', 'merchandise', 'completed', 'cancelled'].map(tab => (
              <button 
                key={tab}
                className={activeTab === tab ? 'active' : ''}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="history-list">
            {getFilteredHistory().length > 0 ? (
              getFilteredHistory().map((reg) => (
                <div key={reg._id} className="history-item">
                  <div className="history-info">
                    <h4>{reg.event?.eventName}</h4>
                    <p><strong>Type:</strong> {reg.event?.eventType}</p>
                    <p><strong>Status:</strong> {reg.registrationStatus}</p>
                  </div>
                  <span className="ticket-id">{reg.ticketId}</span>
                </div>
              ))
            ) : (
              <p>No records found</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ParticipantDashboard;
