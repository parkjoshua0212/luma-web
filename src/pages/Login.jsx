import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WaitingMessage from '../components/WaitingMessage';

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
    <div className="page" style={{ maxWidth: 400 }}>
      <h1>Welcome back</h1>
      <p>Pick up a conversation where you left off.</p>

      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%' }}>
          {submitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>

      {demoEnabled && (
        <button
          type="button"
          className="btn-ghost"
          disabled={submitting}
          onClick={() => logIn(DEMO_EMAIL, DEMO_PASSWORD)}
          style={{ width: '100%', marginTop: '0.75rem' }}
        >
          Try the demo
        </button>
      )}

      {submitting && (
        <div style={{ marginTop: '1em' }}>
          <WaitingMessage />
        </div>
      )}

      <p style={{ marginTop: '1.5em' }}>
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}
