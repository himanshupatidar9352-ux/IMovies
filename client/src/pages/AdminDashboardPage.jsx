import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalBookings: 0, totalRevenue: 0, moviesCount: 0 });
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Movie form state
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    genre: 'Action, Sci-Fi',
    language: 'English, Hindi',
    duration: 150,
    rating: 8.5,
    certificate: 'UA',
    posterUrl: '',
    bannerUrl: '',
    trailerUrl: '',
    director: '',
    releaseDate: new Date().toISOString().split('T')[0],
    status: 'now_showing',
  });

  // Show schedule form state
  const [showForm, setShowForm] = useState({
    movieId: '',
    theaterId: '',
    screenNumber: 1,
    date: new Date().toISOString().split('T')[0],
    startTime: '06:30 PM',
    format: 'IMAX 3D',
    priceSilver: 180,
    priceGold: 260,
    priceVip: 420,
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    } else if (user && user.role === 'admin') {
      loadAdminData();
    }
  }, [user]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, moviesRes, theatersRes] = await Promise.all([
        api.get('/bookings/all'),
        api.get('/movies'),
        api.get('/theaters'),
      ]);

      setBookings(bookingsRes.data.data);
      setMovies(moviesRes.data.data);
      setTheaters(theatersRes.data.data);

      setStats({
        totalBookings: bookingsRes.data.count,
        totalRevenue: bookingsRes.data.totalRevenue,
        moviesCount: moviesRes.data.count,
      });

      if (moviesRes.data.data.length > 0) {
        setShowForm((prev) => ({ ...prev, movieId: moviesRes.data.data[0]._id }));
      }
      if (theatersRes.data.data.length > 0) {
        setShowForm((prev) => ({ ...prev, theaterId: theatersRes.data.data[0]._id }));
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    try {
      const formattedMovie = {
        ...movieForm,
        genre: movieForm.genre.split(',').map((g) => g.trim()),
        language: movieForm.language.split(',').map((l) => l.trim()),
      };
      await api.post('/movies', formattedMovie);
      setMessage('✅ Movie created and published successfully!');
      loadAdminData();
      setMovieForm({
        title: '',
        description: '',
        genre: 'Action, Sci-Fi',
        language: 'English',
        duration: 150,
        rating: 8.5,
        certificate: 'UA',
        posterUrl: '',
        bannerUrl: '',
        trailerUrl: '',
        director: '',
        releaseDate: new Date().toISOString().split('T')[0],
        status: 'now_showing',
      });
    } catch (err) {
      setMessage(`❌ Failed: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleCreateShow = async (e) => {
    e.preventDefault();
    try {
      await api.post('/shows', {
        movie: showForm.movieId,
        theater: showForm.theaterId,
        screenNumber: showForm.screenNumber,
        date: showForm.date,
        startTime: showForm.startTime,
        format: showForm.format,
        pricing: {
          silver: Number(showForm.priceSilver),
          gold: Number(showForm.priceGold),
          vip: Number(showForm.priceVip),
        },
      });
      setMessage('✅ Show scheduled successfully!');
    } catch (err) {
      setMessage(`❌ Failed: ${err.response?.data?.message || err.message}`);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="container py-5 text-center">
        <h4>Access Restricted</h4>
        <p className="text-secondary">You need an administrator account to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-light mb-1">
            <i className="bi bi-shield-lock-fill text-warning me-2"></i>
            Cinema Administration Portal
          </h3>
          <p className="text-secondary small mb-0">
            Manage movie listings, scheduling showtimes, and monitoring ticket sales.
          </p>
        </div>
      </div>

      {message && (
        <div className="alert alert-info py-2 px-3 rounded-3 mb-4 d-flex justify-content-between">
          <span>{message}</span>
          <button className="btn-close btn-close-white" onClick={() => setMessage('')}></button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="bg-card p-4 rounded-4 border border-secondary shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-secondary small text-uppercase fw-semibold">Total Revenue</div>
                <h3 className="fw-bold text-success mb-0">₹{stats.totalRevenue.toLocaleString()}</h3>
              </div>
              <div className="bg-dark p-3 rounded-circle text-success fs-3">
                <i className="bi bi-currency-rupee"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="bg-card p-4 rounded-4 border border-secondary shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-secondary small text-uppercase fw-semibold">Tickets Booked</div>
                <h3 className="fw-bold text-light mb-0">{stats.totalBookings}</h3>
              </div>
              <div className="bg-dark p-3 rounded-circle text-danger fs-3">
                <i className="bi bi-ticket-perforated"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="bg-card p-4 rounded-4 border border-secondary shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-secondary small text-uppercase fw-semibold">Active Movies</div>
                <h3 className="fw-bold text-warning mb-0">{stats.moviesCount}</h3>
              </div>
              <div className="bg-dark p-3 rounded-circle text-warning fs-3">
                <i className="bi bi-film"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button
            className={`btn rounded-pill px-4 ${
              activeTab === 'overview' ? 'btn-danger' : 'btn-dark text-secondary'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="bi bi-table me-2"></i> All Bookings
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn rounded-pill px-4 ${
              activeTab === 'add-movie' ? 'btn-danger' : 'btn-dark text-secondary'
            }`}
            onClick={() => setActiveTab('add-movie')}
          >
            <i className="bi bi-plus-lg me-2"></i> Add Movie
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn rounded-pill px-4 ${
              activeTab === 'add-show' ? 'btn-danger' : 'btn-dark text-secondary'
            }`}
            onClick={() => setActiveTab('add-show')}
          >
            <i className="bi bi-calendar-plus me-2"></i> Schedule Show
          </button>
        </li>
      </ul>

      {/* Tab: All Bookings */}
      {activeTab === 'overview' && (
        <div className="bg-card p-4 rounded-4 border border-secondary shadow-sm">
          <h5 className="fw-bold text-light mb-3">Live Booking Ledger</h5>
          <div className="table-responsive">
            <table className="table table-dark table-hover align-middle mb-0">
              <thead className="table-secondary text-secondary small">
                <tr>
                  <th>REF #</th>
                  <th>USER</th>
                  <th>MOVIE</th>
                  <th>THEATER</th>
                  <th>SEATS</th>
                  <th>TOTAL</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td className="font-monospace text-warning fw-bold">{b.bookingReference}</td>
                    <td>
                      <div className="fw-semibold text-light">{b.user?.name}</div>
                      <div className="small text-secondary">{b.user?.email}</div>
                    </td>
                    <td>{b.movie?.title}</td>
                    <td>{b.theater?.name}</td>
                    <td>
                      {b.seats.map((s) => s.seatNumber).join(', ')}
                    </td>
                    <td className="fw-bold text-light">₹{b.totalAmount}</td>
                    <td>
                      <span className={`badge ${b.bookingStatus === 'confirmed' ? 'bg-success' : 'bg-danger'}`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Add Movie Form */}
      {activeTab === 'add-movie' && (
        <div className="bg-card p-4 rounded-4 border border-secondary shadow-sm col-lg-8">
          <h5 className="fw-bold text-light mb-3">Add New Movie to Catalog</h5>
          <form onSubmit={handleCreateMovie}>
            <div className="row g-3">
              <div className="col-md-8">
                <label className="form-label small text-secondary">Movie Title</label>
                <input
                  type="text"
                  className="form-control bg-dark border-secondary text-light"
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label small text-secondary">Status</label>
                <select
                  className="form-select bg-dark border-secondary text-light"
                  value={movieForm.status}
                  onChange={(e) => setMovieForm({ ...movieForm, status: e.target.value })}
                >
                  <option value="now_showing">Now Showing</option>
                  <option value="upcoming">Coming Soon</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label small text-secondary">Description</label>
                <textarea
                  rows="3"
                  className="form-control bg-dark border-secondary text-light"
                  value={movieForm.description}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  required
                ></textarea>
              </div>

              <div className="col-md-6">
                <label className="form-label small text-secondary">Genres (comma separated)</label>
                <input
                  type="text"
                  className="form-control bg-dark border-secondary text-light"
                  value={movieForm.genre}
                  onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small text-secondary">Languages (comma separated)</label>
                <input
                  type="text"
                  className="form-control bg-dark border-secondary text-light"
                  value={movieForm.language}
                  onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label small text-secondary">Duration (Minutes)</label>
                <input
                  type="number"
                  className="form-control bg-dark border-secondary text-light"
                  value={movieForm.duration}
                  onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label small text-secondary">Rating (0 - 10)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control bg-dark border-secondary text-light"
                  value={movieForm.rating}
                  onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label small text-secondary">Certificate</label>
                <input
                  type="text"
                  className="form-control bg-dark border-secondary text-light"
                  value={movieForm.certificate}
                  onChange={(e) => setMovieForm({ ...movieForm, certificate: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small text-secondary">Poster Image URL</label>
                <input
                  type="url"
                  className="form-control bg-dark border-secondary text-light"
                  placeholder="https://..."
                  value={movieForm.posterUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small text-secondary">Banner Image URL</label>
                <input
                  type="url"
                  className="form-control bg-dark border-secondary text-light"
                  placeholder="https://..."
                  value={movieForm.bannerUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, bannerUrl: e.target.value })}
                />
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary-red px-4 py-2 mt-2">
                  <i className="bi bi-check2-circle me-2"></i> Save Movie
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Schedule Show Form */}
      {activeTab === 'add-show' && (
        <div className="bg-card p-4 rounded-4 border border-secondary shadow-sm col-lg-8">
          <h5 className="fw-bold text-light mb-3">Schedule Cinema Showtime</h5>
          <form onSubmit={handleCreateShow}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label small text-secondary">Select Movie</label>
                <select
                  className="form-select bg-dark border-secondary text-light"
                  value={showForm.movieId}
                  onChange={(e) => setShowForm({ ...showForm, movieId: e.target.value })}
                  required
                >
                  {movies.map((m) => (
                    <option key={m._id} value={m._id}>{m.title}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label small text-secondary">Select Theater</label>
                <select
                  className="form-select bg-dark border-secondary text-light"
                  value={showForm.theaterId}
                  onChange={(e) => setShowForm({ ...showForm, theaterId: e.target.value })}
                  required
                >
                  {theaters.map((t) => (
                    <option key={t._id} value={t._id}>{t.name} ({t.city})</option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label small text-secondary">Date</label>
                <input
                  type="date"
                  className="form-control bg-dark border-secondary text-light"
                  value={showForm.date}
                  onChange={(e) => setShowForm({ ...showForm, date: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label small text-secondary">Start Time</label>
                <input
                  type="text"
                  className="form-control bg-dark border-secondary text-light"
                  placeholder="e.g. 07:15 PM"
                  value={showForm.startTime}
                  onChange={(e) => setShowForm({ ...showForm, startTime: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label small text-secondary">Format</label>
                <select
                  className="form-select bg-dark border-secondary text-light"
                  value={showForm.format}
                  onChange={(e) => setShowForm({ ...showForm, format: e.target.value })}
                >
                  <option value="2D">2D</option>
                  <option value="3D">3D</option>
                  <option value="IMAX 3D">IMAX 3D</option>
                  <option value="4DX">4DX</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label small text-secondary">Silver Price (₹)</label>
                <input
                  type="number"
                  className="form-control bg-dark border-secondary text-light"
                  value={showForm.priceSilver}
                  onChange={(e) => setShowForm({ ...showForm, priceSilver: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label small text-secondary">Gold Price (₹)</label>
                <input
                  type="number"
                  className="form-control bg-dark border-secondary text-light"
                  value={showForm.priceGold}
                  onChange={(e) => setShowForm({ ...showForm, priceGold: e.target.value })}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label small text-secondary">VIP Recliner Price (₹)</label>
                <input
                  type="number"
                  className="form-control bg-dark border-secondary text-light"
                  value={showForm.priceVip}
                  onChange={(e) => setShowForm({ ...showForm, priceVip: e.target.value })}
                  required
                />
              </div>

              <div className="col-12">
                <button type="submit" className="btn btn-primary-red px-4 py-2 mt-2">
                  <i className="bi bi-clock me-2"></i> Publish Show Schedule
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;

