import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { organizerService, participantService } from '../../services/services';
import './Participant.css';

const ClubsListing = () => {
  const navigate = useNavigate();
  const [organizers, setOrganizers] = useState([]);
  const [followedClubs, setFollowedClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clubsData, profileData] = await Promise.all([
        organizerService.getAllOrganizers(),
        participantService.getProfile()
      ]);
      
      setOrganizers(clubsData);
      setFollowedClubs(profileData.followedClubs || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (organizerId) => {
    try {
      await participantService.followOrganizer(organizerId);
      if (followedClubs.includes(organizerId)) {
        setFollowedClubs(followedClubs.filter(id => id !== organizerId));
      } else {
        setFollowedClubs([...followedClubs, organizerId]);
      }
    } catch (error) {
      console.error('Error following/unfollowing:', error);
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
      <div className="clubs-container">
        <h1>Clubs & Organizers</h1>
        
        <div className="clubs-grid">
          {organizers.length > 0 ? (
            organizers.map((club) => (
              <div key={club._id} className="club-card">
                <h3>{club.organizerName}</h3>
                <p className="category">{club.category}</p>
                <p className="description">{club.description}</p>
                <div className="club-meta">
                  <span>📧 {club.contactEmail}</span>
                  <span>👥 {club.followers?.length || 0} followers</span>
                </div>
                <button 
                  onClick={() => handleFollow(club._id)}
                  className={followedClubs.includes(club._id) ? 'following' : 'follow'}
                >
                  {followedClubs.includes(club._id) ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            ))
          ) : (
            <p>No clubs found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubsListing;
