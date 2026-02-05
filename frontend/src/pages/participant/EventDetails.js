import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { eventService, registrationService } from '../../services/services';
import './Participant.css';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const data = await eventService.getEventById(id);
      setEvent(data);
      if (data.customFormFields) {
        const initialFormData = {};
        data.customFormFields.forEach(field => {
          initialFormData[field.fieldName] = '';
        });
        setFormData(initialFormData);
      }
    } catch (error) {
      setError('Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError('');
    setSuccess('');
    setRegistering(true);

    try {
      const registrationData = {
        eventId: id,
        formResponses: formData
      };

      await registrationService.registerForEvent(registrationData);
      setSuccess('Registration successful! Check your email for the ticket.');
      setTimeout(() => navigate('/participant/dashboard'), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!event) return <div className="error">Event not found</div>;

  const isDeadlinePassed = new Date(event.registrationDeadline) < new Date();
  const isFull = event.currentRegistrations >= event.registrationLimit;

  return (
    <div>
      <Navbar role="participant" onLogout={handleLogout} />
      <div className="event-details-container">
        <h1>{event.eventName}</h1>
        
        <div className="event-info">
          <section>
            <h2>About</h2>
            <p>{event.eventDescription}</p>
          </section>

          <section>
            <h2>Organizer</h2>
            <p>{event.organizer?.organizerName}</p>
            <p>{event.organizer?.contactEmail}</p>
          </section>

          <section>
            <h2>Event Details</h2>
            <p><strong>Type:</strong> {event.eventType}</p>
            <p><strong>Eligibility:</strong> {event.eligibility}</p>
            <p><strong>Fee:</strong> {event.registrationFee > 0 ? `₹${event.registrationFee}` : 'Free'}</p>
            <p><strong>Registration Deadline:</strong> {new Date(event.registrationDeadline).toLocaleString()}</p>
            <p><strong>Event Start:</strong> {new Date(event.eventStartDate).toLocaleString()}</p>
            <p><strong>Event End:</strong> {new Date(event.eventEndDate).toLocaleString()}</p>
            <p><strong>Spots:</strong> {event.currentRegistrations || 0} / {event.registrationLimit}</p>
            <p><strong>Tags:</strong> {event.eventTags.join(', ')}</p>
          </section>

          {event.eventType === 'Merchandise' && event.merchandiseDetails && (
            <section>
              <h2>Merchandise</h2>
              <p><strong>Item:</strong> {event.merchandiseDetails.itemName}</p>
              <p>{event.merchandiseDetails.itemDescription}</p>
              <p><strong>Price:</strong> ₹{event.merchandiseDetails.price}</p>
            </section>
          )}

          {event.customFormFields && event.customFormFields.length > 0 && (
            <section className="registration-form">
              <h2>Registration Form</h2>
              {event.customFormFields.map(field => (
                <div key={field.fieldName} className="form-group">
                  <label>
                    {field.fieldName}
                    {field.isRequired && <span className="required">*</span>}
                  </label>
                  <input
                    type={field.fieldType.toLowerCase()}
                    value={formData[field.fieldName] || ''}
                    onChange={(e) => setFormData({...formData, [field.fieldName]: e.target.value})}
                    required={field.isRequired}
                  />
                </div>
              ))}
            </section>
          )}

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button 
            onClick={handleRegister}
            disabled={isDeadlinePassed || isFull || registering}
            className="register-btn"
          >
            {registering ? 'Registering...' : 
             isDeadlinePassed ? 'Registration Closed' :
             isFull ? 'Event Full' : 'Register Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
