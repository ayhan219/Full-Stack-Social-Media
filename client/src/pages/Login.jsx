import React, { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext/UserContext";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Loading from "../assets/Loading";
import { toast } from "react-toastify";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [openResetPasswordArea, setOpenResetPasswordArea] = useState(false);
  const [alreadySend, setAlreadySend] = useState(false);
  const navigate = useNavigate();
  const { loginUser, user, getCurrentUser, loading, setLoading } =
    useContext(UserContext);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log("login successfully");
      loginUser(response.data);
      toast.success("Login successful!");
      getCurrentUser();
      navigate("/");
    } catch (error) {
      toast.error("Wrong username or password");
    }
  };

  const handleResetPassword = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgotpassword",
        {
          email,
        }
      );
      toast.success("Reset password link sent to your email");
    } catch (error) {
      console.log(error);
      toast.error("wrong email");
    } finally {
      setLoading(false);
      setAlreadySend(true);
    }
  };

  return (
    <div className="w-full h-screen bg-gray-100 flex justify-center pt-32">
      <div className="w-[30%] bg-white rounded-xl shadow-lg p-8">
        <div className="text-3xl text-center font-bold mb-6 text-gray-800">
          <h2>Login</h2>
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
                id="demo-helper-text-aligned-no-helper"
                label="Username"
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
                id="outlined-password-input"
                value={password}
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                autoComplete="current-password"
                sx={{ width: "100%" }}
              />
            </Box>
          </div>
          <div className="pt-10">
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg font-semibold text-lg hover:bg-blue-800 transition duration-200"
            >
              Login
            </button>
          </div>
        </form>

        <div className="text-center mt-4 flex flex-col gap-5">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <a href="/signup" className="text-red-600 hover:underline">
              Sign Up
            </a>
          </p>
          <p className="text-gray-600">
            Forget your password?{" "}
            <a
              onClick={() => setOpenResetPasswordArea(!openResetPasswordArea)}
              className="text-blue-800 hover:underline"
            >
              Change Password
            </a>
          </p>
        </div>
      </div>
      {openResetPasswordArea && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
          <div className="w-[90%] max-w-md bg-white rounded-lg shadow-lg p-8 flex flex-col items-center relative">
            <h2 className="text-2xl text-black font-bold mb-6">
              Enter Your Email
            </h2>

            <Box
              component="form"
              sx={{ "& > :not(style)": { m: 1, width: "100%" } }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                type="email"
                fullWidth
                required
              />
              <div className="mt-4">
                {loading ? (
                  <Loading />
                ) : (
                  <button
                    type="submit"
                    onClick={(e) => handleResetPassword(e)}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                  >
                    Send Reset Link
                  </button>
                )}
              </div>
            </Box>
            <div
              onClick={() => setOpenResetPasswordArea(!openResetPasswordArea)}
              className="text-black text-3xl absolute top-0 right-0 cursor-pointer"
            >
              x
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
