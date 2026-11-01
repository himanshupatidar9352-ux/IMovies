import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto border-top border-secondary py-5" style={{ backgroundColor: '#0b0c0f' }}>
      <div className="container">
        <div className="row g-4 justify-content-between">
          <div className="col-lg-4 col-md-6">
            <Link className="brand-logo mb-3" to="/">
              <i className="bi bi-film text-danger"></i>
              <span>I</span>Movies
            </Link>
            <p className="text-secondary small mt-2">
              The next-generation online cinema ticketing platform. Experience seamless movie discovery, real-time seat availability tracking, and lightning-fast reservations.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-secondary hover-light fs-5"><i className="bi bi-twitter-x"></i></a>
              <a href="#" className="text-secondary hover-light fs-5"><i className="bi bi-instagram"></i></a>
              <a href="#" className="text-secondary hover-light fs-5"><i className="bi bi-facebook"></i></a>
              <a href="#" className="text-secondary hover-light fs-5"><i className="bi bi-youtube"></i></a>
            </div>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="text-light fw-bold mb-3">Explore</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li><Link to="/#now-showing" className="text-decoration-none text-secondary">Now Showing</Link></li>
              <li><Link to="/#upcoming" className="text-decoration-none text-secondary">Coming Soon</Link></li>
              <li><a href="#" className="text-decoration-none text-secondary">Cinemas & IMAX</a></li>
              <li><a href="#" className="text-decoration-none text-secondary">Offers & Promos</a></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="text-light fw-bold mb-3">Support</h6>
            <ul className="list-unstyled text-secondary small d-flex flex-column gap-2">
              <li><a href="#" className="text-decoration-none text-secondary">Help Center</a></li>
              <li><a href="#" className="text-decoration-none text-secondary">Refund Policies</a></li>
              <li><a href="#" className="text-decoration-none text-secondary">Terms of Service</a></li>
              <li><a href="#" className="text-decoration-none text-secondary">Privacy Notice</a></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6">
            <h6 className="text-light fw-bold mb-3">Experience Premium</h6>
            <p className="text-secondary small">
              Enjoy 4DX, IMAX Laser 3D, and Dolby Atmos multi-channel sound across partnering multiplexes.
            </p>
            <div className="badge bg-secondary text-light p-2">
              <i className="bi bi-shield-check text-success me-1"></i> 100% Secure Checkout
            </div>
          </div>
        </div>

        <div className="border-top border-secondary mt-4 pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center small text-secondary">
          <div>
            &copy; {new Date().getFullYear()} IMovies Inc. Built with React.js, Express & MongoDB.
          </div>
          <div className="d-flex gap-3 mt-2 mt-md-0">
            <span>Powered by JWT Authentication</span>
            <span>&bull;</span>
            <span>Real-time Seat Reservation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

