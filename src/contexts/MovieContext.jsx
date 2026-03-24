import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";

export const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
    const { user } = useAuthContext();
    const [favorites, setFavorites] = useState([]);

    const favoritesStorageKey = user ? `favorites_${user.uid}` : "favorites_guest";

    useEffect(() => {
        const storedFavorites = localStorage.getItem(favoritesStorageKey);
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        } else {
            setFavorites([]);
        }
    }, [favoritesStorageKey]);

    useEffect(() => {
        localStorage.setItem(favoritesStorageKey, JSON.stringify(favorites));
    }, [favorites, favoritesStorageKey]);

    const addToFavorites = (movie) => {
        setFavorites((prev) => {
            const already = prev.some((item) => item.id === movie.id);
            if (already) return prev;
            return [...prev, movie];
        });
    };

    const removeFromFavorites = (movieId) => {
        setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
    };

    const isFavorite = (movieId) => {
        return favorites.some((movie) => movie.id === movieId);
    };

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
    };

    return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
};

export default MovieContext