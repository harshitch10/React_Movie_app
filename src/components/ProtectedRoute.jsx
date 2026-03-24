import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div className="loading-page">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
