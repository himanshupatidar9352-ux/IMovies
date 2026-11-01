import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import MovieCard from '../components/MovieCard';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Adventure', 'Drama', 'Comedy', 'Fantasy'];

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('now_showing');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMovies();
  }, [activeTab, selectedGenre]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      let url = `/movies?status=${activeTab}`;
      if (selectedGenre !== 'All') {
        url += `&genre=${selectedGenre}`;
      }
      const res = await api.get(url);
      setMovies(res.data.data);
    } catch (err) {
      console.error('Failed to fetch movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredMovie = movies[0];

  return (
    <div className="container py-4">
      {/* Hero Banner with Featured Movie */}
      {featuredMovie && (
        <div className="hero-banner shadow-lg">
          <img
            src={featuredMovie.bannerUrl || featuredMovie.posterUrl}
            alt={featuredMovie.title}
          />
          <div className="hero-content">
            <span className="badge bg-danger mb-2 px-3 py-2 text-uppercase fw-bold">
              Trending Blockbuster
            </span>
            <h1 className="display-4 fw-extrabold text-light mb-2">
              {featuredMovie.title}
            </h1>
            <p className="text-light opacity-75 d-none d-md-block col-lg-7 mb-3">
              {featuredMovie.description.substring(0, 150)}...
            </p>
            <div className="d-flex align-items-center gap-3">
              <Link
                to={`/movie/${featuredMovie._id}`}
                className="btn btn-primary-red px-4 py-2 fw-semibold"
              >
                <i className="bi bi-play-circle-fill me-2"></i> Book Tickets Now
              </Link>
              {featuredMovie.trailerUrl && (
                <a
                  href={featuredMovie.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-light px-4 py-2 fw-semibold"
                >
                  <i className="bi bi-youtube me-2 text-danger"></i> Watch Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-card p-4 rounded-4 border border-secondary mb-4 shadow-sm">
        <div className="row g-3 align-items-center justify-content-between">
          {/* Tab Switcher */}
          <div className="col-lg-4 col-md-5">
            <div className="btn-group w-100 p-1 bg-dark rounded-pill border border-secondary">
              <button
                className={`btn btn-sm rounded-pill fw-semibold ${
                  activeTab === 'now_showing' ? 'btn-danger' : 'btn-dark text-secondary'
                }`}
                onClick={() => setActiveTab('now_showing')}
              >
                <i className="bi bi-film me-1"></i> Now Showing
              </button>
              <button
                className={`btn btn-sm rounded-pill fw-semibold ${
                  activeTab === 'upcoming' ? 'btn-danger' : 'btn-dark text-secondary'
                }`}
                onClick={() => setActiveTab('upcoming')}
              >
                <i className="bi bi-clock-history me-1"></i> Coming Soon
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="col-lg-5 col-md-7">
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-dark border-secondary text-light"
                placeholder="Search movies by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="btn btn-dark border-secondary text-secondary"
                  onClick={() => setSearchQuery('')}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Genre Filter Chips */}
        <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top border-secondary">
          <span className="small text-secondary align-self-center me-2">Genre:</span>
          {GENRES.map((genre) => (
            <button
              key={genre}
              className={`btn btn-sm rounded-pill px-3 ${
                selectedGenre === genre
                  ? 'btn-danger'
                  : 'btn-outline-secondary text-light'
              }`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Movies Grid Section */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <h4 className="fw-bold text-light mb-0">
          {activeTab === 'now_showing' ? 'Now In Theaters' : 'Upcoming Attractions'}
          <span className="badge bg-secondary ms-2 small" style={{ fontSize: '0.8rem' }}>
            {filteredMovies.length}
          </span>
        </h4>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="text-secondary mt-3">Loading cinema catalog...</p>
        </div>
      ) : filteredMovies.length === 0 ? (
        <div className="text-center py-5 bg-card rounded-4 border border-secondary">
          <i className="bi bi-film display-3 text-secondary mb-3 d-block"></i>
          <h5>No movies found matching your criteria</h5>
          <p className="text-secondary small">
            Try adjusting your genre filters or search query.
          </p>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              setSelectedGenre('All');
              setSearchQuery('');
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="row">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;

