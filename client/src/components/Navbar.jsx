import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, openAuth } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark imovies-navbar sticky-top py-3">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand brand-logo" to="/">
          <i className="bi bi-film text-danger"></i>
          <span>I</span>Movies
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-secondary"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-2">
            <li className="nav-item">
              <Link className="nav-link text-light fw-medium" to="/">
                <i className="bi bi-compass me-1 text-danger"></i> Discover
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-secondary fw-medium" to="/#now-showing">
                Now Showing
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-secondary fw-medium" to="/#upcoming">
                Coming Soon
              </Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link className="nav-link text-light fw-medium" to="/my-bookings">
                  <i className="bi bi-ticket-perforated me-1 text-warning"></i> My Tickets
                </Link>
              </li>
            )}
            {user && user.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link text-warning fw-medium" to="/admin">
                  <i className="bi bi-shield-lock me-1"></i> Admin Portal
                </Link>
              </li>
            )}
          </ul>

          {/* User Auth Buttons */}
          <div className="d-flex align-items-center gap-3">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle d-flex align-items-center gap-2 rounded-pill px-3 py-1"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div
                    className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: '28px', height: '28px', fontSize: '0.8rem' }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="small fw-semibold">{user.name.split(' ')[0]}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow border-secondary mt-2" aria-labelledby="userDropdown">
                  <li>
                    <div className="dropdown-header text-secondary small">
                      Signed in as <br />
                      <strong className="text-light">{user.email}</strong>
                    </div>
                  </li>
                  <li><hr className="dropdown-divider border-secondary" /></li>
                  <li>
                    <Link className="dropdown-item py-2" to="/my-bookings">
                      <i className="bi bi-ticket-perforated me-2 text-danger"></i> My Bookings
                    </Link>
                  </li>
                  {user.role === 'admin' && (
                    <li>
                      <Link className="dropdown-item py-2" to="/admin">
                        <i className="bi bi-speedometer2 me-2 text-warning"></i> Admin Panel
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider border-secondary" /></li>
                  <li>
                    <button
                      className="dropdown-item py-2 text-danger"
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link
                  to="/login"
                  className="btn btn-outline-light btn-sm rounded-pill px-3"
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary-red btn-sm rounded-pill px-3"
                >
                  <i className="bi bi-person-plus me-1"></i> Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

