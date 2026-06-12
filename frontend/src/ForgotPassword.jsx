import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const API_URL =
    "https://forest-fire-prediction-5.onrender.com";

  const handleReset = async () => {
  console.log("Button clicked");
  console.log("Email:", email);

  try {
    const response = await axios.post(
      `${API_URL}/forgot-password`,
      { email }
    );

    console.log("Success:", response.data);
    alert(response.data.message);
  } catch (error) {
    console.error("Error:", error);
    console.error("Response:", error.response);
    alert("Failed to send reset link");
  }
};

  return (
    <div className="login-page">
      <div className="overlay"></div>

      <div className="login-card">
        <h1>
          FORGOT <span>PASSWORD</span>
        </h1>

        <p className="subtitle">
          Enter your email to reset your password.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <button onClick={handleReset}>
          Send Reset Link
        </button>

        <div className="signup-link">
          <Link to="/">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;