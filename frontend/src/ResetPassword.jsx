import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const [params] = useSearchParams();
  const email = params.get("email");

  const [password, setPassword] = useState("");

  const handleReset = async () => {
    try {
      const res = await axios.post(
        "https://forest-fire-prediction-5.onrender.com/reset-password",
        {
          email,
          new_password: password,
        }
      );

      alert(res.data.message);
    } catch (err) {
      alert("Failed to reset password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>RESET PASSWORD</h1>

        <input
          type="password"
          placeholder="Enter New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleReset}>
          Reset Password
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;