import React, { useState } from 'react';
import './Dashboard.css';
import { FaBars, FaSignOutAlt, FaClipboardList, FaFileExport, FaIdBadge, FaUserFriends, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function CollapsibleSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="top-section">
        <div className="logo">{!isCollapsed && <span>FastPass</span>}</div>
        <div className="toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </div>
      </div>

      <nav className="nav-menu">
        <a href="#" className="nav-link"><FaClipboardList />{!isCollapsed && 'Event Setup'}</a>
        <Link to="/designer" className="nav-link"><FaIdBadge />{!isCollapsed && 'Nametag Designer (beta)'}</Link>
        <Link to="/registration" className="nav-link"><FaUserPlus />{!isCollapsed && 'Registration Mode'}</Link>
      </nav>

      <div className="nav-link logout"><FaSignOutAlt /> {!isCollapsed && 'Logout'}</div>
    </div>
  );
}

export default CollapsibleSidebar;