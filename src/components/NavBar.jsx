import { Link } from "react-router-dom";
import '../css/NavBar.css'
import { useAuthContext } from "../contexts/AuthContext";

function NavBar() {
  const { user, logout } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (ex) {
      console.error("Logout error", ex);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="navbar-logo">Movie App</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/favorites" className="navbar-link">Favorites</Link>
        {user ? (
          <>
            <span className="navbar-user">{user.displayName || user.email}</span>
            <button className="navbar-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="navbar-link">Login</Link>
        )}
      </div>
    </nav>
  )
}

export default NavBar;  