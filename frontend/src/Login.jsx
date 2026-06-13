import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API_URL =
    "https://forest-fire-prediction-5.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/login`,
        {
          email: email.trim(),
          password,
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

if (response.data.message === "User not found") {
  alert("User not found. Please sign up first.");
  return;
}

if (response.data.message === "Invalid password") {
  alert("Invalid password");
  return;
}

if (!response.data.user_id) {
  alert("Login failed");
  return;
}

      localStorage.setItem(
        "user_id",
        String(response.data.user_id)
      );

      localStorage.setItem(
        "username",
        response.data.username || ""
      );

      alert("Login Successful");
      navigate("/dashboard");

    } catch (error) {
      console.error("LOGIN ERROR:", error);

      if (error.response) {
        console.log(
          "SERVER RESPONSE:",
          error.response.data
        );
      }

      alert("Invalid Email or Password");
    }
  };

  return (
    <div className="login-page">
      <div className="overlay"></div>

      <div className="login-card">
        <div className="logo">🔥</div>

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

          <div className="forgot-password">
            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button type="submit">
            LOGIN →
          </button>
        </form>

        <div className="signup-link">
          Don't have an account?{" "}
          <Link to="/signup">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;