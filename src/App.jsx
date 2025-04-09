import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import NametagDesigner from './NametagDesigner';
import Login from './Login';
import Signup from './Signup';
import Registration from './Registration';
import './App.css';

function App() {
  return (
      <main className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/designer" element={<NametagDesigner />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/register" element={<Registration />} />
        </Routes>
      </main>
  );
}

export default App;
