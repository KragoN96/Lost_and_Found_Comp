import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/login';
import Home from './pages/home-page';
import HomePage from './pages/home-page-main';
import About from './pages/about-page';
import ForgotPassword from './pages/forgot-password';
import Register from './pages/register';

function App() {
  useEffect(() => {
    // Track user IP when app loads
    fetch('http://localhost:5000/api/track-ip')
      .then((res) => res.json())
      .then((data) => {
        console.log('✓ User tracked:', data);
      })
      .catch((err) => console.error('Error tracking IP:', err));
  }, []);

  return (
    <Router>
      <Routes>
        {/* Redirect root to home page */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/home-page" element={<Home />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />

        {/* 404 - redirect any unknown routes */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
