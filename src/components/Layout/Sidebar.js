import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiUsers, FiList } from 'react-icons/fi';

const Sidebar = () => {
  return (
    <div className="sidebar-content">
      <div className="text-center mb-4">
        <h4 className="text-white">Kings Admin</h4>
      </div>
      <div className="sidebar-links">
        <NavLink to="/" className={({isActive}) => 
          `sidebar-link ${isActive ? 'active' : ''}`
        }>
          <FiHome className="me-2" /> Dashboard
        </NavLink>
        
        <NavLink to="/teams" className={({isActive}) => 
          `sidebar-link ${isActive ? 'active' : ''}`
        }>
          <FiUsers className="me-2" /> Teams
        </NavLink>
        
        <NavLink to="/results" className={({isActive}) => 
          `sidebar-link ${isActive ? 'active' : ''}`
        }>
          <FiList className="me-2" /> Results
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
