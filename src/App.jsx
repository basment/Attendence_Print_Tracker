import React, { useState } from 'react';
import { FaIdBadge } from 'react-icons/fa';
import { Routes, Route, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import NametagDesigner from './NametagDesigner';
import Login from './Login';
import Signup from './Signup';
import Registration from './Registration';
import './App.css';

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className="app-container">
      <nav className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <button 
          className="toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '>' : '<'}
        </button>
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/designer" className="nav-link">
          <FaIdBadge className="nav-icon" />
          <span className="nav-text">Nametag Designer</span>
        </Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/signup" className="nav-link">Sign Up</Link>
        <Link to="/registration" className="nav-link">Registration</Link>
      </nav>
      <main className="content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/designer" element={<NametagDesigner />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/register" element={<Registration />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;