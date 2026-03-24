import '../css/MovieCard.css'
import { useMovieContext } from '../contexts/MovieContext';
import { useNavigate } from 'react-router-dom';

function MovieCard({ movie }) {

    const {isFavorite, addToFavorites, removeFromFavorites} = useMovieContext();
    const navigate = useNavigate();

    const favorite = isFavorite(movie.id);

    function onFavClick(e) {
        e.stopPropagation();
        if (favorite) {
            removeFromFavorites(movie.id);
            console.log(`Removed ${movie.title} from favorites!`);
        } else {
            addToFavorites(movie);
            console.log(`Added ${movie.title} to favorites!`);
        }
    }

    function onCardClick() {
        navigate(`/movie/${movie.id}`);
    }

  return (
    <div className="movie-card" onClick={onCardClick}>
      <div className="movie-poster">
        <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} />
      </div>
      <div className="movie-overlay">
        <button className={`favorite-btn ${favorite ? 'active' : ''}`} onClick={onFavClick}>❤️</button>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p>{movie.release_date?.split('-')[0]}</p>
      </div>
    </div>
  );
}

export default MovieCard;