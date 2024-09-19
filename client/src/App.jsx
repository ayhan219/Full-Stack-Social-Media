import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Footer from "./components/Footer";
import Profile from "./pages/Profile";
import UserPage from "./pages/UserPage";
import Sidebar from "./components/Sidebar";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";

function App() {
  return (
    <>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<UserPage />} />
            <Route path="/resetpassword/:token" element={<ResetPassword />} />
            <Route path="/messages" element={<Chat />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          <Footer />
        </Router>
      <ToastContainer />
    </>
  );
}

export default App;
