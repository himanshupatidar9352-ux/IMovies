import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyBookingsPage = () => {
  const { user, openAuth } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchMyBookings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchMyBookings = async () => {
    try {
      const res = await api.get('/bookings/my-bookings');
      setBookings(res.data.data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Your seats will be released.')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      // Update local state
      setBookings(
        bookings.map((b) =>
          b._id === bookingId ? { ...b, bookingStatus: 'cancelled', paymentStatus: 'refunded' } : b
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  if (!user) {
    return (
      <div className="container py-5 text-center">
        <div className="bg-card p-5 rounded-4 border border-secondary shadow col-md-6 mx-auto">
          <i className="bi bi-person-lock display-3 text-warning mb-3 d-block"></i>
          <h4>Sign in to view your tickets</h4>
          <p className="text-secondary small mb-4">
            Manage your booked movie tickets, view QR codes, or cancel reservations anytime.
          </p>
          <Link to="/login" className="btn btn-primary-red px-4 py-2">
            <i className="bi bi-box-arrow-in-right me-2"></i> Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-light mb-1">
            <i className="bi bi-ticket-perforated-fill text-danger me-2"></i>
            My Movie Tickets
          </h3>
          <p className="text-secondary small mb-0">
            View booking status, showtimes, and digital passes.
          </p>
        </div>
        <Link to="/" className="btn btn-outline-danger btn-sm">
          <i className="bi bi-plus-circle me-1"></i> Book New Show
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-card p-5 rounded-4 border border-secondary text-center text-secondary">
          <i className="bi bi-ticket-detailed display-3 d-block mb-3"></i>
          <h5>No bookings found yet</h5>
          <p className="small">Looks like you haven't booked any cinema tickets yet.</p>
          <Link to="/" className="btn btn-primary-red btn-sm mt-2">
            Explore Now Showing Movies
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map((b) => {
            const isCancelled = b.bookingStatus === 'cancelled';

            return (
              <div key={b._id} className="col-lg-6">
                <div className="bg-card p-4 rounded-4 border border-secondary shadow-sm h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <span className="badge bg-dark border border-secondary text-warning small font-monospace">
                          {b.bookingReference}
                        </span>
                        <h5 className="fw-bold text-light mt-2 mb-1">{b.movie?.title}</h5>
                        <div className="small text-secondary">
                          <i className="bi bi-geo-alt text-danger me-1"></i>
                          {b.theater?.name} ({b.theater?.city})
                        </div>
                      </div>
                      <span className={`badge py-2 px-3 ${isCancelled ? 'bg-danger' : 'bg-success'}`}>
                        {isCancelled ? 'CANCELLED' : 'CONFIRMED'}
                      </span>
                    </div>

                    <div className="bg-dark p-3 rounded-3 border border-secondary mb-3">
                      <div className="row g-2 small">
                        <div className="col-4">
                          <div className="text-secondary">Date</div>
                          <div className="fw-semibold text-light">{b.show?.date}</div>
                        </div>
                        <div className="col-4">
                          <div className="text-secondary">Time</div>
                          <div className="fw-semibold text-danger">{b.show?.startTime}</div>
                        </div>
                        <div className="col-4">
                          <div className="text-secondary">Total Paid</div>
                          <div className="fw-semibold text-light">₹{b.totalAmount}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="small text-secondary mb-1">Seats:</div>
                      <div className="d-flex flex-wrap gap-1">
                        {b.seats.map((s) => (
                          <span key={s.seatNumber} className="badge bg-secondary">
                            {s.seatNumber} ({s.category})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-2 pt-3 border-top border-secondary">
                    <Link to={`/ticket/${b._id}`} className="btn btn-outline-light btn-sm flex-grow-1">
                      <i className="bi bi-qr-code me-1"></i> View Ticket
                    </Link>
                    {!isCancelled && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        disabled={cancellingId === b._id}
                        onClick={() => handleCancelBooking(b._id)}
                      >
                        {cancellingId === b._id ? (
                          <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                          'Cancel'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;

