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

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <Navbar role="admin" onLogout={handleLogout} />
      <div className="dashboard-container">
        <h1>Admin Dashboard</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{dashboardData?.totalParticipants || 0}</h3>
            <p>Total Participants</p>
          </div>
          <div className="stat-card">
            <h3>{dashboardData?.totalOrganizers || 0}</h3>
            <p>Total Organizers</p>
          </div>
          <div className="stat-card">
            <h3>{dashboardData?.totalEvents || 0}</h3>
            <p>Total Events</p>
          </div>
          <div className="stat-card">
            <h3>{dashboardData?.totalRegistrations || 0}</h3>
            <p>Total Registrations</p>
          </div>
        </div>

        <section className="recent-data-section">
          <h2>Recent Participants</h2>
          <div className="data-table">
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
                      <td>{participant.firstName} {participant.lastName}</td>
                      <td>{participant.email}</td>
                      <td>{participant.participantType}</td>
                      <td>{new Date(participant.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No participants yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="recent-data-section">
          <h2>Recent Events</h2>
          <div className="data-table">
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
                      <td>{event.eventName}</td>
                      <td>{event.organizer?.organizerName}</td>
                      <td>{event.eventType}</td>
                      <td>{event.currentRegistrations || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">No events yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
