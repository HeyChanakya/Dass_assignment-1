import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { participantService } from '../../services/services';
import './Participant.css';

const ParticipantDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showQR, setShowQR] = useState(null);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'status-confirmed';
      case 'Cancelled':
      case 'Rejected':
        return 'status-cancelled';
      case 'Pending':
        return 'status-pending';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navbar role="participant" onLogout={handleLogout} />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="header-content">
            <h1>My Dashboard</h1>
            <p className="subtitle">Track your events and participation</p>
          </div>
          <button 
            className="btn-primary"
            onClick={() => navigate('/participant/browse-events')}
          >
            <span className="icon">🔍</span>
            Browse Events
          </button>
        </div>

        {/* Quick Stats */}
        <div className="stats-overview">
          <div className="stat-box">
            <div className="stat-icon">📅</div>
            <div className="stat-details">
              <h3>{dashboardData?.upcomingEvents?.length || 0}</h3>
              <p>Upcoming Events</p>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">✅</div>
            <div className="stat-details">
              <h3>{dashboardData?.completedEvents?.length || 0}</h3>
              <p>Completed</p>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">🎫</div>
            <div className="stat-details">
              <h3>{(dashboardData?.upcomingEvents?.length || 0) + (dashboardData?.completedEvents?.length || 0)}</h3>
              <p>Total Registrations</p>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon">🏆</div>
            <div className="stat-details">
              <h3>{dashboardData?.normalEvents?.length || 0}</h3>
              <p>Normal Events</p>
            </div>
          </div>
        </div>
        
        <section className="dashboard-section">
          <div className="section-header">
            <h2>
              <span className="icon-emoji">🎉</span>
              Upcoming Events
            </h2>
            {dashboardData?.upcomingEvents?.length > 0 && (
              <span className="count-badge">{dashboardData.upcomingEvents.length}</span>
            )}
          </div>
          <div className="events-grid">
            {dashboardData?.upcomingEvents?.length > 0 ? (
              dashboardData.upcomingEvents.map((reg) => (
                <div key={reg._id} className="event-card modern-card">
                  <div className="event-header">
                    <h3>{reg.event?.eventName}</h3>
                    <span className={`status-badge ${getStatusBadgeClass(reg.registrationStatus)}`}>
                      {reg.registrationStatus}
                    </span>
                  </div>
                  <div className="event-organizer">
                    <span className="icon">🏢</span>
                    {reg.event?.organizer?.organizerName}
                  </div>
                  <div className="event-meta-info">
                    <div className="meta-item">
                      <span className="icon">📅</span>
                      {reg.event && formatDate(reg.event.eventStartDate)}
                    </div>
                    <div className="meta-item">
                      <span className="icon">🎭</span>
                      {reg.event?.eventType}
                    </div>
                  </div>
                  <div className="event-actions">
                    <div className="ticket-id-display">
                      <span className="ticket-label">Ticket:</span>
                      <span className="ticket-code">{reg.ticketId}</span>
                    </div>
                    {reg.qrCode && (
                      <button 
                        className="btn-small btn-view-qr"
                        onClick={() => setShowQR(reg)}
                      >
                        View QR
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>No upcoming events</h3>
                <p>Browse events to register and get started!</p>
                <button 
                  className="btn-primary"
                  onClick={() => navigate('/participant/browse-events')}
                >
                  Browse Events
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>
              <span className="icon-emoji">📜</span>
              Participation History
            </h2>
          </div>
          <div className="tabs">
            {['all', 'normal', 'merchandise', 'completed', 'cancelled'].map(tab => (
              <button 
                key={tab}
                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="history-list">
            {getFilteredHistory().length > 0 ? (
              getFilteredHistory().map((reg) => (
                <div key={reg._id} className="history-item modern-item">
                  <div className="history-main">
                    <div className="history-info">
                      <h4>{reg.event?.eventName}</h4>
                      <div className="history-meta">
                        <span className="meta-badge">{reg.event?.eventType}</span>
                        <span className={`status-badge ${getStatusBadgeClass(reg.registrationStatus)}`}>
                          {reg.registrationStatus}
                        </span>
                        <span className="meta-text">
                          {reg.event && formatDate(reg.event.eventStartDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="history-ticket">
                    <span className="ticket-id">{reg.ticketId}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state-small">
                <p>No records found</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="modal-overlay" onClick={() => setShowQR(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowQR(null)}>×</button>
            <h2>Event Ticket</h2>
            <div className="qr-display">
              <h3>{showQR.event?.eventName}</h3>
              <img src={showQR.qrCode} alt="QR Code" className="qr-code-image" />
              <div className="qr-details">
                <p><strong>Ticket ID:</strong> {showQR.ticketId}</p>
                <p><strong>Date:</strong> {showQR.event && formatDate(showQR.event.eventStartDate)}</p>
                <p><strong>Status:</strong> {showQR.registrationStatus}</p>
              </div>
              <p className="qr-instruction">Show this QR code at the event venue</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantDashboard;
