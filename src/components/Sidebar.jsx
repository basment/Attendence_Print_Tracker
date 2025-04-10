import React, { useState } from 'react';
import { FaBars, FaSignOutAlt, FaClipboardList, FaIdBadge, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../Dashboard.css';

function CollapsibleSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="top-section">
        <div className="logo">{!isCollapsed && <span><strong>Fast</strong><span className="pass-text">Pass</span></span>}</div>
        <div className="toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </div>
      </div>

      <nav className="nav-menu">
        <Link to="/events" className="nav-link"><FaClipboardList />{!isCollapsed && 'Event Setup'}</Link>
        <Link to="/designer" className="nav-link"><FaIdBadge />{!isCollapsed && 'Nametag Designer (beta)'}</Link>
        <Link to="/registration" className="nav-link"><FaUserPlus />{!isCollapsed && 'Registration Mode'}</Link>
      </nav>

      <Link to="/login" className="nav-link logout"><FaSignOutAlt /> {!isCollapsed && 'Logout'}</Link>
      
    </div>
  );
}

export default CollapsibleSidebar;
