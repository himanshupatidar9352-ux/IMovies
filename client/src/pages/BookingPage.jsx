import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import SeatPicker from '../components/SeatPicker';
import { useAuth } from '../context/AuthContext';

const BookingPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user, openAuth } = useAuth();

  const [showData, setShowData] = useState(null);
  const [seatMatrix, setSeatMatrix] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchShowDetails();
  }, [showId]);

  const fetchShowDetails = async () => {
    try {
      const res = await api.get(`/shows/${showId}`);
      setShowData(res.data.data.show);
      setSeatMatrix(res.data.data.seatMatrix);
    } catch (err) {
      setError('Failed to load show details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSeat = (seat) => {
    const isAlreadySelected = selectedSeats.some(
      (s) => s.seatNumber === seat.seatNumber
    );

    if (isAlreadySelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.seatNumber !== seat.seatNumber));
    } else {
      if (selectedSeats.length >= 8) {
        alert('You can select a maximum of 8 seats per transaction.');
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const subtotal = selectedSeats.reduce((acc, s) => acc + s.price, 0);

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) return;

    if (!user) {
      navigate('/login', {
        state: {
          from: { pathname: '/checkout' },
          checkoutState: {
            show: showData,
            selectedSeats,
            subtotal,
          },
        },
      });
      return;
    }

    // Pass details to checkout
    navigate('/checkout', {
      state: {
        show: showData,
        selectedSeats,
        subtotal,
      },
    });
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="text-secondary mt-3">Loading cinema hall layout...</p>
      </div>
    );
  }

  if (error || !showData) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">{error || 'Show not found'}</div>
        <Link to="/" className="btn btn-outline-light">Back to Movies</Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Breadcrumb & Show Details Header */}
      <div className="bg-card p-4 rounded-4 border border-secondary mb-4 shadow-sm">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div className="small text-secondary mb-1">
              <Link to="/" className="text-secondary text-decoration-none">Home</Link> &gt;{' '}
              <Link to={`/movie/${showData.movie?._id}`} className="text-secondary text-decoration-none">
                {showData.movie?.title}
              </Link>{' '}
              &gt; Seat Selection
            </div>
            <h3 className="fw-bold text-light mb-1">{showData.movie?.title}</h3>
            <div className="text-secondary small">
              <i className="bi bi-geo-alt text-danger me-1"></i>
              {showData.theater?.name} &bull; Screen {showData.screenNumber} ({showData.format})
            </div>
          </div>

          <div className="d-flex align-items-center gap-3 bg-dark p-3 rounded-3 border border-secondary">
            <div className="text-center px-3 border-end border-secondary">
              <div className="small text-secondary">Date</div>
              <div className="fw-bold text-light">{showData.date}</div>
            </div>
            <div className="text-center px-3">
              <div className="small text-secondary">Showtime</div>
              <div className="fw-bold text-danger">{showData.startTime}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Seat Picker */}
      <div className="row g-4">
        <div className="col-lg-8">
          <SeatPicker
            seatMatrix={seatMatrix}
            selectedSeats={selectedSeats}
            onToggleSeat={handleToggleSeat}
          />
        </div>

        {/* Real-time Order Summary Sidecard */}
        <div className="col-lg-4">
          <div className="bg-card p-4 rounded-4 border border-secondary shadow-lg sticky-top" style={{ top: '100px' }}>
            <h5 className="fw-bold text-light mb-3 pb-2 border-bottom border-secondary">
              Booking Summary
            </h5>

            <div className="mb-3">
              <div className="small text-secondary mb-1">Selected Seats:</div>
              {selectedSeats.length === 0 ? (
                <span className="text-muted small fst-italic">No seats selected yet. Please tap on the layout to choose.</span>
              ) : (
                <div className="d-flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat.seatNumber}
                      className="badge bg-success py-2 px-3 d-flex align-items-center gap-2"
                    >
                      <span>{seat.seatNumber} ({seat.category})</span>
                      <i
                        className="bi bi-x-circle-fill cursor-pointer"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleToggleSeat(seat)}
                      ></i>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {selectedSeats.length > 0 && (
              <div className="mt-4 pt-3 border-top border-secondary">
                <div className="d-flex justify-content-between text-secondary mb-2 small">
                  <span>Tickets ({selectedSeats.length}x)</span>
                  <span className="text-light fw-semibold">₹{subtotal}</span>
                </div>
                <div className="d-flex justify-content-between text-secondary mb-3 small">
                  <span>Estimated Taxes & Fees (18%)</span>
                  <span className="text-light fw-semibold">₹{Math.round(subtotal * 0.18)}</span>
                </div>
                <div className="d-flex justify-content-between text-light fs-5 fw-bold mb-4 pt-2 border-top border-secondary">
                  <span>Total Payable:</span>
                  <span className="text-danger">₹{subtotal + Math.round(subtotal * 0.18)}</span>
                </div>
              </div>
            )}

            <button
              className="btn btn-primary-red w-100 py-3 fw-bold rounded-3 shadow"
              disabled={selectedSeats.length === 0}
              onClick={handleProceedToCheckout}
            >
              {selectedSeats.length === 0 ? (
                'Select Seats to Continue'
              ) : (
                <>
                  <i className="bi bi-credit-card me-2"></i> Proceed to Checkout
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

