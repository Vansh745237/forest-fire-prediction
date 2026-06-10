import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API_URL =
  "https://forest-fire-prediction-5.onrender.com";// example: https://your-render-url.onrender.com

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/login`,
        {
          email,
          password
        }
      );
      console.log("LOGIN RESPONSE");
console.log(response.data);

      localStorage.setItem(
        "user_id",
        response.data.user_id
      );

      localStorage.setItem(
        "username",
        response.data.username
      );

      alert("Login Successful");

      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      alert("Invalid Email or Password");
    }
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
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
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