import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import "../css/Login.css";

function Login() {
  const { user, loading, loginWithGoogle, loginWithGithub } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      navigate("/", { replace: true });
    } catch (ex) {
      console.error("Google login error", ex);
      alert("Google login failed: " + ex.message);
    }
  };

  const handleGithub = async () => {
    try {
      await loginWithGithub();
      navigate("/", { replace: true });
    } catch (ex) {
      console.error("GitHub login error", ex);
      alert("GitHub login failed: " + ex.message);
    }
  };

  if (loading) {
    return <div className="login-page">Loading authentication...</div>;
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Welcome to Movie App</h2>
        <p>Please login to continue.</p>
        <button className="login-button google" onClick={handleGoogle}>
          Continue with Google
        </button>
        <button className="login-button github" onClick={handleGithub}>
          Continue with GitHub
        </button>
      </div>
    </div>
  );
}

export default Login;
