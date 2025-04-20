// CreateEvent.jsx

import React, { useState } from 'react';
import { FaPlus, FaClock } from 'react-icons/fa';
import './CreateEvent.css';

function CreateEvent() {
  const [event, setEvent] = useState({
    name: '',
    date: '',
    location: '',
    description: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDescriptionPopup, setShowDescriptionPopup] = useState(false);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(event)
      });

      if (response.ok) {
        setShowSuccess(true);
        setEvent({
          name: '',
          date: '',
          location: '',
          description: ''
        });
      } else {
        alert("Error creating event");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create event");
    }
  };

  return (
    <div className="create-event-container">
      <h2>Create Event</h2>

      <form onSubmit={handleSubmit}>
        <div className="create-event-form-group">
          <label>Event name</label>
          <div className="input-with-button">
            <input
              type="text"
              name="name"
              placeholder="Enter event name"
              value={event.name}
              onChange={handleChange}
            />
<button type="button" className="inline-button" onClick={() => setShowDescriptionPopup(true)}><FaPlus style={{ marginRight: '9px', fontSize: '10px' }} />Add description</button>
            {showDescriptionPopup && (
              <div className="description-popup">
                <textarea
                  placeholder="Write your description here..."
                  value={event.description}
                  onChange={(e) => setEvent({ ...event, description: e.target.value })}
                />
                <button onClick={() => setShowDescriptionPopup(false)}>Close</button>
              </div>
            )}
          </div>
        </div>

        <div className="create-event-form-group">
          <label>Date</label>
          <div className="inline-group">
            <input
              type="date"
              name="date"
              value={event.date}
              onChange={handleChange}
            />

          <label className="starts-at-text">Time</label>
          <div className="time-input-container">
            <input
              type="time"
              name="time"
              value={event.time || ''}
              onChange={(e) => setEvent({ ...event, time: e.target.value })}
              className="time-input"
            />
            <FaClock
              className="clock-icon"
              onClick={() => {
                const timeInput = document.querySelector('.time-input');
                if (timeInput) {
                  timeInput.showPicker?.() || timeInput.focus();
                }
              }}
            />
          </div>

          <label className="duration-text">Duration</label>
          <input type="text" placeholder="3h 45m" className="duration-input" />

          </div>
          <small>This event will take place on the selected date and time</small>
        </div>

        <div className="create-event-form-group">
          <label>Location</label>
          <div className="inline-group">
            <input
              type="text"
              name="location"
              placeholder="Choose location"
              value={event.location}
              onChange={handleChange}
              className="location-input"
            />
          </div>
        </div>

        <button type="submit" className="inline-button" style={{ width: '100%' }}>
          Create Event
        </button>
      </form>

      {showSuccess && (
        <div className="toast-popup">
          <div className="toast-content">
            <h4>Success! 🎉</h4>
            <p>Event created successfully</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateEvent;