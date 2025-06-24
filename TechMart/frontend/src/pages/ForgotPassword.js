import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common/index";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // Track step: 1 = Send OTP, 2 = Reset Password
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleIdentifierChange = (e) => setIdentifier(e.target.value);
  const handleOtpChange = (e) => setOtp(e.target.value);
  const handlePasswordChange = (e) => setNewPassword(e.target.value);

  const handleSendOtp = async (e) => {
    e.preventDefault();

    const dataResponse = await fetch(SummaryApi.forgotPassword.url, {
      method: SummaryApi.forgotPassword.method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, action: "sendOtp" }),
    });

    const dataApi = await dataResponse.json();
    if (dataApi.success) {
      toast.success(dataApi.message);
      setStep(2); // Move to OTP verification and password reset step
    } else {
      toast.error(dataApi.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const dataResponse = await fetch(SummaryApi.forgotPassword.url, {
        method: SummaryApi.forgotPassword.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otp, newPassword, action: "verifyOtpAndResetPassword" }), // Update this line
    });

    const dataApi = await dataResponse.json();
    if (dataApi.success) {
        toast.success(dataApi.message);
        navigate("/"); // Redirect to main page on success
    } else {
        toast.error(dataApi.message);
    }
};


  return (
    <section id="forgot-password" className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 w-full max-w-md mx-auto rounded-md shadow-lg">
        <h2 className="text-2xl font-serif text-center mb-4">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="flex flex-col">
              <label className="text-lg">Email or Phone Number:</label>
              <input
                type="text"
                name="identifier"
                value={identifier}
                onChange={handleIdentifierChange}
                placeholder="Enter your Email or Phone Number"
                required
                className="p-2 border border-slate-200 rounded-md"
              />
            </div>
            <button type="submit" className="w-full py-2 text-white bg-yellow-300 rounded-full hover:bg-yellow-400">
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="flex flex-col">
              <label className="text-lg">OTP:</label>
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter the OTP sent to you"
                required
                className="p-2 border border-slate-200 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-lg">New Password:</label>
              <input
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter a new password"
                required
                className="p-2 border border-slate-200 rounded-md"
              />
            </div>
            <button type="submit" className="w-full py-2 text-white bg-yellow-300 rounded-full hover:bg-yellow-400">
              Reset Password
            </button>
          </form>
        )}
        <p className="mt-4 text-center">
          {step === 1 ? (
            <>
              Remembered your password?{" "}
              <Link to="/login" className="text-yellow-300 hover:underline">
                Login
              </Link>
            </>
          ) : (
            <button onClick={() => setStep(1)} className="text-yellow-300 hover:underline">
              Go Back
            </button>
          )}
        </p>
      </div>
    </section>
  );
};

export default ForgotPassword;
