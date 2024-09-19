import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/resetpassword/${token}`,
        { newPassword }
      );
      alert("Password has been reset successfully");
      navigate("/login");
    } catch (err) {
      setError("Failed to reset password");
      console.error(err);
    }
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-[90%] max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Reset Your Password</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ "& > :not(style)": { m: 1, width: "100%" } }}
          noValidate
          autoComplete="off"
        >
          <TextField
            id="new-password"
            label="New Password"
            type="password"
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <TextField
            id="confirm-password"
            label="Confirm Password"
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Reset Password
          </button>
        </Box>
      </div>
    </div>
  );
};

export default ResetPassword;
