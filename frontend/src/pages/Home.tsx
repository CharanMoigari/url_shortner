import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../components/styles.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="home-container">
      <nav className="navbar">
        <h1 className="logo">🔗 URL Shortener</h1>
        <div className="nav-buttons">
          <Link to="/login" className="btn btn-secondary">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary">
            Register
          </Link>
        </div>
      </nav>

      <main className="hero">
        <h2>Shorten Your URLs</h2>
        <p>Create short, memorable links to share anywhere</p>
        <Link to="/register" className="btn btn-large btn-primary">
          Get Started
        </Link>
      </main>

      <section className="features">
        <h3>Features</h3>
        <div className="features-grid">
          <div className="feature">
            <h4>⚡ Fast</h4>
            <p>Generate short URLs instantly</p>
          </div>
          <div className="feature">
            <h4>📊 Analytics</h4>
            <p>Track clicks and device statistics</p>
          </div>
          <div className="feature">
            <h4>🔒 Secure</h4>
            <p>JWT authenticated and encrypted</p>
          </div>
          <div className="feature">
            <h4>✨ Customizable</h4>
            <p>Set custom aliases and expiration dates</p>
          </div>
        </div>
      </section>
    </div>
  );
};
