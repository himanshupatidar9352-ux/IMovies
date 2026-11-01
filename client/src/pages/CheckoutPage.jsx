import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { show, selectedSeats, subtotal } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardHolder, setCardHolder] = useState(user?.name || 'HIMANSHU SHARMA');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('421');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!show || !selectedSeats || selectedSeats.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h4>No booking in progress</h4>
        <p className="text-secondary">Please pick a movie and select seats first.</p>
        <Link to="/" className="btn btn-primary-red">Browse Movies</Link>
      </div>
    );
  }

  const taxAndFees = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + taxAndFees;

  const handlePayNow = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/bookings', {
        showId: show._id,
        seats: selectedSeats,
        paymentDetails: {
          method: paymentMethod.toUpperCase(),
        },
      });

      // Navigate to digital ticket page with populated booking
      navigate(`/ticket/${res.data.data._id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Payment processing failed or selected seats are no longer available. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row g-4 justify-content-center">
        {/* Payment Form */}
        <div className="col-lg-7">
          <div className="bg-card p-4 rounded-4 border border-secondary shadow-lg">
            <h4 className="fw-bold text-light mb-4">
              <i className="bi bi-shield-lock-fill text-success me-2"></i>
              Payment & Checkout
            </h4>

            {error && (
              <div className="alert alert-danger py-3 px-4 rounded-3 mb-4">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="mb-4">
              <label className="form-label small text-secondary fw-semibold">
                Select Payment Method
              </label>
              <div className="row g-2">
                <div className="col-4">
                  <button
                    type="button"
                    className={`btn w-100 py-3 rounded-3 border text-center ${
                      paymentMethod === 'card'
                        ? 'btn-danger text-light border-danger'
                        : 'btn-dark text-secondary border-secondary'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <i className="bi bi-credit-card-2-front fs-4 d-block mb-1"></i>
                    <span className="small fw-semibold">Card</span>
                  </button>
                </div>
                <div className="col-4">
                  <button
                    type="button"
                    className={`btn w-100 py-3 rounded-3 border text-center ${
                      paymentMethod === 'upi'
                        ? 'btn-danger text-light border-danger'
                        : 'btn-dark text-secondary border-secondary'
                    }`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <i className="bi bi-qr-code-scan fs-4 d-block mb-1"></i>
                    <span className="small fw-semibold">UPI / QR</span>
                  </button>
                </div>
                <div className="col-4">
                  <button
                    type="button"
                    className={`btn w-100 py-3 rounded-3 border text-center ${
                      paymentMethod === 'netbanking'
                        ? 'btn-danger text-light border-danger'
                        : 'btn-dark text-secondary border-secondary'
                    }`}
                    onClick={() => setPaymentMethod('netbanking')}
                  >
                    <i className="bi bi-bank fs-4 d-block mb-1"></i>
                    <span className="small fw-semibold">NetBanking</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Payment Details Form */}
            <form onSubmit={handlePayNow}>
              {paymentMethod === 'card' && (
                <div className="bg-dark p-3 rounded-3 border border-secondary mb-4">
                  <div className="mb-3">
                    <label className="form-label small text-secondary">Card Number</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary text-secondary">
                        <i className="bi bi-credit-card"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control bg-dark border-secondary text-light font-monospace"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small text-secondary">Cardholder Name</label>
                    <input
                      type="text"
                      className="form-control bg-dark border-secondary text-light text-uppercase"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      required
                    />
                  </div>

                  <div className="row g-3">
                    <div className="col-6">
                      <label className="form-label small text-secondary">Valid Thru</label>
                      <input
                        type="text"
                        className="form-control bg-dark border-secondary text-light"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small text-secondary">CVV</label>
                      <input
                        type="password"
                        maxLength="4"
                        className="form-control bg-dark border-secondary text-light"
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="bg-dark p-4 rounded-3 border border-secondary mb-4 text-center">
                  <i className="bi bi-qr-code fs-1 text-danger mb-2 d-block"></i>
                  <p className="text-secondary small mb-2">Scan & Pay via any UPI App (GPay, PhonePe, Paytm)</p>
                  <div className="badge bg-secondary p-2 font-monospace">imovies.merchant@icici</div>
                </div>
              )}

              {paymentMethod === 'netbanking' && (
                <div className="bg-dark p-3 rounded-3 border border-secondary mb-4">
                  <label className="form-label small text-secondary">Choose Popular Bank</label>
                  <select className="form-select bg-dark border-secondary text-light">
                    <option>HDFC Bank</option>
                    <option>State Bank of India</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary-red w-100 py-3 fw-bold rounded-3 shadow fs-5"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Securing Seats & Confirming Ticket...
                  </>
                ) : (
                  <>
                    <i className="bi bi-lock-fill me-2"></i> Pay ₹{totalAmount} & Confirm
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Order Breakdown Sidecard */}
        <div className="col-lg-5">
          <div className="bg-card p-4 rounded-4 border border-secondary shadow-lg">
            <h5 className="fw-bold text-light mb-3 pb-2 border-bottom border-secondary">
              Order Breakdown
            </h5>

            <div className="d-flex gap-3 mb-3 pb-3 border-bottom border-secondary">
              <img
                src={show.movie?.posterUrl}
                alt={show.movie?.title}
                className="rounded-3 border border-secondary"
                style={{ width: '70px', height: '100px', objectFit: 'cover' }}
              />
              <div>
                <h6 className="fw-bold text-light mb-1">{show.movie?.title}</h6>
                <div className="small text-secondary mb-1">
                  {show.theater?.name} &bull; {show.format}
                </div>
                <div className="small text-danger fw-semibold">
                  {show.date} &bull; {show.startTime}
                </div>
              </div>
            </div>

            <div className="mb-3">
              <div className="small text-secondary mb-2">Reserved Seats:</div>
              <div className="d-flex flex-wrap gap-1">
                {selectedSeats.map((seat) => (
                  <span key={seat.seatNumber} className="badge bg-dark border border-secondary text-light px-2 py-1">
                    {seat.seatNumber} ({seat.category}) - ₹{seat.price}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-top border-secondary">
              <div className="d-flex justify-content-between text-secondary mb-2 small">
                <span>Seat Subtotal</span>
                <span className="text-light fw-semibold">₹{subtotal}</span>
              </div>
              <div className="d-flex justify-content-between text-secondary mb-2 small">
                <span>Integrated GST & Convenience Fee (18%)</span>
                <span className="text-light fw-semibold">₹{taxAndFees}</span>
              </div>
              <div className="d-flex justify-content-between text-light fs-5 fw-bold mt-3 pt-3 border-top border-secondary">
                <span>Grand Total:</span>
                <span className="text-danger">₹{totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

