import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
  const { authModalOpen, authModalTab, closeAuth, login, register, openAuth } = useAuth();
  const [isLogin, setIsLogin] = useState(authModalTab === 'login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sync tab if parent changes it
  React.useEffect(() => {
    setIsLogin(authModalTab === 'login');
    setError('');
  }, [authModalTab, authModalOpen]);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password, phone);
      }
      setEmail('');
      setPassword('');
      setName('');
      setPhone('');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(5px)', zIndex: 1050 }}
      tabIndex="-1"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-card border-secondary text-light shadow-lg">
          <div className="modal-header border-secondary pb-2">
            <h5 className="modal-title fw-bold">
              {isLogin ? 'Sign In to IMovies' : 'Create an Account'}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={closeAuth}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body p-4">
            {error && (
              <div className="alert alert-danger py-2 px-3 small rounded-3" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <div className="mb-3">
                    <label className="form-label small text-secondary">Full Name</label>
                    <input
                      type="text"
                      className="form-control bg-dark border-secondary text-light"
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small text-secondary">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      className="form-control bg-dark border-secondary text-light"
                      placeholder="e.g. +91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="mb-3">
                <label className="form-label small text-secondary">Email Address</label>
                <input
                  type="email"
                  className="form-control bg-dark border-secondary text-light"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small text-secondary">Password</label>
                <input
                  type="password"
                  className="form-control bg-dark border-secondary text-light"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary-red w-100 py-2 fw-semibold"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                ) : null}
                {isLogin ? 'Sign In' : 'Create Free Account'}
              </button>
            </form>

            <div className="mt-4 text-center small text-secondary">
              {isLogin ? (
                <>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    className="btn btn-link p-0 text-danger text-decoration-none fw-semibold"
                    onClick={() => {
                      setIsLogin(false);
                      setError('');
                    }}
                  >
                    Register here
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="btn btn-link p-0 text-danger text-decoration-none fw-semibold"
                    onClick={() => {
                      setIsLogin(true);
                      setError('');
                    }}
                  >
                    Sign in here
                  </button>
                </>
              )}
            </div>

            {/* Quick demo credentials helper */}
            <div className="mt-3 p-2 bg-dark rounded border border-secondary text-secondary small">
              <span className="fw-semibold text-warning d-block mb-1">
                <i className="bi bi-info-circle me-1"></i> Quick Demo Logins:
              </span>
              <div>Admin: <code>admin@imovies.com</code> / <code>admin123</code></div>
              <div>User: <code>user@imovies.com</code> / <code>user123</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

