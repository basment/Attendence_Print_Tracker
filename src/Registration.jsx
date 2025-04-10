import React, { useState, useEffect } from 'react';
import './Registration.css';

function Registration() {
  const [form, setForm] = useState({
    fullName: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://8319-72-241-45-75.ngrok-free.app/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.fullName,
          company: form.company,
          email: form.email,
          phone: form.phone,
          event_id: 4
        })
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Attendee registered:", result);
        setShowSuccess(true);
        setForm({
          fullName: '',
          company: '',
          email: '',
          phone: ''
        });
      } else {
        alert("Error: " + (result.error || "Unknown error occurred"));
      }
    } catch (error) {
      console.error("Request failed:", error);
      alert("Could not submit the form. Please try again later.");
    }
  }

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
      {/*
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
        */}

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
            <h4>Success! 🎉</h4>
            <p>Attendee registered</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Registration;
