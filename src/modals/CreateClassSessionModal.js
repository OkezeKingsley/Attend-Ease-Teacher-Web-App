// EventPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import '../styles/CreateClassSessionModal.css'; // Adjust the import path as needed
import { useNavigate } from 'react-router-dom';
import CustomAlert from './CustomAlert';

function CreateClassSessionModal({ isOpen, onRequestClose, onSuccess }) {
  const navigate = useNavigate();
  const [school, setSchool] = useState('');
  const [className, setClassName] = useState('');
  const [level, setLevel] = useState(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const handleGenerateQRCode = async (e) => {
    e.preventDefault();
    setLoading(true);

    const teacherId = localStorage.getItem('teacherId');
    const token = localStorage.getItem("token");

    if (!teacherId) {
      return setAlert({ show: true, message: "Please logout and login again!", type: 'error' });
    }
    if (!token) {
      navigate("/");
      return setAlert({ show: true, message: "Session expired!", type: 'error' });
    }

    try {
      const response = await axios.post('/teacher/create-class-session', {
        school, className, level, date, startTime, endTime, teacherId: JSON.parse(teacherId),
      }, {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        }
      });

      if (response.status === 201) {
        onRequestClose();
        onSuccess(response.data.id);
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data.error;

        if (status === 400 || status === 500) {
          setAlert({ show: true, message: message, type: 'error' });
        } else if (status === 401) {
          navigate("/");
          setAlert({ show: true, message: message, type: 'error' });
        } else {
          setAlert({ show: true, message: "An Unexpected error occurred!", type: 'error' });
        }
      } else {
        setAlert({ show: true, message: "An Unknown error occurred!", type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (alert.show === true) {
      setTimeout(() => {
        setAlert({ show: false, message: '', type: '' });
      }, 5000);
    }
  }, [alert]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-content"
      overlayClassName="overlay"
      contentLabel="Create Event"
    >
      <form className="form" onSubmit={handleGenerateQRCode}>
        {alert.show && (
          <CustomAlert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert({ show: false, message: '', type: '' })}
          />
        )}
        <h1 className="header">Create Class</h1>
        <label className="label">School</label>
        <input
          className="input"
          type="text"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          required
        />

        <div className="class-level-container">
          <div className="class-name-container">
            <label className="label">Class Name</label>
            <input
              className="input"
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
            />
          </div>
          <div className="level-container">
            <label className="label">Level</label>
            <input
              className="input"
              type="number"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
            />
          </div>
        </div>

        <label className="label">Date</label>
        <input
          className="input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <label className="label">Start Time</label>
        <input
          className="input"
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />

        
        <label className="label">End Time</label>
        <input
          className="input"
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />

        <button className="create-button" type="submit" disabled={loading}>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            'Generate QR Code'
          )}
        </button>
      </form>
    </Modal>
  );
}

export default CreateClassSessionModal;
