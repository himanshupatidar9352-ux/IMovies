import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (!agreedTerms) {
      setError('Please agree to the Terms and Conditions to proceed.');
      return;
    }

    setSubmitting(true);

    try {
      await register(name, email, password, phone);
      navigate('/', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to register account. An account with this email may already exist.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center align-items-stretch g-0 rounded-4 overflow-hidden shadow-lg border border-secondary" style={{ backgroundColor: '#13141b' }}>
        
        {/* Left Side: Cinema Showcase Banner */}
        <div className="col-lg-5 d-none d-lg-flex flex-column justify-content-between p-5 position-relative" style={{
          backgroundImage: 'linear-gradient(rgba(15, 16, 20, 0.75), rgba(15, 16, 20, 0.95)), url("https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div>
            <div className="d-flex align-items-center gap-2 mb-4">
              <i className="bi bi-film text-danger fs-2"></i>
              <span className="fw-extrabold fs-3 text-light"><span>I</span>Movies</span>
            </div>
            <span className="badge bg-danger text-uppercase px-3 py-2 fw-semibold mb-3">Join The Community</span>
            <h2 className="fw-bold text-light mb-3">Cinema Reservations, Simplified.</h2>
            <p className="text-secondary small leading-relaxed">
              Create an account today to access priority booking, fast-track checkout, paperless digital passes, and instant seat updates.
            </p>
          </div>

          <div className="d-flex flex-column gap-3 pt-4 border-top border-secondary">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-dark p-2 text-danger border border-secondary">
                <i className="bi bi-clock-history fs-5"></i>
              </div>
              <div className="small">
                <div className="text-light fw-semibold">Fast 30-Second Checkout</div>
                <div className="text-secondary">Save your details for lightning-fast seat confirmations</div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-dark p-2 text-success border border-secondary">
                <i className="bi bi-bell-fill fs-5"></i>
              </div>
              <div className="small">
                <div className="text-light fw-semibold">Showtime Notifications</div>
                <div className="text-secondary">Be first in line when blockbuster bookings open</div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-dark p-2 text-warning border border-secondary">
                <i className="bi bi-shield-check fs-5"></i>
              </div>
              <div className="small">
                <div className="text-light fw-semibold">Protected Data & Encryption</div>
                <div className="text-secondary">Your credentials and transactions are 100% secured</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Systematic Registration Form */}
        <div className="col-lg-7 p-4 p-md-5 d-flex flex-column justify-content-center">
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <h3 className="fw-bold text-light mb-0">Create an Account</h3>
              <span className="badge bg-dark border border-secondary text-secondary small">Free Membership</span>
            </div>
            <p className="text-secondary small">
              Fill in your details below to set up your IMovies cinema profile.
            </p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 px-3 small rounded-3 mb-4 d-flex align-items-center" role="alert">
              <i className="bi bi-exclamation-triangle-fill fs-5 me-2 flex-shrink-0"></i>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label small text-secondary fw-semibold">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-secondary">
                  <i className="bi bi-person"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-dark border-secondary text-light py-2"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Email and Phone Grid */}
            <div className="row g-3 mb-3">
              <div className="col-md-7">
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
                  />
                </div>
              </div>

              <div className="col-md-5">
                <label className="form-label small text-secondary fw-semibold">Mobile (Optional)</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-telephone"></i>
                  </span>
                  <input
                    type="tel"
                    className="form-control bg-dark border-secondary text-light py-2"
                    placeholder="+91 98765..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Password and Confirm Password Grid */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label small text-secondary fw-semibold">Create Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control bg-dark border-secondary text-light py-2"
                    placeholder="At least 6 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label small text-secondary fw-semibold">Confirm Password</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-check-circle"></i>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control bg-dark border-secondary text-light py-2"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
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
            </div>

            {/* Terms Agreement */}
            <div className="mb-4 d-flex align-items-center">
              <input
                type="checkbox"
                id="agreedTerms"
                className="form-check-input bg-dark border-secondary me-2"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
              />
              <label htmlFor="agreedTerms" className="form-check-label small text-secondary">
                I agree to the <a href="#terms" onClick={(e) => e.preventDefault()} className="text-light text-decoration-none">Terms of Service</a> & <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-light text-decoration-none">Privacy Policy</a>
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
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus-fill me-2"></i> Register New Account
                </>
              )}
            </button>
          </form>

          {/* Switch to Sign In */}
          <div className="mt-4 pt-3 border-top border-secondary text-center small text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="text-danger fw-semibold text-decoration-none ms-1">
              Sign In Here &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;

