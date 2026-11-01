import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // If already logged in, redirect to home or intended page
  const from = location.state?.from?.pathname || '/';

  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true, state: location.state?.checkoutState });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Invalid email or password. Please verify your credentials and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (role) => {
    if (role === 'admin') {
      setEmail('admin@imovies.com');
      setPassword('admin123');
    } else {
      setEmail('user@imovies.com');
      setPassword('user123');
    }
    setError('');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-stretch g-0 rounded-4 overflow-hidden shadow-lg border border-secondary" style={{ backgroundColor: '#13141b' }}>
        
        {/* Left Side: Cinema Showcase Banner */}
        <div className="col-lg-5 d-none d-lg-flex flex-column justify-content-between p-5 position-relative" style={{
          backgroundImage: 'linear-gradient(rgba(15, 16, 20, 0.75), rgba(15, 16, 20, 0.95)), url("https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div>
            <div className="d-flex align-items-center gap-2 mb-4">
              <i className="bi bi-film text-danger fs-2"></i>
              <span className="fw-extrabold fs-3 text-light"><span>I</span>Movies</span>
            </div>
            <span className="badge bg-danger text-uppercase px-3 py-2 fw-semibold mb-3">Premium Cinema</span>
            <h2 className="fw-bold text-light mb-3">Your Gateway to the Big Screen Experience.</h2>
            <p className="text-secondary small leading-relaxed">
              Reserve best-in-class seats in real time, explore exclusive IMAX 3D showings, and manage your digital M-Tickets effortlessly.
            </p>
          </div>

          <div className="d-flex flex-column gap-3 pt-4 border-top border-secondary">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-dark p-2 text-danger border border-secondary">
                <i className="bi bi-display fs-5"></i>
              </div>
              <div className="small">
                <div className="text-light fw-semibold">Interactive Seat Selection</div>
                <div className="text-secondary">Pick exact seats with real-time availability tracking</div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-dark p-2 text-success border border-secondary">
                <i className="bi bi-qr-code fs-5"></i>
              </div>
              <div className="small">
                <div className="text-light fw-semibold">Instant Digital M-Ticket</div>
                <div className="text-secondary">Scan and enter straight into the cinema hall</div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-dark p-2 text-warning border border-secondary">
                <i className="bi bi-arrow-counterclockwise fs-5"></i>
              </div>
              <div className="small">
                <div className="text-light fw-semibold">Hassle-Free Cancellations</div>
                <div className="text-secondary">One-click ticket cancellation with instant seat release</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Systematic Sign In Form */}
        <div className="col-lg-7 p-4 p-md-5 d-flex flex-column justify-content-center">
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <h3 className="fw-bold text-light mb-0">Sign In to IMovies</h3>
              <span className="badge bg-dark border border-secondary text-secondary small">Secure 256-bit JWT</span>
            </div>
            <p className="text-secondary small">
              Enter your registered email and password to access your bookings.
            </p>
          </div>

          {/* Quick Demo Login Preset Buttons */}
          <div className="p-3 mb-4 rounded-3 border border-secondary" style={{ backgroundColor: '#1a1c25' }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small fw-semibold text-warning">
                <i className="bi bi-lightning-charge-fill me-1"></i> Quick Demo Accounts:
              </span>
              <span className="small text-secondary" style={{ fontSize: '0.75rem' }}>Click to autofill credentials</span>
            </div>
            <div className="row g-2">
              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm w-100 text-start text-light py-2 px-3 border-secondary"
                  onClick={() => handleQuickFill('user')}
                >
                  <div className="fw-semibold text-truncate"><i className="bi bi-person me-1 text-danger"></i> Regular User</div>
                  <div className="small text-secondary font-monospace" style={{ fontSize: '0.7rem' }}>user@imovies.com</div>
                </button>
              </div>
              <div className="col-6">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm w-100 text-start text-light py-2 px-3 border-secondary"
                  onClick={() => handleQuickFill('admin')}
                >
                  <div className="fw-semibold text-truncate"><i className="bi bi-shield-lock me-1 text-warning"></i> Administrator</div>
                  <div className="small text-secondary font-monospace" style={{ fontSize: '0.7rem' }}>admin@imovies.com</div>
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger py-2 px-3 small rounded-3 mb-4 d-flex align-items-center" role="alert">
              <i className="bi bi-exclamation-triangle-fill fs-5 me-2 flex-shrink-0"></i>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-3">
              <label className="form-label small text-secondary fw-semibold">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-secondary">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control bg-dark border-secondary text-light py-2"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="form-label small text-secondary fw-semibold mb-0">Password</label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Please use the quick demo account credentials or create a new account.'); }} className="text-secondary small text-decoration-none">
                  Forgot password?
                </a>
              </div>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-secondary">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control bg-dark border-secondary text-light py-2"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-dark border-secondary text-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="mb-4 d-flex align-items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="form-check-input bg-dark border-secondary me-2"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe" className="form-check-label small text-secondary">
                Remember this device for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary-red w-100 py-3 fw-bold rounded-3 shadow fs-6"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Authenticating...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i> Sign In to Account
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-4 pt-3 border-top border-secondary text-center small text-secondary">
            Don't have an IMovies account yet?{' '}
            <Link to="/register" className="text-danger fw-semibold text-decoration-none ms-1">
              Create Free Account &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
