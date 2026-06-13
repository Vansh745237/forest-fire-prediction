import { useState } from "react";
import {
  Eye,
  EyeOff,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const [params] = useSearchParams();
  const email = params.get("email");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

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
      alert(
        "Failed to reset password"
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>RESET PASSWORD</h1>

        <div
          style={{ position: "relative" }}
        >
          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Enter New Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            style={{
              paddingRight: "45px",
            }}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform:
                "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        <button onClick={handleReset}>
          Reset Password
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;