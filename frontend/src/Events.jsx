import React, { useContext, useState } from 'react';
import { FaSearch, FaPen, FaFileExport, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Events.css';
import { EventsContext } from './EventsContext';
import { SidebarContext } from './SidebarContext';

function Events() {
  const navigate = useNavigate();
  const { events, removeEvent } = useContext(EventsContext);
  const { isCollapsed } = useContext(SidebarContext);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hourStr, minuteStr] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minuteStr} ${ampm}`;
  };

  const confirmDelete = (eventIndex) => {
    setEventToDelete(eventIndex);
    setShowModal(true);
  };

  const handleDelete = () => {
    removeEvent(eventToDelete);
    setShowModal(false);
    setEventToDelete(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setEventToDelete(null);
  };

  return (
    <div className="events-page">
      <div className={`events-main-content ${isCollapsed ? 'collapsed' : 'expanded'}`}>
        <h1>Your Events</h1>

        <div className="events-container">
          <div className="events-controls">
            <button className="create-button" onClick={() => navigate('/create')}>+</button>
            <div className="search-bar">
              <input type="text" className="search-input" placeholder="Search events" />
              <button className="search-icon"><FaSearch /></button>
            </div>
          </div>

          {events.length === 0 ? (
            <div className="empty-message">Create an Event!</div>
          ) : (
            <ul className="events-list">
              {events.map((event, index) => (
                <li key={index} className="event-tile">
                  <div className="event-left">
                    <span className="event-number">{index + 1}.</span>
                    <span className="event-name">{event.name}</span>
                  </div>
                  <div className="event-details">
                    <p>
                      {new Date(event.date).toLocaleDateString(undefined, {
                        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                      })}, ({formatTime(event.time)})
                    </p>
                    <p>{event.location}</p>
                  </div>
                  <div className="event-actions">
                    <button className="download-icon-button" title="Download"><FaFileExport /></button>
                    <button className="edit-icon-button" title="Edit" onClick={() => navigate(`/edit/${index}`)}><FaPen /></button>
                    <button className="delete-icon-button" title="Delete" onClick={() => confirmDelete(index)}><FaTrash /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>Are you sure?</h3>
                <p>This will permanently delete the event.</p>
                <div className="modal-buttons">
                  <button onClick={handleDelete} className="confirm-btn">Yes, delete</button>
                  <button onClick={cancelDelete} className="cancel-btn">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Events;
