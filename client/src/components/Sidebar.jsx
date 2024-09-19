import React, { useContext, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaUserFriends } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { UserContext } from "../UserContext/UserContext";
import { IoHome } from "react-icons/io5";
import { TiMessages } from "react-icons/ti";

const Sidebar = () => {
  const [openSideBar, setOpenSideBar] = useState(false);
  const { profileData } = useContext(UserContext);

  return (
    <div className={`h-screen md:w-64 bg-black text-white flex flex-col sticky top-0 z-40 `}>
      {/* Hamburger menu button (only visible on small screens) */}
      <div
        onClick={() => setOpenSideBar(!openSideBar)}
        className="w-12 bg-primary h-16 flex items-center justify-center md:hidden text-3xl cursor-pointer"
      >
        <GiHamburgerMenu />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-primary text-white transition-transform duration-300 ease-in-out pt-28 z-50  ${
          openSideBar ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-64`}
      >
        <div
        onClick={() => setOpenSideBar(!openSideBar)}
        className="w-12 absolute right-0 top-24  bg-primary h-16 flex items-center justify-center md:hidden text-3xl cursor-pointer"
      >
        <GiHamburgerMenu />
      </div>
        <div className="flex flex-col items-center py-8">
          {/* Profile Section */}
          <div className="flex flex-col items-center mb-12">
            <Link
              className="flex flex-col items-center gap-2 cursor-pointer hover:text-blue-400 transition-colors duration-200"
              to="/profile"
            >
              <img
                className="w-16 h-16 rounded-full border-2 border-blue-400"
                src={
                  profileData?.profilePicture
                    ? `http://localhost:5000/${profileData.profilePicture}`
                    : "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"
                }
                alt="Profile"
              />
              <h2 className="font-extrabold text-xl hidden md:block mt-2">
                Profile
              </h2>
            </Link>
            
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col w-full items-start pl-8 gap-6">
            <Link to="/" className="flex items-center w-full py-2 cursor-pointer hover:bg-gray-700 rounded-xl transition-colors duration-200">
              <IoHome className="text-2xl" />
              <h2 className="text-lg font-semibold ml-4">Home</h2>
            </Link>

            <Link to="/messages" className="flex items-center w-full py-2 cursor-pointer hover:bg-gray-700 rounded-xl transition-colors duration-200">
              <TiMessages className="text-2xl" />
              <h2 className="text-lg font-semibold ml-4">Messages</h2>
            </Link>


            <Link to="/settings" className="flex items-center w-full py-2 cursor-pointer hover:bg-gray-700 rounded-xl transition-colors duration-200">
              <CiSettings className="text-2xl" />
              <h2 className="text-lg font-semibold ml-4">Settings</h2>
            </Link>
          </div>
        </div>

        {/* Optional section for additional content or links */}
        <div className="flex flex-col  mt-52 pl-4 py-4">
          <h2 className="text-lg font-semibold">For more</h2>
          <GiHamburgerMenu className="text-3xl mt-2 cursor-pointer" />
        </div>
      </div>

      {/* Overlay when sidebar is open on small screens */}
      {openSideBar && (
        <div
          onClick={() => setOpenSideBar(false)}
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
