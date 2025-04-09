import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import NametagDesigner from './NametagDesigner';
import Login from './Login';
import Signup from './Signup';
import Registration from './Registration';
import Events from './Events';
import CollapsibleSidebar from './components/Sidebar';
import './App.css';
import './Dashboard.css';

function App() {
  const location = useLocation();
  const hideSidebar = ['/login', '/signup'].includes(location.pathname);

  return (
    <div className="app-container">
      {!hideSidebar && <CollapsibleSidebar />}
      <main className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/designer" element={<NametagDesigner />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/events" element={<Events />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
