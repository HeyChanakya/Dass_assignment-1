import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';

const ManageOrganizers = () => {
  const [organizers, setOrganizers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newOrganizer, setNewOrganizer] = useState({
    organizerName: '',
    category: '',
    description: '',
    contactEmail: ''
  });

  useEffect(() => {
    // TODO: Fetch all organizers
  }, []);

  const handleCreateOrganizer = async (e) => {
    e.preventDefault();
    // TODO: Implement organizer creation logic
  };

  const handleDeleteOrganizer = async (id) => {
    // TODO: Implement organizer deletion logic
  };

  const handleLogout = () => {
    // TODO: Implement logout
  };

  return (
    <div>
      <Navbar role="admin" onLogout={handleLogout} />
      <div className="manage-organizers-container">
        <h1>Manage Clubs/Organizers</h1>
        <button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Cancel' : 'Add New Organizer'}
        </button>

        {showCreateForm && (
          <form onSubmit={handleCreateOrganizer}>
            {/* TODO: Add organizer creation form */}
            <button type="submit">Create Organizer</button>
          </form>
        )}

        <div className="organizers-list">
          {organizers.map((organizer) => (
            <div key={organizer._id} className="organizer-item">
              <h3>{organizer.organizerName}</h3>
              <p>{organizer.category}</p>
              <button onClick={() => handleDeleteOrganizer(organizer._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageOrganizers;
