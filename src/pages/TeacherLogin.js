// TeacherLogin.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/TeacherLogin.css';
import { useNavigate } from 'react-router-dom';
import CustomAlert from '../modals/CustomAlert';

function TeacherLogin () {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/teacher/sign-in", {
        email,
        password
      });
    
      if (response.status === 200) {
        if (response.data.id) {
          localStorage.setItem("teacherId", JSON.stringify(response.data.id));
          localStorage.setItem("token", JSON.stringify(response.data.token));
          navigate("/dashboard");
        } 
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data.error;

        if (status === 400 || status === 404 || status === 401 || status === 403 || status === 500) {
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
    <div className="login-container">
      {alert.show && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ show: false, message: '', type: '' })}
        />
      )}
      <div className="welcome-section">
        <h2>Welcome back!</h2>
        <p>Note: This login page is for teachers. Students should use the mobile app.</p>
        <button onClick={() => navigate('/teacher-sign-up')} className="sign-up-button">Sign Up</button>
      </div>
      <div className="form-section">
        <h2>Teacher Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
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
          <button type="submit" className="login-button">
            {loading ? (
              <div className="spinner"></div>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TeacherLogin;
