// src/components/CustomAlert.js
import React from 'react';
import '../styles/CustomAlert.css';

function CustomAlert ({ message, type, onClose }) {
  return (
    // The CustomAlert component applies the CSS classes correctly based on the type prop.
    <div className={`alert-container ${type}`}>
      <div className="alert-content">
        <span className="alert-message">{message}</span>
        <button className="alert-close-button" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
}

export default CustomAlert;
