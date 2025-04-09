import React from 'react';
import { FaSearch } from 'react-icons/fa';
import './Events.css';

function Events() {
  return (
    <div className="events-page">
      <h1>Your Events</h1>

      <div className="events-container">
        <div className="events-controls">
          <button className="create-button">+</button>
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search events"
            />
            <button className="search-icon"><FaSearch /></button>
          </div>
        </div>

        <div className="empty-message">Create an Event!</div>
      </div>
    </div>
  );
}

export default Events;
