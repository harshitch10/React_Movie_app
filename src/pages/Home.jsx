import MovieCard from "../components/MovieCard";
import { useEffect, useState } from 'react';
import '../css/Home.css'
import { getPopularMovies, searchMovies} from "../services/api";


function Home() {

    const [searchQuery, setSearchQuery]= useState("");

    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isSearching, setIsSearching] = useState(false);

    // Fetch movies from the API when the component mounts
    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
            const data = await getPopularMovies(1);
            setMovies(data.results);
            setTotalPages(data.totalPages);
            setCurrentPage(1);
            setIsSearching(false);
            } catch (error) {
                setError('Failed to load popular movies. Please try again later.');
                console.error('Error fetching popular movies:', error);
            } finally {
            setLoading(false);
            }
        };
        loadPopularMovies();
      }, []);


    const handleSearch = async (event) => {
        event.preventDefault();
        if(!searchQuery.trim) return
        if (loading) return

        setLoading(true);

        try{
            const data = await searchMovies(searchQuery, 1);
            setMovies(data.results);
            setTotalPages(data.totalPages);
            setCurrentPage(1);
            setIsSearching(true);
            setError(null);
        }
        catch(error){
            setError('Failed to search movies. Please try again later.');
            console.error('Error searching movies:', error);
        }
        finally{
            setLoading(false);
        }
    }

    const handleReset = async () => {
        setSearchQuery("");
        setLoading(true);

        try {
            const data = await getPopularMovies(1);
            setMovies(data.results);
            setTotalPages(data.totalPages);
            setCurrentPage(1);
            setIsSearching(false);
            setError(null);
        } catch (error) {
            setError('Failed to load popular movies. Please try again later.');
            console.error('Error fetching popular movies:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleNextPage = async () => {
        if (currentPage >= totalPages) return;

        setLoading(true);
        const nextPage = currentPage + 1;

        try {
            let data;
            if (isSearching) {
                data = await searchMovies(searchQuery, nextPage);
            } else {
                data = await getPopularMovies(nextPage);
            }
            setMovies(data.results);
            setCurrentPage(nextPage);
            setError(null);
            window.scrollTo(0, 0);
        } catch (error) {
            setError('Failed to load next page. Please try again later.');
            console.error('Error fetching next page:', error);
        } finally {
            setLoading(false);
        }
    }

    const handlePrevPage = async () => {
        if (currentPage <= 1) return;

        setLoading(true);
        const prevPage = currentPage - 1;

        try {
            let data;
            if (isSearching) {
                data = await searchMovies(searchQuery, prevPage);
            } else {
                data = await getPopularMovies(prevPage);
            }
            setMovies(data.results);
            setCurrentPage(prevPage);
            setError(null);
            window.scrollTo(0, 0);
        } catch (error) {
            setError('Failed to load previous page. Please try again later.');
            console.error('Error fetching previous page:', error);
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="home">

    <form className="search-form" onSubmit={handleSearch}>
        <input type="text" placeholder="Search for movies..." className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <button type="submit" className="search-button">Search</button>
        {searchQuery && <button type="button" className="reset-button" onClick={handleReset}>Reset</button>}
    </form>
    
    {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="movies-grid">
            {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn" 
                onClick={handlePrevPage}
                disabled={currentPage === 1 || loading}
              >
                ← Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                className="pagination-btn" 
                onClick={handleNextPage}
                disabled={currentPage >= totalPages || loading}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
     
    </div>
  );
}

export default Home;