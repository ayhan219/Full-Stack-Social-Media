import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          username,
          email,
          password,
        },
        { withCredentials: true }
      );
      toast.success("Signup successful!");
      navigate("/login");
    } catch (error) {
      toast.error("Signup failed");
      console.log(error);
    }
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex justify-center pt-32">
      <div className="w-[30%] bg-white rounded-xl shadow-lg p-8">
        <div className="text-3xl text-center font-bold mb-6 text-gray-800">
          <h2>Sign Up</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <h2 className="text-black font-bold">Username</h2>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                "& > :not(style)": { m: 1 },
              }}
            >
              <TextField
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                helperText=" "
                id="username-input"
                label="Username"
                sx={{ width: "100%" }}
              />
            </Box>
          </div>

          <div>
            <h2 className="text-black font-bold">Email</h2>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                "& > :not(style)": { m: 1 },
              }}
            >
              <TextField
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                helperText=" "
                id="email-input"
                label="Email"
                type="email"
                sx={{ width: "100%" }}
              />
            </Box>
          </div>

          <div>
            <h2 className="text-black font-bold">Password</h2>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                "& > :not(style)": { m: 1 },
              }}
            >
              <TextField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                helperText=" "
                id="password-input"
                label="Password"
                type="password"
                sx={{ width: "100%" }}
              />
            </Box>
          </div>

          <div className="pt-10">
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold text-lg hover:bg-blue-800 transition duration-200"
            >
              Sign Up
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-red-600 hover:underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
