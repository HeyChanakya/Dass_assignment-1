import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { organizerService } from '../../services/services';
import './Organizer.css';

const OrganizerProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await organizerService.getProfile();
      setProfile(data);
      setFormData({
        organizerName: data.organizerName || '',
        category: data.category || '',
        description: data.description || '',
        contactEmail: data.contactEmail || '',
        contactNumber: data.contactNumber || '',
        discordWebhook: data.discordWebhook || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await organizerService.updateProfile(formData);
      setMessage('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
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
      <div className="profile-container">
        <h1>Organizer Profile</h1>
        
        {message && <div className="message">{message}</div>}
        
        <form onSubmit={handleUpdate} className="profile-form">
          <div className="form-group">
            <label>Login Email</label>
            <input type="email" value={profile?.loginEmail} disabled />
          </div>

          <div className="form-group">
            <label>Organizer Name</label>
            <input
              type="text"
              name="organizerName"
              value={formData.organizerName}
              onChange={handleInputChange}
              disabled={!editing}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              disabled={!editing}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={!editing}
            />
          </div>

          <div className="form-group">
            <label>Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleInputChange}
              disabled={!editing}
            />
          </div>

          <div className="form-group">
            <label>Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleInputChange}
              disabled={!editing}
            />
          </div>

          <div className="form-group">
            <label>Discord Webhook URL</label>
            <input
              type="url"
              name="discordWebhook"
              value={formData.discordWebhook}
              onChange={handleInputChange}
              disabled={!editing}
              placeholder="https://discord.com/api/webhooks/..."
            />
          </div>

          <div className="button-group">
            {editing ? (
              <>
                <button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizerProfile;
