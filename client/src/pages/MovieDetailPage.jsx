import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Date selection
  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 4; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      dates.push({ iso, dayName, dayNum });
    }
    return dates;
  };

  const dateList = getDates();
  const [selectedDate, setSelectedDate] = useState(dateList[0].iso);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  useEffect(() => {
    if (movie) {
      fetchShows();
    }
  }, [movie, selectedDate]);

  const fetchMovie = async () => {
    try {
      const res = await api.get(`/movies/${id}`);
      setMovie(res.data.data);
    } catch (err) {
      console.error('Error fetching movie:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchShows = async () => {
    try {
      const res = await api.get(`/shows?movieId=${id}&date=${selectedDate}`);
      setShows(res.data.data);
    } catch (err) {
      console.error('Error fetching shows:', err);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-danger" role="status"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container py-5 text-center">
        <h4>Movie not found</h4>
        <Link to="/" className="btn btn-outline-danger mt-3">Back to Catalog</Link>
      </div>
    );
  }

  // Group shows by theater
  const showsByTheater = shows.reduce((acc, show) => {
    const theaterId = show.theater._id;
    if (!acc[theaterId]) {
      acc[theaterId] = {
        theater: show.theater,
        shows: [],
      };
    }
    acc[theaterId].shows.push(show);
    return acc;
  }, {});

  return (
    <div>
      {/* Backdrop Section */}
      <div
        className="position-relative py-5"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15, 16, 20, 0.8), rgba(15, 16, 20, 0.98)), url(${movie.bannerUrl || movie.posterUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="container">
          <div className="row g-4 align-items-center">
            {/* Poster */}
            <div className="col-lg-3 col-md-4 col-sm-6 text-center text-md-start">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="img-fluid rounded-4 shadow-lg border border-secondary"
                style={{ maxHeight: '420px', objectFit: 'cover' }}
              />
            </div>

            {/* Info */}
            <div className="col-lg-9 col-md-8 text-light">
              <div className="d-flex flex-wrap gap-2 mb-2">
                <span className="badge bg-danger px-3 py-1">{movie.certificate || 'UA'}</span>
                <span className="badge bg-dark border border-secondary px-3 py-1">
                  <i className="bi bi-star-fill text-warning me-1"></i>
                  {movie.rating ? movie.rating.toFixed(1) : '8.0'} / 10
                </span>
                <span className="badge bg-dark border border-secondary px-3 py-1">
                  {movie.duration} Minutes
                </span>
                <span className="badge bg-dark border border-secondary px-3 py-1">
                  {Array.isArray(movie.language) ? movie.language.join(', ') : movie.language}
                </span>
              </div>

              <h1 className="display-5 fw-extrabold mb-3">{movie.title}</h1>

              <div className="d-flex flex-wrap gap-2 mb-3">
                {movie.genre &&
                  movie.genre.map((g, idx) => (
                    <span key={idx} className="badge bg-secondary px-3 py-1">
                      {g}
                    </span>
                  ))}
              </div>

              <p className="lead text-light opacity-80 mb-4" style={{ fontSize: '1.05rem', lineHeight: '1.7' }}>
                {movie.description}
              </p>

              {movie.director && (
                <div className="mb-3 small">
                  <strong className="text-secondary">Director: </strong>
                  <span className="text-light">{movie.director}</span>
                </div>
              )}

              {movie.cast && movie.cast.length > 0 && (
                <div className="mb-4">
                  <strong className="text-secondary small d-block mb-2">Starring Cast:</strong>
                  <div className="d-flex flex-wrap gap-2">
                    {movie.cast.map((c, idx) => (
                      <span key={idx} className="badge bg-dark border border-secondary text-light py-2 px-3">
                        {c.name} {c.role && <span className="text-secondary">as {c.role}</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {movie.trailerUrl && (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-light px-4 py-2 rounded-pill"
                >
                  <i className="bi bi-play-circle-fill me-2 text-danger"></i> Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Showtimes & Booking Section */}
      <div className="container py-5">
        <h4 className="fw-bold text-light mb-4">
          <i className="bi bi-calendar-check me-2 text-danger"></i> Select Date & Showtime
        </h4>

        {/* Date Selector Tabs */}
        <div className="d-flex gap-2 mb-4 overflow-x-auto pb-2">
          {dateList.map((d) => (
            <button
              key={d.iso}
              className={`btn px-4 py-3 rounded-4 text-center border ${
                selectedDate === d.iso
                  ? 'btn-danger text-light border-danger shadow'
                  : 'btn-dark text-secondary border-secondary'
              }`}
              style={{ minWidth: '120px' }}
              onClick={() => setSelectedDate(d.iso)}
            >
              <div className="small fw-semibold text-uppercase">{d.dayName}</div>
              <div className="fs-5 fw-bold">{d.dayNum}</div>
            </button>
          ))}
        </div>

        {/* Theaters & Showtimes List */}
        {Object.keys(showsByTheater).length === 0 ? (
          <div className="bg-card p-5 rounded-4 border border-secondary text-center text-secondary">
            <i className="bi bi-calendar-x display-4 d-block mb-3"></i>
            <h5>No shows available for the selected date</h5>
            <p className="small">Please pick another date or check back later.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {Object.values(showsByTheater).map(({ theater, shows }) => (
              <div
                key={theater._id}
                className="bg-card p-4 rounded-4 border border-secondary shadow-sm"
              >
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 pb-3 border-bottom border-secondary">
                  <div>
                    <h5 className="fw-bold text-light mb-1">
                      <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                      {theater.name}
                    </h5>
                    <p className="text-secondary small mb-0">{theater.address}</p>
                  </div>
                  <span className="badge bg-dark border border-secondary text-success mt-2 mt-md-0 py-2 px-3">
                    <i className="bi bi-phone me-1"></i> M-Ticket Available
                  </span>
                </div>

                {/* Showtimes Row */}
                <div className="d-flex flex-wrap gap-3">
                  {shows.map((show) => (
                    <Link
                      key={show._id}
                      to={`/booking/${show._id}`}
                      className="showtime-pill text-center"
                    >
                      <div className="fw-bold text-light fs-6">{show.startTime}</div>
                      <div className="small text-secondary" style={{ fontSize: '0.75rem' }}>
                        {show.format} &bull; ₹{show.pricing?.silver || 180}+
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetailPage;

