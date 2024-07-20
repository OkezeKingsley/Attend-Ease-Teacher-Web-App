// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeacherSignUp from './pages/TeacherSignUp';
import TeacherLogin from './pages/TeacherLogin';
import axios from 'axios';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';


// Set the base URL for Axios
axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

function App() {
    return (
         <Router>
            <Routes>
                <Route path="/" element={<TeacherLogin />} />
                <Route path="teacher-sign-up" element={<TeacherSignUp />} />
                <Route path="teacher-login" element={<TeacherLogin />} />
                <Route
                    path="dashboard"
                    element={<ProtectedRoute element={Dashboard} />}
                    />
            </Routes>
         </Router>
     
    );
  }



export default App;

