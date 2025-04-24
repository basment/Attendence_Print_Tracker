import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import NametagDesigner from './NametagDesigner';
import Login from './Login';
import Signup from './Signup';
import Registration from './Registration';
import Events from './Events';
import CreateEvent from './CreateEvent';
import CollapsibleSidebar from './components/Sidebar';
import './App.css';
import './Dashboard.css';
import { EventsProvider } from './EventsContext';
import { SidebarProvider } from './SidebarContext';

function App() {
  const location = useLocation();
  const hideSidebar = ['/login', '/signup'].includes(location.pathname);

  return (
    <SidebarProvider>
      <div className="app-container">
        {!hideSidebar && <CollapsibleSidebar />}
        <main className="content">
          <EventsProvider>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/designer" element={<NametagDesigner />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/events" element={<Events />} />
              <Route path="/create" element={<CreateEvent />} />
            </Routes>
          </EventsProvider>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default App;
