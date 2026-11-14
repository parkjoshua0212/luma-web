import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WaitingMessage from '../components/WaitingMessage';
import AuthLayout from '../components/AuthLayout';

// Demo account for visitors. Set both in the environment (e.g. Vercel) to show
// the "Try the demo" button; if either is missing, the button is hidden.
const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL;
const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD;
const demoEnabled = Boolean(DEMO_EMAIL && DEMO_PASSWORD);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const logIn = async (loginEmail, loginPassword) => {
    setError('');
    setSubmitting(true);
    try {
      await login(loginEmail, loginPassword);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    logIn(email, password);
  };

  return (
    <AuthLayout>
      <h2>Log in</h2>
      <p className="lede">Pick up a conversation where you left off.</p>

      {error && <div className="error-banner" role="alert">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      {demoEnabled && (
        <div className="demo-box">
          <button
            type="button"
            className="btn-demo"
            disabled={submitting}
            onClick={() => logIn(DEMO_EMAIL, DEMO_PASSWORD)}
          >
            Try the demo
          </button>
          <p>No sign-up needed. Logs you into a shared demo account.</p>
        </div>
      )}

      {submitting && (
        <div className="auth-status">
          <WaitingMessage />
        </div>
      )}

      <p className="auth-switch">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </AuthLayout>
  );
}
