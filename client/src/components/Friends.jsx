import React, { useContext, useEffect, useState } from "react";
import { FaGift } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import Friend from "./Friend";
import { UserContext } from "../UserContext/UserContext";
import OpenChat from "./OpenChat";

const Friends = () => {
  const {
    userFollowers,
    setOpenChat,
    openChat,
    setMessagerId,
    setNotificationFromUser,
    setUserFollowers,
    getFollowers,

  } = useContext(UserContext);
  const[allFollowers,setAllFollowers] = useState(userFollowers)
  const [openText, setOpenText] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedValue, setSearchedValue] = useState([]);

  const showUserId = (id) => {
    setMessagerId(id);
    setNotificationFromUser([]);
    setOpenChat(true);
  };

  const getSearchedUser = async (e) => {
    
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchedValue([]);
      setUserFollowers(allFollowers)
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/getsearcheduser",
        {
          params: { username: query },
        }
      );
      setUserFollowers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  

  return (
    <div className="hidden lg:block w-[25%] h-[60%] mt-10 border-primary rounded-2xl z-5">
      <div className="text-white text-xl flex justify-around items-center p-5 gap-16">
        <h3 className="font-extrabold">Followers</h3>
        <FaSearch onClick={() => setOpenText(!openText)} />
      </div>
      {openText && (
        <div className="w-full h-10 flex items-center justify-center">
          <input
            onChange={(e) => getSearchedUser(e)}
            className="w-[60%] p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-300 ease-in-out text-gray-700 placeholder-gray-400"
            type="text"
            placeholder="Search User"
          />
        </div>
      )}
      <div className="w-full h-auto pt-3">
        {userFollowers.map((item) => (
          <Friend showUserId={showUserId} item={item} />
        ))}
      </div>
      <div>
        <div className="pt-10 pl-20">
          <h2 className="text-xl font-extrabold text-white">Group Chats</h2>
        </div>
        <div className="w-full h-full pt-3"></div>
      </div>
    </div>
  );
};

export default Friends;
