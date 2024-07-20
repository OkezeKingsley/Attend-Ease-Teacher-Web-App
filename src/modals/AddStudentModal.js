import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import '../styles/AddStudentModal.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../modals/CustomAlert';

Modal.setAppElement('#root');

function AddStudentModal ({ isOpen, onRequestClose, classSessionId, successfullyAddedStudent }) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [matricNumber, setMatricNumber] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleAddStudent = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);
    console.log('Adding student:', { firstName, lastName, matricNumber });

    const teacherId = localStorage.getItem("teacherId");
    const token = localStorage.getItem("token");

    if (!token) {
      return alert("Could not get session");
    }
    if (!teacherId) {
      return alert("Please logout and login again");
    }

    try {
      const response = await axios.post("/teacher/add-student",
        { teacherId: JSON.parse(teacherId), classSessionId, firstName, lastName, matricNumber },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
          }
        }
      );

      if (response.status === 200) {
        console.log("Student added to attendees list");
        successfullyAddedStudent();
        setFirstName('');
        setLastName('');
        setMatricNumber('');
        onRequestClose();
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data.error;

        if (status === 400) {
          setAlert({ show: true, message: message, type: 'error'});
        } else if (status === 404) {
          setAlert({ show: true, message: message, type: 'error'});
        } else if (status === 401) {
          navigate("/");
        } else if (status === 409) {
          setAlert({ show: true, message: message, type: 'error'});
        } else if (status === 500) {
          setAlert({ show: true, message: message, type: 'error'});
        } else {
          setAlert({ show: true, message: message, type: 'error'});
        }
      } else { setAlert({ show: true, message: 'Unknown error occured!', type: 'error'}); }
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (alert.show === true) {
      setTimeout(() => {
        setAlert({ show: false, message: '', type: ''});
      }, 5000);
    }
  }, [alert]); 

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="add-student-modal"
      overlayClassName="add-student-modal-overlay"
    >
      <h2>Add Student</h2>
      {alert.show && (
        <CustomAlert 
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ show: false, message: '', type: '' })}
        />
      )}
      <form className="add-student-form" onSubmit={handleAddStudent}>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Matric Number</label>
          <input
            type="text"
            value={matricNumber}
            onChange={(e) => setMatricNumber(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="add-student-submit-button" disabled={loading}>
          {loading ? (
            <div className="spinner"></div>
          ) : (
            'Add Student'
          )}
        </button>
      </form>
    </Modal>
  );

}

export default AddStudentModal;
