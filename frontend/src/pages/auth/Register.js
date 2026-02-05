import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    participantType: 'IIIT',
    collegeName: '',
    contactNumber: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement registration logic
    console.log('Registration submitted', formData);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Felicity Event Management</h1>
          <h2>Create Your Account</h2>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Participant Type</label>
            <select
              name="participantType"
              value={formData.participantType}
              onChange={handleChange}
            >
              <option value="IIIT">IIIT Student</option>
              <option value="Non-IIIT">Non-IIIT Participant</option>
            </select>
          </div>
          <div className="form-group">
            <label>College/Organization Name</label>
            <input
              type="text"
              name="collegeName"
              placeholder="Your college or organization"
              value={formData.collegeName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input
              type="tel"
              name="contactNumber"
              placeholder="+91 XXXXXXXXXX"
              value={formData.contactNumber}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="auth-button">Create Account</button>
        </form>
        <div className="auth-footer">
          <p>
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
