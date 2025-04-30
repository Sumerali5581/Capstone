import React, { useState } from "react";
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setOtpSent(true);
        setMessage("OTP sent to your email");
      } else {
        setMessage("");
        setError(data.error || "Failed to send OTP");
      }
    } catch (err) {
      setMessage("");
      setError("Network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        setMessage("");
        window.location.href = "/dashboard";
      } else {
        setMessage("");
        setError(data.error || "Invalid OTP");
      }
    } catch (err) {
      setMessage("");
      setError("Network error occurred");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-gray-900 bg-opacity-80 p-8 rounded-lg shadow-lg w-96 space-y-6">
        <h2 className="text-3xl font-bold text-center text-white underline">LOGIN</h2>

        {error && <div className="text-red-500 text-center">{error}</div>}
        {message && <div className="text-green-400 text-center">{message}</div>}

        <form className="space-y-4">
          <div className="flex items-center border border-gray-700 rounded-lg overflow-hidden bg-gradient-to-r from-gray-800 to-gray-700">
            <div className="px-4 text-gray-400">
              <FontAwesomeIcon icon={faEnvelope} />
            </div>
            <input
              type="text"
              placeholder="Email"
              className="flex-1 p-3 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {!otpSent ? (
            <button
              type="button"
              onClick={handleRequestOtp}
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-semibold tracking-wider transition 
              ${isLoading ? "bg-green-600 text-white" : "bg-gray-800 text-gray-300 hover:text-green-400 hover:border-green-400 border border-gray-700"}`}
            >
              {isLoading ? "Sending OTP..." : "Request OTP"}
            </button>
          ) : (
            <>
              <div className="flex items-center border border-gray-700 rounded-lg overflow-hidden bg-gradient-to-r from-gray-800 to-gray-700">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="flex-1 p-3 bg-transparent text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full py-3 rounded-lg font-semibold tracking-wider bg-gray-800 text-gray-300 hover:text-green-400 hover:border-green-400 border border-gray-700 transition"
              >
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
