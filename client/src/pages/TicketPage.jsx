import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const TicketPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      const res = await api.get(`/bookings/${id}`);
      setBooking(res.data.data);
    } catch (err) {
      setError('Could not load ticket. Please check your bookings list.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="text-secondary mt-3">Generating your digital cinema ticket...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error || 'Ticket not found'}</div>
        <Link to="/my-bookings" className="btn btn-primary-red">Go to My Bookings</Link>
      </div>
    );
  }

  const isCancelled = booking.bookingStatus === 'cancelled';

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-9">
          {/* Success Banner */}
          {!isCancelled && (
            <div className="text-center mb-4">
              <div
                className="rounded-circle bg-success bg-opacity-25 text-success d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: '64px', height: '64px', fontSize: '2rem' }}
              >
                <i className="bi bi-check-lg"></i>
              </div>
              <h3 className="fw-bold text-light">Ticket Confirmed!</h3>
              <p className="text-secondary small">
                Your reservation is booked. Present this M-Ticket at the cinema entrance.
              </p>
            </div>
          )}

          {/* Digital Ticket Card */}
          <div className="digital-ticket p-4 p-md-5">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center pb-4 border-bottom border-secondary">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-film text-danger fs-3"></i>
                <span className="fw-bold fs-4 text-light">IMovies M-Ticket</span>
              </div>
              <span className={`badge py-2 px-3 ${isCancelled ? 'bg-danger' : 'bg-success'}`}>
                {isCancelled ? 'CANCELLED' : 'CONFIRMED'}
              </span>
            </div>

            {/* Movie & Theater Content */}
            <div className="row g-4 my-2 align-items-center">
              <div className="col-sm-4 text-center text-sm-start">
                <img
                  src={booking.movie?.posterUrl}
                  alt={booking.movie?.title}
                  className="rounded-3 border border-secondary shadow"
                  style={{ width: '130px', height: '180px', objectFit: 'cover' }}
                />
              </div>

              <div className="col-sm-8">
                <h4 className="fw-bold text-light mb-1">{booking.movie?.title}</h4>
                <div className="small text-secondary mb-3">
                  {booking.movie?.certificate} &bull; {booking.movie?.duration} Mins &bull; {booking.show?.format || '2D'}
                </div>

                <div className="mb-2">
                  <div className="small text-secondary">Cinema:</div>
                  <div className="fw-semibold text-light">
                    {booking.theater?.name} (Screen {booking.show?.screenNumber || 1})
                  </div>
                  <div className="small text-muted">{booking.theater?.address}</div>
                </div>

                <div className="row g-2 mt-2">
                  <div className="col-6">
                    <div className="small text-secondary">Date</div>
                    <div className="fw-bold text-light">{booking.show?.date}</div>
                  </div>
                  <div className="col-6">
                    <div className="small text-secondary">Show Time</div>
                    <div className="fw-bold text-danger">{booking.show?.startTime}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ticket-divider"></div>

            {/* Seat & Passenger Info */}
            <div className="row g-3 align-items-center">
              <div className="col-sm-7">
                <div className="small text-secondary mb-1">Seats Booked:</div>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {booking.seats.map((s) => (
                    <span key={s.seatNumber} className="badge bg-danger py-2 px-3 fs-6">
                      {s.seatNumber}
                    </span>
                  ))}
                </div>

                <div className="small text-secondary">Booking Reference:</div>
                <div className="font-monospace fw-bold fs-5 text-warning tracking-wide">
                  {booking.bookingReference}
                </div>
                <div className="small text-muted">Booked by: {booking.user?.name}</div>
              </div>

              {/* QR Code Simulation */}
              <div className="col-sm-5 text-center">
                <div className="bg-light p-3 rounded-3 d-inline-block shadow-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 100"
                    width="110"
                    height="110"
                    fill="#111"
                  >
                    <path d="M0,0 h30 v30 h-30 z M5,5 v20 h20 v-20 z M10,10 h10 v10 h-10 z" />
                    <path d="M70,0 h30 v30 h-30 z M75,5 v20 h20 v-20 z M80,10 h10 v10 h-10 z" />
                    <path d="M0,70 h30 v30 h-30 z M5,75 v20 h20 v-20 z M10,80 h10 v10 h-10 z" />
                    <rect x="35" y="10" width="8" height="8" />
                    <rect x="50" y="15" width="12" height="6" />
                    <rect x="40" y="35" width="20" height="15" />
                    <rect x="10" y="45" width="15" height="15" />
                    <rect x="70" y="45" width="25" height="12" />
                    <rect x="40" y="75" width="15" height="15" />
                    <rect x="75" y="75" width="15" height="15" />
                  </svg>
                </div>
                <div className="small text-secondary mt-1" style={{ fontSize: '0.7rem' }}>
                  Scan for Entry
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-top border-secondary d-flex justify-content-between align-items-center text-secondary small">
              <span>Paid: <strong className="text-light">₹{booking.totalAmount}</strong></span>
              <span>Transaction: <strong className="text-light font-monospace">{booking.paymentDetails?.transactionId || 'SUCCESS'}</strong></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex flex-wrap gap-3 justify-content-center mt-4">
            <button className="btn btn-outline-light px-4 py-2 rounded-pill" onClick={handlePrint}>
              <i className="bi bi-printer me-2"></i> Print / Save Ticket
            </button>
            <Link to="/my-bookings" className="btn btn-dark border-secondary px-4 py-2 rounded-pill text-light">
              <i className="bi bi-ticket-perforated me-2 text-warning"></i> View All Bookings
            </Link>
            <Link to="/" className="btn btn-primary-red px-4 py-2 rounded-pill">
              <i className="bi bi-compass me-2"></i> Book Another Movie
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;

