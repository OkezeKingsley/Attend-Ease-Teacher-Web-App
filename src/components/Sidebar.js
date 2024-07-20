// Sidebar.js
import React from 'react';
import {  FaCog, FaChalkboardTeacher, FaCalendarAlt, FaUserGraduate, FaSignOutAlt } from 'react-icons/fa';
import '../styles/Sidebar.css';
import { useNavigate } from 'react-router-dom';

function Sidebar () {
  const navigate = useNavigate();

  const handleLogout = async () => {
      localStorage.removeItem("token");
      navigate('/');
  }


  return (
    <div className="sidebar-container">
      <p className="sidebar-logo">AttendEase</p>

      <div>
        <ul className="sidebar-list">
          <li>
            <FaCalendarAlt className="icon" />
            Classes
          </li>
          <li>
            <FaChalkboardTeacher className="icon" />
            Profile
          </li>
          <li>
            <FaCog className="icon" />
            Setting
          </li>
          <li onClick={handleLogout}>
            <FaSignOutAlt className="icon" />
            <p>Logout</p>
          </li>
        </ul>
      </div>
      
    </div>
  );
}

export default Sidebar;
