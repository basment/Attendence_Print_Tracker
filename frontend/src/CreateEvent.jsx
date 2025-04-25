import React, { useState, useContext } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import './CreateEvent.css';
import { EventsContext } from './EventsContext';

function CreateEvent() {
  const navigate = useNavigate();
  const { addEvent } = useContext(EventsContext);
  const [event, setEvent] = useState({
    name: '',
    date: '',
    time: '',
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

    // Log the event name
    console.log("Event name:", event.name);

    // Add event to context
    addEvent(event);

    // Navigate to /events
    navigate('/events');
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
            <button
              type="button"
              className="inline-button"
              onClick={() => setShowDescriptionPopup(true)}
            >
              <FaPlus style={{ marginRight: '9px', fontSize: '10px' }} />
              Add description
            </button>
            {showDescriptionPopup && (
              <div className="description-popup">
                <textarea
                  placeholder="Write your description here..."
                  value={event.description}
                  onChange={(e) =>
                    setEvent({ ...event, description: e.target.value })
                  }
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
              <TimePicker
                onChange={(value) => setEvent({ ...event, time: value })}
                value={event.time}
                disableClock={true}
                clearIcon={null}
                className="custom-time-picker"
                format="hh:mm a"
              />
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

        <div className="button-group" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button
            type="button"
            className="inline-button cancel-button"
            onClick={() => navigate('/events')}
          >
            Cancel
          </button>

          <button type="submit" className="inline-button create-event-button">
            Create Event
          </button>
        </div>
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
