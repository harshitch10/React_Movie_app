const API_KEY = '121b392fcb6d52c81ddf5ee443221379';
const BASE_URL = 'https://api.themoviedb.org/3';

export const getPopularMovies = async (page = 1) => {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
        const data = await response.json();
        return {
            results: data.results,
            totalPages: data.total_pages,
            currentPage: data.page,
            totalResults: data.total_results
        };
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        return { results: [], totalPages: 0, currentPage: 1, totalResults: 0 };
    }
};

export const searchMovies = async (query, page = 1) => {
    try {
        const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`); 
        const data = await response.json();
        return {
            results: data.results,
            totalPages: data.total_pages,
            currentPage: data.page,
            totalResults: data.total_results
        };
    } catch (error) {
        console.error('Error searching movies:', error);
        return { results: [], totalPages: 0, currentPage: 1, totalResults: 0 };
    }
};

export const getMovieDetails = async (movieId) => {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
        const data = await response.json();

        const [videosResponse, providersResponse] = await Promise.all([
            fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`),
            fetch(`${BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`),
        ]);

        const videosData = await videosResponse.json();
        const providersData = await providersResponse.json();

        const youtubeTrailer = (videosData.results || [])
            .find((v) => v.type === 'Trailer' && v.site === 'YouTube');

        const defaultLocale = 'IN';
        const watchProviders = (providersData.results && providersData.results[defaultLocale])
            ? providersData.results[defaultLocale]
            : null;

        return {
            ...data,
            trailerKey: youtubeTrailer ? youtubeTrailer.key : null,
            watchProviders,
        };
    } catch (error) {
        console.error('Error fetching movie details:', error);
        throw error;
    }
};