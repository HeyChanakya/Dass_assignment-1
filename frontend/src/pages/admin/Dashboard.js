import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { adminService } from '../../services/services';
import './Admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await adminService.getDashboard();
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
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navbar role="admin" onLogout={handleLogout} />
      <div className="admin-dashboard-container">
        {/* Header */}
        <div className="admin-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <p className="subtitle">System-wide analytics and management</p>
          </div>
          <button 
            className="btn-primary"
            onClick={() => navigate('/admin/manage-organizers')}
          >
            <span className="icon">⚙️</span>
            Manage Organizers
          </button>
        </div>
        
        {/* Stats Overview */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card gradient-blue">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{dashboardData?.totalParticipants || 0}</h3>
              <p>Total Participants</p>
            </div>
          </div>
          <div className="admin-stat-card gradient-green">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3>{dashboardData?.totalOrganizers || 0}</h3>
              <p>Total Organizers</p>
            </div>
          </div>
          <div className="admin-stat-card gradient-purple">
            <div className="stat-icon">🎭</div>
            <div className="stat-content">
              <h3>{dashboardData?.totalEvents || 0}</h3>
              <p>Total Events</p>
            </div>
          </div>
          <div className="admin-stat-card gradient-orange">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <h3>{dashboardData?.totalRegistrations || 0}</h3>
              <p>Total Registrations</p>
            </div>
          </div>
        </div>

        {/* Recent Data Sections */}
        <div className="admin-sections-grid">
          <section className="admin-section">
            <div className="section-header">
              <h2>
                <span className="icon-emoji">👥</span>
                Recent Participants
              </h2>
              {dashboardData?.recentParticipants?.length > 0 && (
                <span className="count-badge">{dashboardData.recentParticipants.length}</span>
              )}
            </div>
            <div className="modern-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.recentParticipants && dashboardData.recentParticipants.length > 0 ? (
                    dashboardData.recentParticipants.map((participant) => (
                      <tr key={participant._id}>
                        <td>
                          <strong>{participant.firstName} {participant.lastName}</strong>
                        </td>
                        <td>{participant.email}</td>
                        <td>
                          <span className="type-badge">{participant.participantType}</span>
                        </td>
                        <td>{formatDate(participant.createdAt)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="empty-cell">
                        <div className="empty-state-small">
                          <span>📋</span>
                          <p>No participants yet</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="admin-section">
            <div className="section-header">
              <h2>
                <span className="icon-emoji">🎭</span>
                Recent Events
              </h2>
              {dashboardData?.recentEvents?.length > 0 && (
                <span className="count-badge">{dashboardData.recentEvents.length}</span>
              )}
            </div>
            <div className="modern-table">
              <table>
                <thead>
                  <tr>
                    <th>Event Name</th>
                    <th>Organizer</th>
                    <th>Type</th>
                    <th>Registrations</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData?.recentEvents && dashboardData.recentEvents.length > 0 ? (
                    dashboardData.recentEvents.map((event) => (
                      <tr key={event._id}>
                        <td><strong>{event.eventName}</strong></td>
                        <td>{event.organizer?.organizerName || 'N/A'}</td>
                        <td>
                          <span className="type-badge">{event.eventType}</span>
                        </td>
                        <td>
                          <span className="registration-count">
                            {event.currentRegistrations || 0}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="empty-cell">
                        <div className="empty-state-small">
                          <span>🎭</span>
                          <p>No events yet</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
