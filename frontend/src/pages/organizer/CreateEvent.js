import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { eventService } from '../../services/services';
import './Organizer.css';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    eventName: '',
    eventDescription: '',
    eventType: 'Normal',
    registrationDeadline: '',
    eventStartDate: '',
    eventEndDate: '',
    eligibility: 'Both',
    registrationLimit: 100,
    registrationFee: 0,
    eventTags: []
  });

  const [customFields, setCustomFields] = useState([]);
  const [merchandiseDetails, setMerchandiseDetails] = useState({
    itemName: '',
    itemDescription: '',
    price: 0,
    availableQuantity: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const value = e.target.name === 'eventTags' 
      ? e.target.value.split(',').map(tag => tag.trim()) 
      : e.target.value;
    
    setEventData({
      ...eventData,
      [e.target.name]: value
    });
  };

  const handleMerchandiseChange = (e) => {
    setMerchandiseDetails({
      ...merchandiseDetails,
      [e.target.name]: e.target.value
    });
  };

  const addCustomField = () => {
    setCustomFields([
      ...customFields,
      { fieldName: '', fieldType: 'Text', isRequired: false }
    ]);
  };

  const updateCustomField = (index, field, value) => {
    const updated = [...customFields];
    updated[index][field] = value;
    setCustomFields(updated);
  };

  const removeCustomField = (index) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = { ...eventData };
      
      if (eventData.eventType === 'Normal' && customFields.length > 0) {
        payload.customFormFields = customFields;
      }
      
      if (eventData.eventType === 'Merchandise') {
        payload.merchandiseDetails = merchandiseDetails;
      }

      await eventService.createEvent(payload);
      setSuccess('Event created successfully!');
      setTimeout(() => navigate('/organizer/dashboard'), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div>
      <Navbar role="organizer" onLogout={handleLogout} />
      <div className="create-event-container">
        <h1>Create New Event</h1>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-group">
              <label>Event Name*</label>
              <input
                type="text"
                name="eventName"
                value={eventData.eventName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Event Description*</label>
              <textarea
                name="eventDescription"
                value={eventData.eventDescription}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Event Type*</label>
                <select name="eventType" value={eventData.eventType} onChange={handleChange}>
                  <option value="Normal">Normal</option>
                  <option value="Merchandise">Merchandise</option>
                </select>
              </div>
              <div className="form-group">
                <label>Eligibility*</label>
                <select name="eligibility" value={eventData.eligibility} onChange={handleChange}>
                  <option value="Both">Both</option>
                  <option value="IIIT">IIIT Only</option>
                  <option value="Non-IIIT">Non-IIIT Only</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Dates & Registration</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Registration Deadline*</label>
                <input
                  type="datetime-local"
                  name="registrationDeadline"
                  value={eventData.registrationDeadline}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Event Start Date*</label>
                <input
                  type="datetime-local"
                  name="eventStartDate"
                  value={eventData.eventStartDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Event End Date*</label>
                <input
                  type="datetime-local"
                  name="eventEndDate"
                  value={eventData.eventEndDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Registration Limit*</label>
                <input
                  type="number"
                  name="registrationLimit"
                  value={eventData.registrationLimit}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label>Registration Fee (₹)</label>
                <input
                  type="number"
                  name="registrationFee"
                  value={eventData.registrationFee}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Event Tags (comma-separated)</label>
              <input
                type="text"
                name="eventTags"
                placeholder="e.g., sports, cultural, technical"
                onChange={handleChange}
              />
            </div>
          </div>

          {eventData.eventType === 'Normal' && (
            <div className="form-section custom-fields-section">
              <h3>Custom Registration Form Fields</h3>
              {customFields.map((field, index) => (
                <div key={index} className="custom-field-item">
                  <input
                    type="text"
                    placeholder="Field Name"
                    value={field.fieldName}
                    onChange={(e) => updateCustomField(index, 'fieldName', e.target.value)}
                  />
                  <select
                    value={field.fieldType}
                    onChange={(e) => updateCustomField(index, 'fieldType', e.target.value)}
                  >
                    <option value="Text">Text</option>
                    <option value="Number">Number</option>
                    <option value="Email">Email</option>
                  </select>
                  <label>
                    <input
                      type="checkbox"
                      checked={field.isRequired}
                      onChange={(e) => updateCustomField(index, 'isRequired', e.target.checked)}
                    />
                    Required
                  </label>
                  <button type="button" onClick={() => removeCustomField(index)}>
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" className="add-field-btn" onClick={addCustomField}>
                + Add Custom Field
              </button>
            </div>
          )}

          {eventData.eventType === 'Merchandise' && (
            <div className="form-section">
              <h3>Merchandise Details</h3>
              <div className="form-group">
                <label>Item Name*</label>
                <input
                  type="text"
                  name="itemName"
                  value={merchandiseDetails.itemName}
                  onChange={handleMerchandiseChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Item Description*</label>
                <textarea
                  name="itemDescription"
                  value={merchandiseDetails.itemDescription}
                  onChange={handleMerchandiseChange}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)*</label>
                  <input
                    type="number"
                    name="price"
                    value={merchandiseDetails.price}
                    onChange={handleMerchandiseChange}
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Available Quantity*</label>
                  <input
                    type="number"
                    name="availableQuantity"
                    value={merchandiseDetails.availableQuantity}
                    onChange={handleMerchandiseChange}
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
