import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { adminService } from '../../services/services';
import './Admin.css';

const ManageOrganizers = () => {
  const navigate = useNavigate();
  const [organizers, setOrganizers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newOrganizer, setNewOrganizer] = useState({
    organizerName: '',
    category: '',
    description: '',
    contactEmail: ''
  });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [credentials, setCredentials] = useState(null);

  useEffect(() => {
    fetchOrganizers();
  }, []);

  const fetchOrganizers = async () => {
    try {
      const data = await adminService.getAllOrganizers();
      setOrganizers(data);
    } catch (error) {
      console.error('Error fetching organizers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewOrganizer({
      ...newOrganizer,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateOrganizer = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    setSuccess('');

    try {
      const response = await adminService.createOrganizer(newOrganizer);
      setCredentials(response.credentials);
      setSuccess('Organizer created successfully!');
      setNewOrganizer({
        organizerName: '',
        category: '',
        description: '',
        contactEmail: ''
      });
      fetchOrganizers();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create organizer');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteOrganizer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this organizer?')) return;

    try {
      await adminService.deleteOrganizer(id);
      setSuccess('Organizer deleted successfully');
      fetchOrganizers();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete organizer');
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
      <div className="manage-organizers-container">
        <h1>Manage Clubs/Organizers</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <div className="action-buttons">
          <button onClick={() => {
            setShowCreateForm(!showCreateForm);
            setCredentials(null);
          }}>
            {showCreateForm ? 'Cancel' : 'Add New Organizer'}
          </button>
        </div>

        {showCreateForm && (
          <div className="create-form">
            <h2>Create New Organizer</h2>
            <form onSubmit={handleCreateOrganizer}>
              <div className="form-row">
                <div className="form-group">
                  <label>Organizer Name*</label>
                  <input
                    type="text"
                    name="organizerName"
                    value={newOrganizer.organizerName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category*</label>
                  <input
                    type="text"
                    name="category"
                    value={newOrganizer.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Sports, Cultural, Technical"
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Description*</label>
                <textarea
                  name="description"
                  value={newOrganizer.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Contact Email*</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={newOrganizer.contactEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <button type="submit" className="submit-btn" disabled={creating}>
                {creating ? 'Creating...' : 'Create Organizer'}
              </button>
            </form>
            
            {credentials && (
              <div className="credentials-box">
                <h3>⚠️ Organizer Credentials Created</h3>
                <p><strong>Login Email:</strong> {credentials.loginEmail}</p>
                <p><strong>Password:</strong> {credentials.password}</p>
                <p className="warning">
                  ⚠️ IMPORTANT: Save these credentials! They will not be shown again.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="organizers-grid">
          {organizers.length > 0 ? (
            organizers.map((organizer) => (
              <div key={organizer._id} className="organizer-card">
                <h3>{organizer.organizerName}</h3>
                <p className="category">{organizer.category}</p>
                <p className="description">{organizer.description}</p>
                <div className="organizer-meta">
                  <span>📧 {organizer.contactEmail}</span>
                  <span>👥 {organizer.followers?.length || 0} followers</span>
                  <span>🎯 {organizer.events?.length || 0} events</span>
                </div>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteOrganizer(organizer._id)}
                >
                  Delete Organizer
                </button>
              </div>
            ))
          ) : (
            <p>No organizers found. Create one to get started!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageOrganizers;

