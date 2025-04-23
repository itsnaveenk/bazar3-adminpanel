import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiList, FiMenu } from 'react-icons/fi';
import 'bootstrap/dist/css/bootstrap.min.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Toggle Button (Visible on mobile only) */}
      <div className="d-md-none p-2 bg-dark text-white">
        <FiMenu size={24} onClick={toggleSidebar} role="button" />
        <span className="ms-2">Kings Admin</span>
      </div>

      {/* Sidebar for desktop */}
      <div className="sidebar-content bg-dark text-white d-none d-md-block p-3">
        <div className="text-center mb-4">
          <h4>Kings Admin</h4>
        </div>
        <SidebarLinks />
      </div>

      {/* Sidebar for mobile */}
      {isOpen && (
        <div className="position-fixed top-0 start-0 w-75 bg-dark text-white p-3 h-100 d-md-none" style={{ zIndex: 1050 }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5>Kings Admin</h5>
            <button className="btn btn-sm btn-light" onClick={closeSidebar}>Close</button>
          </div>
          <SidebarLinks onClickLink={closeSidebar} />
        </div>
      )}
    </>
  );
};

const SidebarLinks = ({ onClickLink = () => {} }) => (
  <div className="sidebar-links d-flex flex-column gap-3">
    <NavLink to="/" onClick={onClickLink} className={({ isActive }) =>
      `sidebar-link text-white ${isActive ? 'fw-bold' : ''}`
    }>
      <FiHome className="me-2" /> Games Dashboard
    </NavLink>
    <NavLink to="/teams" onClick={onClickLink} className={({ isActive }) =>
      `sidebar-link text-white ${isActive ? 'fw-bold' : ''}`
    }>
      <FiUsers className="me-2" /> Games
    </NavLink>
    <NavLink to="/results" onClick={onClickLink} className={({ isActive }) =>
      `sidebar-link text-white ${isActive ? 'fw-bold' : ''}`
    }>
      <FiList className="me-2" /> Games Results
    </NavLink>
  </div>
);

export default Sidebar;
