import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="login-page">

      <div className="overlay"></div>

      <div className="login-card">

        <div className="logo">
          🔥
        </div>

        <h1>
          FOREST <span>FIRE</span>
        </h1>

        <h2>PREDICTION</h2>

        <p className="welcome">
          Welcome Back!
        </p>

        <p className="subtitle">
          Login to continue to your dashboard
        </p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Enter your email"
          />

          <input
            type="password"
            placeholder="Enter your password"
          />

          <button type="submit">
            LOGIN →
          </button>

        </form>

        <div className="signup-link">
          Don't have an account?
          <Link to="/signup">
            Sign Up
          </Link>
        </div>

      </div>

    </div>
  );
}

export default Login;