import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieDetails } from "../services/api";
import { useMovieContext } from "../contexts/MovieContext";
import "../css/MovieDetail.css";

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerPlaying, setTrailerPlaying] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
        setError(null);
      } catch (err) {
        setError("Failed to load movie details.");
        console.error("Error fetching movie details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  const handleFavoriteClick = () => {
    if (movie) {
      if (isFavorite(movie.id)) {
        removeFromFavorites(movie.id);
      } else {
        addToFavorites(movie);
      }
    }
  };

  const providerWebsites = {
    "Netflix": "https://www.netflix.com",
    "Amazon Prime Video": "https://www.primevideo.com",
    "Disney Plus": "https://www.disneyplus.com",
    "HBO Max": "https://www.hbomax.com",
    "Hulu": "https://www.hulu.com",
    "Apple TV+": "https://tv.apple.com",
    "YouTube": "https://www.youtube.com",
    "Vudu": "https://www.vudu.com",
    "Google Play Movies": "https://play.google.com/store/movies",
    "FandangoNOW": "https://www.fandangonow.com",
  };

  const providerDeepLinks = {
    Netflix: (title) => `https://www.netflix.com/search?q=${encodeURIComponent(title)}`,
    "Amazon Prime Video": (title) =>
      `https://www.primevideo.com/search/ref=atv_nb_sr?ie=UTF8&phrase=${encodeURIComponent(title)}`,
    "Disney Plus": (title) => `https://www.disneyplus.com/search?q=${encodeURIComponent(title)}`,
    "HBO Max": (title) => `https://www.hbomax.com/search?q=${encodeURIComponent(title)}`,
    Hulu: (title) => `https://www.hulu.com/search?q=${encodeURIComponent(title)}`,
    "Apple TV+": (title) => `https://tv.apple.com/search/${encodeURIComponent(title)}`,
    Vudu: (title) => `https://www.vudu.com/content/movies/search?search=${encodeURIComponent(title)}`,
    "Google Play Movies": (title) => `https://play.google.com/store/search?q=${encodeURIComponent(title)}&c=movies`,
    YouTube: (title) => `https://www.youtube.com/results?search_query=${encodeURIComponent(title + ' movie')}`,
  };

  const getProviderUrl = (providerName) => {
    if (!providerName) {
      if (movie?.watchProviders?.link) return movie.watchProviders.link;
      return "https://www.themoviedb.org";
    }

    const title = movie?.title || "";
    if (title && providerDeepLinks[providerName]) {
      return providerDeepLinks[providerName](title);
    }

    if (movie?.watchProviders?.link) {
      return movie.watchProviders.link;
    }

    return (
      providerWebsites[providerName] ||
      `https://www.themoviedb.org/search?query=${encodeURIComponent(providerName)}`
    );
  };

  if (loading) {
    return <div className="movie-detail">Loading...</div>;
  }

  if (error || !movie) {
    return (
      <div className="movie-detail">
        <p>{error || "Movie not found"}</p>
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Go Back
        </button>
      </div>
    );
  }

  const favorite = isFavorite(movie.id);
  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  const backdropUrl = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

  return (
    <div className="movie-detail">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Go Back
      </button>

      <div className={`detail-backdrop ${trailerPlaying ? "playing" : ""}`}>
        {movie.trailerKey ? (
          <div className={`trailer-video-wrapper ${trailerPlaying ? 'playing' : ''}`}>
            {!trailerPlaying ? (
              <div
                className="trailer-preview"
                style={{
                  backgroundImage: `url(https://img.youtube.com/vi/${movie.trailerKey}/hqdefault.jpg)`,
                }}
                onClick={() => setTrailerPlaying(true)}
              >
                <div className="play-overlay">
                  <button className="play-trailer-btn">▶ Play Trailer</button>
                </div>
              </div>
            ) : (
              <iframe
                className="trailer-iframe"
                title="Movie Trailer"
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${movie.trailerKey}?autoplay=1&controls=1&rel=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        ) : (
          movie.backdrop_path && <img src={backdropUrl} alt={movie.title} className="backdrop-img" />
        )}
      </div>

      <div className="detail-container">
        <div className="detail-poster">
          <img src={posterUrl} alt={movie.title} />
          <button
            className={`favorite-btn-large ${favorite ? "active" : ""}`}
            onClick={handleFavoriteClick}
            title={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            ❤️
          </button>
        </div>

        <div className="detail-content">
          <h1 className="detail-title">{movie.title}</h1>

          <div className="detail-meta">
            <span className="release-date">
              Release: {movie.release_date || "N/A"}
            </span>
            <span className="vote-avg">
              ⭐ {movie.vote_average?.toFixed(1) || "N/A"}/10
            </span>
            <span className="language">
              Language: {movie.original_language?.toUpperCase() || "N/A"}
            </span>
          </div>

          {movie.original_title && movie.original_title !== movie.title && (
            <p className="original-title">
              Originally: <em>{movie.original_title}</em>
            </p>
          )}

          <div className="detail-section">
            <h2>Overview</h2>
            <p className="overview">{movie.overview || "No overview available."}</p>
          </div>

          <div className="detail-stats">
            <div className="stat">
              <span className="stat-label">Popularity</span>
              <span className="stat-value">{movie.popularity?.toFixed(1) || "N/A"}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Vote Count</span>
              <span className="stat-value">{movie.vote_count?.toLocaleString() || "N/A"}</span>
            </div>
            {movie.budget > 0 && (
              <div className="stat">
                <span className="stat-label">Budget</span>
                <span className="stat-value">${(movie.budget / 1000000).toFixed(1)}M</span>
              </div>
            )}
            {movie.revenue > 0 && (
              <div className="stat">
                <span className="stat-label">Revenue</span>
                <span className="stat-value">${(movie.revenue / 1000000).toFixed(1)}M</span>
              </div>
            )}
          </div>

          {/* {movie.trailerKey && (
            <div className="detail-section">
              <h2>Trailer</h2>
              <div className="trailer-container">
                <iframe
                  className="trailer-iframe"
                  title="Movie Trailer"
                  width="100%"
                  height="400"
                  src={`https://www.youtube.com/embed/${movie.trailerKey}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )} */}

          {movie.watchProviders && (
            <div className="detail-section">
              <h2>Available On</h2>
              <div className="providers">
                {(() => {
                  const providers = [
                    ...(movie.watchProviders.flatrate || []),
                    ...(movie.watchProviders.rent || []),
                    ...(movie.watchProviders.buy || []),
                  ];
                  const uniqueProviders = [];
                  const seen = new Set();

                  providers.forEach((provider) => {
                    if (!seen.has(provider.provider_id)) {
                      seen.add(provider.provider_id);
                      uniqueProviders.push(provider);
                    }
                  });

                  return uniqueProviders.map((provider) => {
                    const href = getProviderUrl(provider.provider_name);
                    return (
                      <a
                        key={provider.provider_id}
                        href={href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="provider-card"
                        title={`Open ${provider.provider_name}`}
                      >
                        {provider.logo_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                            alt={provider.provider_name}
                            className="provider-logo"
                          />
                        ) : null}
                        <span>{provider.provider_name}</span>
                      </a>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {movie.genres && movie.genres.length > 0 && (
            <div className="detail-section">
              <h2>Genres</h2>
              <div className="genres">
                {movie.genres.map((genre) => (
                  <span key={genre.id} className="genre-tag">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {movie.runtime > 0 && (
            <p className="runtime">Runtime: {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
