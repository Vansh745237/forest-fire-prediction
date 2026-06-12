console.log("FORGOT PASSWORD V3");
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const API_URL =
    "https://forest-fire-prediction-5.onrender.com";
const handleReset = async () => {
  alert("handleReset running");

  try {
    const response = await axios.post(
      `${API_URL}/forgot-password`,
      { email }
    );

    alert(response.data.message);
  } catch (error) {
    alert("API Error");
    console.error(error);
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
<div style={{ color: "red", fontWeight: "bold" }}>
  FORGOT PASSWORD TEST
</div>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <button
  onClick={() => {
    alert("Button clicked");
    handleReset();
  }}
>
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