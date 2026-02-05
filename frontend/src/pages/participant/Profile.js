import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { participantService } from '../../services/services';
import './Participant.css';

const ParticipantProfile = () => {
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
      const data = await participantService.getProfile();
      setProfile(data);
      setFormData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        contactNumber: data.contactNumber || '',
        collegeName: data.collegeName || '',
        areasOfInterest: data.areasOfInterest?.join(', ') || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const updateData = {
        ...formData,
        areasOfInterest: formData.areasOfInterest.split(',').map(s => s.trim()).filter(Boolean)
      };
      
      await participantService.updateProfile(updateData);
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
      <Navbar role="participant" onLogout={handleLogout} />
      <div className="profile-container">
        <h1>My Profile</h1>
        
        {message && <div className="message">{message}</div>}

        <form onSubmit={handleUpdate} className="profile-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={profile?.email} disabled />
          </div>

          <div className="form-group">
            <label>Participant Type</label>
            <input type="text" value={profile?.participantType} disabled />
          </div>

          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              disabled={!editing}
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              disabled={!editing}
            />
          </div>

          <div className="form-group">
            <label>Contact Number</label>
            <input
              type="text"
              value={formData.contactNumber}
              onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
              disabled={!editing}
            />
          </div>

          <div className="form-group">
            <label>College Name</label>
            <input
              type="text"
              value={formData.collegeName}
              onChange={(e) => setFormData({...formData, collegeName: e.target.value})}
              disabled={!editing}
            />
          </div>

          <div className="form-group">
            <label>Areas of Interest (comma-separated)</label>
            <input
              type="text"
              value={formData.areasOfInterest}
              onChange={(e) => setFormData({...formData, areasOfInterest: e.target.value})}
              disabled={!editing}
              placeholder="e.g., Sports, Music, Technology"
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

export default ParticipantProfile;
