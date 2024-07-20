import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/TeacherSignUp.css';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../modals/CustomAlert';

function TeacherSignUp () {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/teacher/sign-up', {
        firstName,
        lastName,
        email,
        password,
      });

      if (response.status === 201) {
        console.log("Teacher registered", response.data);
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data.error;

        if (status === 400 || status === 401 || status === 500) {
          setAlert({ show: true, message: message, type: 'error'});
        } else { setAlert({ show: true, message: 'An unexpected error occured!', type: 'error'}); }

      } else { setAlert({ show: true, message: 'An unknown error occured!', type: 'error'}); }
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (alert.show === true) {
      setTimeout(() => {
        setAlert({ show: false, message: '', type: ''});
      }, 5000);
    }
  }, [alert]);
  
  return (
    <div className="signup-container">
      {alert.show && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ show: false, message: '', type: '' })}
        />
      )}
      <div className="welcome-section">
        <h2>Quick Register!</h2>
        <p>Note: This sign-up page is for teachers. Students should use the mobile app.</p>
      </div>
      <div className="form-section">
        <h2>Teacher Sign Up</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="signup-button">
            {loading ? (
              <div className="spinner"></div>
            ) : (
              'Sign Up'
            )}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default TeacherSignUp;
