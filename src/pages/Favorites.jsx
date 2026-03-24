import '../css/favorites.css'
import MovieCard from '../components/MovieCard';
import { useMovieContext } from '../contexts/MovieContext';


function Favorites() {
    const { favorites } = useMovieContext();
    if (favorites.length > 0) {
        return (
            <div className="favorites">
                <h2>Your Favorites</h2>
                <div className="movies-grid">
                    {favorites.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>
        );
    }

  return (
    <div className="favorites-empty">
      <h2>No favorites yet</h2>
        <p>Click the heart icon on a movie to add it to your favorites!</p>
    </div>
  )
}

export default Favorites;