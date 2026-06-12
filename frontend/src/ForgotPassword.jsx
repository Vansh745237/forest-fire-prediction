import { Link } from "react-router-dom";

function ForgotPassword() {
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
        />

        <button>
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