import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';

const ClubsListing = () => {
  const [organizers, setOrganizers] = useState([]);

  useEffect(() => {
    // TODO: Fetch all organizers/clubs
  }, []);

  const handleFollow = (organizerId) => {
    // TODO: Implement follow/unfollow logic
  };

  const handleLogout = () => {
    // TODO: Implement logout
  };

  return (
    <div>
      <Navbar role="participant" onLogout={handleLogout} />
      <div className="clubs-listing-container">
        <h1>Clubs & Organizers</h1>
        <div className="clubs-grid">
          {organizers.map((organizer) => (
            <div key={organizer._id} className="club-card">
              <h3>{organizer.organizerName}</h3>
              <p>{organizer.category}</p>
              <p>{organizer.description}</p>
              <button onClick={() => handleFollow(organizer._id)}>
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClubsListing;
