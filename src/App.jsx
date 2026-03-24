
import { Route } from 'react-router-dom'
import './css/App.css'
import Home from './pages/Home'
import Favorites from './pages/Favorites'
import Login from './pages/Login'
import MovieDetail from './pages/MovieDetail'
import { Routes, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import ProtectedRoute from './components/ProtectedRoute'
import { MovieProvider } from './contexts/MovieContext'
import { AuthProvider } from './contexts/AuthContext'
import { useAuthContext } from './contexts/AuthContext'

function AppContent() {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div className="loading-page">Loading authentication...</div>;
  }

  return (
    <>
      {user && <NavBar/>}
      <main className='main-content'>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              user ? (
                <ProtectedRoute><Home /></ProtectedRoute>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute><Favorites /></ProtectedRoute>
            }
          />
          <Route
            path="/movie/:id"
            element={
              <ProtectedRoute><MovieDetail /></ProtectedRoute>
            }
          />
        </Routes> 
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <MovieProvider>
        <AppContent />
      </MovieProvider>
    </AuthProvider>
  )
}

export default App
