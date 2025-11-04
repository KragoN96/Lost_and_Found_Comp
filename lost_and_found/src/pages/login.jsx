import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/CSS/login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!data.success) {
        alert(data.message || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      alert('Login successful!');
      navigate('/home-page');
    } catch (err) {
      console.error(err);
      alert('Network error. Please try again.');
    }
  };

  return (
    <main className="login-page">
      <section className="login-container">
        <div className="login-welcome-message">
          <h3>City Universities</h3>
          <h2>Lost &amp; Found</h2>
          <h3>Login</h3>
        </div>

        <form className="credentials-input" onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            className="email-input"
            name="email"
            placeholder="your@university.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="password-input"
            name="password"
            placeholder="........."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="forgot-password-link">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          <div className="register-link">
            <Link to="/register">Don't have an account?</Link>
          </div>

          <div className="loginbt">
            <button className="login-submit-button" type="submit">Login</button>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Login;
