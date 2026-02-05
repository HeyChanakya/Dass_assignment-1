import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';

const ParticipantProfile = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    collegeName: '',
    areasOfInterest: [],
    followedClubs: []
  });

  useEffect(() => {
    // TODO: Fetch participant profile
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    // TODO: Implement profile update logic
  };

  const handleLogout = () => {
    // TODO: Implement logout
  };

  return (
    <div>
      <Navbar role="participant" onLogout={handleLogout} />
      <div className="profile-container">
        <h1>My Profile</h1>
        <form onSubmit={handleUpdate}>
          {/* TODO: Add profile form fields */}
          <button type="submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default ParticipantProfile;
