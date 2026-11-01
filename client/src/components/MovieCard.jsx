import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const isNowShowing = movie.status === 'now_showing';

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div className="movie-card">
        <div className="movie-card-img-wrapper">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="movie-card-img"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div className="movie-badge-rating">
            <i className="bi bi-star-fill text-warning me-1"></i>
            {movie.rating ? movie.rating.toFixed(1) : '8.0'}
          </div>
          <div className="movie-badge-cert">{movie.certificate || 'UA'}</div>
        </div>

        <div className="p-3 d-flex flex-column flex-grow-1 justify-content-between">
          <div>
            <h6 className="fw-bold text-light mb-1 text-truncate" title={movie.title}>
              {movie.title}
            </h6>
            <div className="d-flex align-items-center gap-2 small text-secondary mb-2">
              <span>{movie.duration} mins</span>
              <span>&bull;</span>
              <span>{Array.isArray(movie.language) ? movie.language.join(', ') : movie.language}</span>
            </div>
            <div className="d-flex flex-wrap gap-1 mb-3">
              {movie.genre &&
                movie.genre.slice(0, 2).map((g, idx) => (
                  <span
                    key={idx}
                    className="badge bg-dark border border-secondary text-secondary"
                    style={{ fontSize: '0.7rem' }}
                  >
                    {g}
                  </span>
                ))}
            </div>
          </div>

          <Link
            to={`/movie/${movie._id}`}
            className={`btn w-100 py-2 fw-semibold btn-sm ${
              isNowShowing ? 'btn-primary-red' : 'btn-outline-secondary text-light'
            }`}
          >
            {isNowShowing ? (
              <>
                <i className="bi bi-ticket-perforated me-1"></i> Book Tickets
              </>
            ) : (
              <>
                <i className="bi bi-info-circle me-1"></i> View Details
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;

