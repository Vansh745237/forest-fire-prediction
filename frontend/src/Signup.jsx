import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const API_URL =
    "https://forest-fire-prediction-5.onrender.com";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      console.log("API_URL =", API_URL);
      const response = await axios.post(
        `${API_URL}/signup`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );

      alert(response.data.message || "Signup Successful");
      navigate("/");

    } catch (error) {
      console.error("Signup Error:", error);

      if (error.response) {
        alert(
          error.response.data.message ||
          `Error: ${error.response.status}`
        );
      } else {
        alert("Server not responding");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="overlay"></div>

      <div className="login-card">

        <div className="logo-section">
          <div className="fire-icon">🔥</div>

          <h1 className="logo-text">
            FOREST <span>FIRE</span>
          </h1>

          <h2 className="sub-logo">
            PREDICTION
          </h2>
        </div>

        <h1 className="welcome-title">
          Create Account
        </h1>

        <p className="welcome-subtitle">
          Join the Forest Fire Intelligence Dashboard
        </p>

        <form onSubmit={handleSignup}>

          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="login-btn"
          >
            SIGN UP →
          </button>

        </form>

        <p className="signup-text">
          Already have an account?{" "}
          <Link to="/">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}