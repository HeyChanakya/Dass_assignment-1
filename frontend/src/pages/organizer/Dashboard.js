import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { organizerService } from '../../services/services';
import './Organizer.css';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eventFilter, setEventFilter] = useState('all');

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

  const getFilteredEvents = () => {
    if (!dashboardData?.events) return [];
    if (eventFilter === 'all') return dashboardData.events;
    return dashboardData.events.filter(event => event.status === eventFilter);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Published':
        return 'status-published';
      case 'Draft':
        return 'status-draft';
      case 'Ongoing':
        return 'status-ongoing';
      case 'Completed':
        return 'status-completed';
      case 'Closed':
        return 'status-closed';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  const analytics = dashboardData?.analytics || {};

  return (
    <div className="page-wrapper">
      <Navbar role="organizer" onLogout={handleLogout} />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>Organizer Dashboard</h1>
            <p className="subtitle">Manage your events and track performance</p>
          </div>
          <button 
            className="btn-primary"
            onClick={() => navigate('/organizer/create-event')}
          >
            <span className="icon">➕</span>
            Create New Event
          </button>
        </div>

        {/* Analytics Cards */}
        <div className="stats-overview">
          <div className="stat-box gradient-blue">
            <div className="stat-icon">📊</div>
            <div className="stat-details">
              <h3>{analytics.totalEvents || 0}</h3>
              <p>Total Events</p>
            </div>
          </div>
          <div className="stat-box gradient-green">
            <div className="stat-icon">✅</div>
            <div className="stat-details">
              <h3>{analytics.completedEvents || 0}</h3>
              <p>Completed Events</p>
            </div>
          </div>
          <div className="stat-box gradient-purple">
            <div className="stat-icon">👥</div>
            <div className="stat-details">
              <h3>{analytics.totalRegistrations || 0}</h3>
              <p>Total Registrations</p>
            </div>
          </div>
          <div className="stat-box gradient-orange">
            <div className="stat-icon">💰</div>
            <div className="stat-details">
              <h3>₹{analytics.totalRevenue || 0}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>

        {/* Events Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>
              <span className="icon-emoji">🎭</span>
              My Events
            </h2>
            {dashboardData?.events?.length > 0 && (
              <span className="count-badge">{dashboardData.events.length}</span>
            )}
          </div>

          {/* Event Filters */}
          <div className="tabs">
            {['all', 'Published', 'Draft', 'Ongoing', 'Completed', 'Closed'].map(filter => (
              <button 
                key={filter}
                className={`tab-button ${eventFilter === filter ? 'active' : ''}`}
                onClick={() => setEventFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          <div className="events-grid">
            {getFilteredEvents().length > 0 ? (
              getFilteredEvents().map((event) => (
                <div key={event._id} className="event-card modern-card">
                  <div className="event-header">
                    <h3>{event.eventName}</h3>
                    <span className={`status-badge ${getStatusBadgeClass(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                  <p className="event-description">{event.eventDescription?.substring(0, 100)}...</p>
                  <div className="event-meta-info">
                    <div className="meta-item">
                      <span className="icon">📅</span>
                      {formatDate(event.eventStartDate)}
                    </div>
                    <div className="meta-item">
                      <span className="icon">🎭</span>
                      {event.eventType}
                    </div>
                    <div className="meta-item">
                      <span className="icon">👥</span>
                      {event.currentRegistrations || 0}/{event.registrationLimit}
                    </div>
                    <div className="meta-item">
                      <span className="icon">💰</span>
                      {event.registrationFee === 0 ? 'Free' : `₹${event.registrationFee}`}
                    </div>
                  </div>
                  <div className="event-actions">
                    <button 
                      className="btn-small btn-view"
                      onClick={() => navigate(`/organizer/events/${event._id}`)}
                    >
                      View Details
                    </button>
                    <button 
                      className="btn-small btn-edit"
                      onClick={() => navigate(`/organizer/events/${event._id}/edit`)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No events found</h3>
                <p>
                  {eventFilter === 'all' 
                    ? "Create your first event to get started!" 
                    : `No ${eventFilter.toLowerCase()} events yet.`}
                </p>
                {eventFilter === 'all' && (
                  <button 
                    className="btn-primary"
                    onClick={() => navigate('/organizer/create-event')}
                  >
                    Create Event
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
