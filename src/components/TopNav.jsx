import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="topnav">
      <Link to="/" className="brand">Luma</Link>
      <nav>
        {user && (
          <>
            <Link to="/">Conversations</Link>
            <Link to="/grammar">Grammar check</Link>
            <span style={{ color: 'var(--paper-dim)' }}>{user.name || user.email}</span>
            <button onClick={handleLogout}>Log out</button>
          </>
        )}
      </nav>
    </div>
  );
}
