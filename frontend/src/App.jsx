// frontend/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import FacultyForm from './pages/FacultyForm';
import FacultyList from './pages/FacultyList';
import ForgotPassword from './pages/ForgotPassword'; // Import the new component
import ResetPassword from './pages/ResetPassword';   // Import the new component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/faculty/form" element={<FacultyForm />} />
        <Route path="/faculty/list" element={<FacultyList />} />
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Add this route */}
        <Route path="/reset-password" element={<ResetPassword />} />   {/* Add this route */}
      </Routes>
    </Router>
  );
}

export default App;