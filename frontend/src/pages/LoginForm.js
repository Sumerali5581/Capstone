import React, { useState } from "react";
import "../style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import backgroundImage from "./colorful-wallpaper-background-multicolored-generative-ai.jpg";


const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOtp = async () => {
    try {
      setIsLoading(true);
      setMessage("Sending OTP...");
      setError("");

      const response = await fetch("http://localhost:5000/api/request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setMessage("OTP sent to your email");
      } else {
        setError(data.error || "Failed to send OTP");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard";
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch (err) {
      setError("Network error occurred");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
    <div className="login-form">
      <div className="text">LOGIN</div>
      {error && <div className="error">{error}</div>}
      {message && <div className="message">{message}</div>}
      <form>
        <div className="field">
          <FontAwesomeIcon icon={faEnvelope} className="fas" />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {!otpSent ? (
          <button
            type="button"
            onClick={handleRequestOtp}
            disabled={isLoading}
            style={{
                color: isLoading ? "white" : "inherit", // Set text color to white when loading
              }}
          >
            {isLoading ? "Sending OTP..." : "Request OTP"}
          </button>
        ) : (
          <>
            <div className="field">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button type="button" onClick={handleVerifyOtp}>
              Verify OTP
            </button>
          </>
        )}
      </form>
    </div>
    </div>
  );
};

export default LoginForm;
