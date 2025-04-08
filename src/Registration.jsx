import React, { useState, useEffect } from 'react';
import './Registration.css';

function Registration() {
  const [form, setForm] = useState({
    fullName: '',
    job: '',
    company: '',
    email: '',
    phone: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    let timer;
    if (showSuccess) {
      timer = setTimeout(() => setShowSuccess(false), 3000);
    }
    return () => clearTimeout(timer);
  }, [showSuccess]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = [
      form.fullName,
      form.job,
      form.company,
      form.email,
      form.phone
    ];

    console.log('User Registered:', userData);
    setShowSuccess(true);
    setForm({
      fullName: '',
      job: '',
      company: '',
      email: '',
      phone: ''
    });
  };

  return (
    <div className="registration-container">
      <h1 className="registration-title">Registration</h1>
      <form onSubmit={handleSubmit} className="registration-form">
        <label className="registration-label">
          Full Name*:
          <input
            type="text"
            name="fullName"
            required
            value={form.fullName}
            onChange={handleChange}
            className="registration-input"
          />
        </label>

        <label className="registration-label">
          Job Position*:
          <input
            type="text"
            name="job"
            required
            value={form.job}
            onChange={handleChange}
            className="registration-input"
          />
        </label>

        <label className="registration-label">
          Company*:
          <input
            type="text"
            name="company"
            required
            value={form.company}
            onChange={handleChange}
            className="registration-input"
          />
        </label>

        <label className="registration-label">
          Email*:
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="registration-input"
          />
        </label>

        <label className="registration-label">
          Phone Number:
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="registration-input"
            pattern="[0-9]{10}"
            minLength={10}
            maxLength={10}
            title="Phone number must be exactly 10 digits"
          />
        </label>

        <button type="submit" className="registration-button">
          Submit
        </button>
      </form>
      
      {showSuccess && (
        <div className="toast-popup">
          <div className="toast-content">
            <h4>Success!</h4>
            <p>Attendee registered</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Registration;
