import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Brand({ to = '/' }) {
  return (
    <Link to={to} className="brand">
      <span className="brand-mark" aria-hidden="true" />
      Luma
    </Link>
  );
}

export default function TopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navClass = ({ isActive }) => (isActive ? 'active' : undefined);

  return (
    <header className="topnav">
      <div className="topnav-inner">
        <Brand />
        {user && (
          <>
            <nav aria-label="Main">
              <NavLink to="/" end className={navClass}>Conversations</NavLink>
              <NavLink to="/grammar" className={navClass}>Grammar check</NavLink>
            </nav>
            <div className="user-menu">
              <span className="user-name">{user.name || user.email}</span>
              <button className="logout-btn" onClick={handleLogout}>Log out</button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
