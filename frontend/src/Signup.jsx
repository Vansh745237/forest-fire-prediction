import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify(formData)
    );

    alert("Account Created Successfully!");
    navigate("/");
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
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
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