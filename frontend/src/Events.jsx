import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Events.css';

function Events() {
  const navigate = useNavigate();
  
  return (
    <div className="events-page">
      <h1>Your Events</h1>

      <div className="events-container">
      <div className="events-controls">
        <button 
          className="create-button"
          onClick={() => navigate('/create')}
        >
          +
        </button>
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
