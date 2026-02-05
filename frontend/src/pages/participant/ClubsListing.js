import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { organizerService, participantService } from '../../services/services';
import './Participant.css';

const ClubsListing = () => {
  const navigate = useNavigate();
  const [organizers, setOrganizers] = useState([]);
  const [filteredOrganizers, setFilteredOrganizers] = useState([]);
  const [followedClubs, setFollowedClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFollowedOnly, setShowFollowedOnly] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterOrganizers();
  }, [searchTerm, selectedCategory, showFollowedOnly, organizers, followedClubs]);

  const fetchData = async () => {
    try {
      const [clubsData, profileData] = await Promise.all([
        organizerService.getAllOrganizers(),
        participantService.getProfile()
      ]);
      
      setOrganizers(clubsData);
      setFollowedClubs(profileData.followedClubs?.map(c => c._id || c) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrganizers = () => {
    let filtered = [...organizers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(org => 
        org.organizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(org => org.category === selectedCategory);
    }

    // Followed filter
    if (showFollowedOnly) {
      filtered = filtered.filter(org => followedClubs.includes(org._id));
    }

    setFilteredOrganizers(filtered);
  };

  const getCategories = () => {
    const categories = [...new Set(organizers.map(org => org.category).filter(Boolean))];
    return categories.sort();
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Arts & Performance': '🎭',
      'Technology': '💻',
      'Arts & Media': '🎨',
      'Literature & Writing': '📚',
      'Sports & Fitness': '⚽',
      'Academic': '🎓',
      'Business & Innovation': '💼',
      'Social & Environmental': '🌱',
      'Fashion & Design': '👗',
      'Gaming': '🎮'
    };
    return icons[category] || '🏛️';
  };

  const handleFollow = async (organizerId) => {
    try {
      const result = await participantService.followOrganizer(organizerId);
      
      // Update local state
      if (followedClubs.includes(organizerId)) {
        setFollowedClubs(followedClubs.filter(id => id !== organizerId));
        // Update organizer followers count
        setOrganizers(organizers.map(org => 
          org._id === organizerId 
            ? { ...org, followers: org.followers?.filter(f => f !== organizerId) || [] }
            : org
        ));
      } else {
        setFollowedClubs([...followedClubs, organizerId]);
        // Update organizer followers count
        setOrganizers(organizers.map(org => 
          org._id === organizerId 
            ? { ...org, followers: [...(org.followers || []), organizerId] }
            : org
        ));
      }
    } catch (error) {
      console.error('Error following/unfollowing:', error);
      alert('Failed to update follow status. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading clubs...</p>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navbar role="participant" onLogout={handleLogout} />
      <div className="clubs-container">
        {/* Header */}
        <div className="clubs-header">
          <div className="header-content">
            <h1>🏛️ Clubs & Societies</h1>
            <p className="subtitle">Discover and join amazing student organizations</p>
          </div>
          <div className="clubs-stats">
            <div className="stat-chip">
              <span className="stat-number">{organizers.length}</span>
              <span className="stat-label">Total Clubs</span>
            </div>
            <div className="stat-chip">
              <span className="stat-number">{followedClubs.length}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="clubs-filters-section">
          <div className="search-bar-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="clubs-search-bar"
              placeholder="Search clubs by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="clear-search"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>

          <div className="filter-controls">
            <div className="category-filters">
              <button
                className={`category-chip ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Categories
              </button>
              {getCategories().map(category => (
                <button
                  key={category}
                  className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {getCategoryIcon(category)} {category}
                </button>
              ))}
            </div>

            <button
              className={`followed-toggle ${showFollowedOnly ? 'active' : ''}`}
              onClick={() => setShowFollowedOnly(!showFollowedOnly)}
            >
              <span className="toggle-icon">{showFollowedOnly ? '✓' : '○'}</span>
              Following Only
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="results-info">
          <p>
            Showing <strong>{filteredOrganizers.length}</strong> club{filteredOrganizers.length !== 1 ? 's' : ''}
            {searchTerm && ` matching "${searchTerm}"`}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Clubs Grid */}
        <div className="clubs-grid">
          {filteredOrganizers.length > 0 ? (
            filteredOrganizers.map((club) => {
              const isFollowing = followedClubs.includes(club._id);
              return (
                <div key={club._id} className="club-card modern-club-card">
                  <div className="club-card-header">
                    <div className="club-icon">
                      {getCategoryIcon(club.category)}
                    </div>
                    <span className="category-badge">{club.category || 'General'}</span>
                  </div>
                  
                  <h3 className="club-name">{club.organizerName}</h3>
                  <p className="club-description">{club.description}</p>
                  
                  <div className="club-info-grid">
                    <div className="info-item">
                      <span className="info-icon">📧</span>
                      <span className="info-text">{club.contactEmail || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">📱</span>
                      <span className="info-text">{club.contactNumber || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">👥</span>
                      <span className="info-text">{club.followers?.length || 0} followers</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleFollow(club._id)}
                    className={`follow-button ${isFollowing ? 'following' : ''}`}
                  >
                    <span className="follow-icon">{isFollowing ? '✓' : '+'}</span>
                    {isFollowing ? 'Following' : 'Follow Club'}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="empty-state-full">
              <div className="empty-icon-large">🔍</div>
              <h3>No clubs found</h3>
              <p>
                {searchTerm || selectedCategory !== 'all' || showFollowedOnly
                  ? 'Try adjusting your filters or search term'
                  : 'No clubs are available at the moment'}
              </p>
              {(searchTerm || selectedCategory !== 'all' || showFollowedOnly) && (
                <button 
                  className="btn-primary"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setShowFollowedOnly(false);
                  }}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubsListing;
