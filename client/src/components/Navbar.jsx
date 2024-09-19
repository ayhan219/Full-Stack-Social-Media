import React, { useContext, useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { BiSolidLogInCircle } from "react-icons/bi";
import { SiGnuprivacyguard } from "react-icons/si";
import { FaAudioDescription } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { UserContext } from "../UserContext/UserContext";
import { FaMessage } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { IoIosExit } from "react-icons/io";
import axios from "axios";
import Notification from "./Notification";
import { IoIosClose } from "react-icons/io";
import ShowSearchedUser from "./ShowSearchedUser";
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { TbPointFilled } from "react-icons/tb";
import LoadingEffect from "../assets/Loading";
import { SiZcool } from "react-icons/si";
import NotificationMessage from "./NotificationMessage";

const Navbar = () => {
  const [openNotification, setOpenNotification] = useState(false);
  const [openMessage, setOpenMessage] = useState(false);
  const [hamburger, setHamburger] = useState(false);
  const [searchUser, setSearchUser] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    user,
    logout,
    handleNotification,
    notification,
    notificationFromUser,
    setNotificationFromUser,
    setOpenChat,
    openChat
  } = useContext(UserContext);

  const handleSearchUser = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setLoading(true);

    try {
      if (query.trim() === "") {
        setSearchUser([]);
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/auth/getsearcheduser",
        { params: { username: query } }
      );
      setSearchUser(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelection = (id) => {
    setSearchQuery("");
    setSearchUser([]);
    navigate(`/profile/${id}`);
  };

  return (
    <div className="relative md:z-50">
      <div className="w-full h-24 bg-primary flex justify-around items-center text-white relative">
        <div>
          <Link to={"/"}>
            <h2 onClick={()=>setOpenChat(false)} className="text-sm hidden md:block md:text-xl font-bold">
              Social Media
            </h2>
            <SiZcool className="md:hidden text-2xl" />
          </Link>
        </div>
        <div className="relative w-52 md:w-64">
          <TextField
            onChange={(e) => handleSearchUser(e)}
            className="w-full pl-4 pr-10 py-2 rounded-lg focus:outline-none bg-white focus:border border-blue transition-colors duration-300 text-black"
            type="text"
            id="standard-basic"
            label="Search User"
            variant="standard"
          />
          {loading ? (
            <div className="text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 text-xl cursor-pointer">
              <LoadingEffect />
            </div>
          ) : (
            <FaSearch className="text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 text-xl cursor-pointer" />
          )}
        </div>
        <div className="md:hidden">
          <GiHamburgerMenu
            className="text-3xl cursor-pointer"
            onClick={() => setHamburger(!hamburger)}
          />
        </div>

        <div className={`hidden md:flex items-center gap-8`}>
          <div
            className={`relative flex gap-1 text-[2rem] ease-in-out duration-300 cursor-pointer`}
          >
            {notification.length > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 rounded-full"></span>
            )}
            {user !== null && (
              <IoIosNotifications
                className="mt-1 cursor-pointer hover:text-gray-400 ease-in-out duration-200"
                onClick={() => {
                  setOpenNotification(!openNotification);
                  handleNotification();
                }}
              />
            )}

            {openNotification && (
              <div className="absolute -right-10 top-10 mt-2 w-36 lg:w-64 text-sm lg:text-base text-[1rem] bg-white text-black rounded-lg shadow-lg p-4 z-10 flex flex-col gap-3 pt-14">
                {notification.length > 0 ? (
                  notification.map((item2) => (
                    <Notification
                      key={item2._id}
                      item2={item2}
                      notification={notification}
                      openNotification={openNotification}
                      setOpenNotification={setOpenNotification}
                    />
                  ))
                ) : (
                  <p>No notifications</p>
                )}
                <IoIosClose
                  onClick={() => setOpenNotification(!openNotification)}
                  className="absolute top-0 right-0 text-3xl text-gray-500 cursor-pointer hover:text-gray-700 transition duration-200 ease-in-out"
                />
              </div>
            )}

            {openMessage && (
              <div className="absolute left-16 top-10 mt-2 w-36 lg:w-64 text-sm lg:text-base text-[1rem] bg-white text-black rounded-lg shadow-lg p-4 z-10 flex flex-col gap-3 pt-14">
                {notificationFromUser.length > 0 ? (
                  notificationFromUser.map((item3,index) => (
                    <NotificationMessage
                    index={index}
                      item3={item3} // Pass single item instead of the whole array
                    />
                  ))
                ) : (
                  <p>No messages</p> // Handle empty state
                )}
                <IoIosClose
                  onClick={() => setOpenMessage(!openMessage)}
                  className="absolute top-0 right-0 text-3xl text-gray-500 cursor-pointer hover:text-gray-700 transition duration-200 ease-in-out"
                />
              </div>
            )}
          </div>

          <div className="flex text-[2rem]">
            {user === null ? (
              <Link className="flex relative pt-1" to={"/login"}>
                <button className="btn btn-outline btn-accent">Login</button>
              </Link>
            ) : (
              <Link
                onClick={() => setOpenMessage(!openMessage)}
                className="relative"
              >
                {notificationFromUser.length >0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 rounded-full"></span>
                )}
                <FaMessage className="mt-2 text-2xl  cursor-pointer hover:text-gray-400 ease-in-out duration-200" />
              </Link>
            )}
          </div>
          <div className="flex gap-1 text-[2rem]">
            {user === null ? (
              <Link className="flex gap-3 pt-1" to={"/signup"}>
                <button className="btn btn-outline btn-primary">Signup</button>
              </Link>
            ) : (
              ""
            )}
          </div>
          {user && (
            <div className="flex gap-1 text-[2rem] cursor-pointer">
              <Link className="ml-10" onClick={logout}>
                <Button variant="contained">Logout</Button>
              </Link>
            </div>
          )}
        </div>

        {hamburger && (
          <div className="absolute top-24 right-0 w-28 bg-primary text-white flex flex-col gap-4 p-6 md:hidden z-20 items-center">
            <div
              className={`relative flex gap-1 text-[2rem] ease-in-out duration-300 cursor-pointer`}
            >
              {notification.length > 0 && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 rounded-full"></span>
              )}
              {user !== null && (
                <IoIosNotifications
                  className="mt-1 cursor-pointer"
                  onClick={() => setOpenNotification(!openNotification)}
                />
              )}
              {openNotification && (
                <div className="absolute right-0 mt-2 w-64 text-[1rem] bg-white text-black rounded-lg shadow-lg p-4 z-10 pt-10">
                  {notification.length > 0 ? (
                    notification.map((item2) => (
                      <Notification
                        key={item2._id}
                        item2={item2}
                        notification={notification}
                        openNotification={openNotification}
                        setOpenNotification={setOpenNotification}
                      />
                    ))
                  ) : (
                    <p className="text-black">No notifications</p>
                  )}
                  <IoIosClose
                    onClick={() => setOpenNotification(!openNotification)}
                    className="absolute top-0 right-0 text-3xl text-black cursor-pointer hover:text-red-600 transition duration-200 ease-in-out"
                  />
                </div>
              )}
              {openMessage && (
              <div className="absolute right-0 top-16 mt-2 w-64 text-[1rem] bg-white text-black rounded-lg shadow-lg p-4 z-10 pt-10">
                {notificationFromUser.length > 0 ? (
                  notificationFromUser.map((item3,index) => (
                    <NotificationMessage
                    index={index}
                      item3={item3} // Pass single item instead of the whole array
                    />
                  ))
                ) : (
                  <p>No messages</p> // Handle empty state
                )}
                <IoIosClose
                  onClick={() => setOpenMessage(!openMessage)}
                  className="absolute top-0 right-0 text-3xl text-gray-500 cursor-pointer hover:text-gray-700 transition duration-200 ease-in-out"
                />
              </div>
            )}
            </div>
            <div className="flex gap-1 text-[2rem]">
              {user === null ? (
                <Link className="flex gap-3 pl-1" to={"/login"}>
                  <button className="btn btn-outline btn-accent">Login</button>
                </Link>
              ) : (
                <Link
                onClick={() => setOpenMessage(!openMessage)}
                className="relative"
              >
                {notificationFromUser.length >0 && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 rounded-full"></span>
                )}
                <FaMessage className="mt-2 text-2xl  cursor-pointer" />
              </Link>
              )}
            </div>
            <div className="flex gap-1 text-[2rem]">
              {user === null ? (
                <Link className="flex gap-3" to={"/signup"}>
                  <button className="btn btn-outline btn-primary">
                    Signup
                  </button>
                </Link>
              ) : (
                <Link className="flex gap-3" onClick={logout}>
                  <Button variant="contained">Logout</Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {searchQuery && searchUser.length > 0 && (
          <div className="md:w-64  w-44 top-[5rem] bg-white absolute  md:-left-1 md:right-40 mx-auto  z-20 ">
            {loading ? (
              <LoadingEffect />
            ) : (
              <ShowSearchedUser
                users={searchUser}
                onUserSelect={handleUserSelection}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
