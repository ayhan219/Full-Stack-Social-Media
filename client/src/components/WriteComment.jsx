import React, { useContext, useState } from "react";
import { UserContext } from "../UserContext/UserContext";
import { sendComment } from "./util";
import Loading from "../assets/Loading";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

const WriteComment = ({ postId, onCommentAdded }) => {
  const { user, setComment, comment, profileData } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleSend = async () => {
    console.log(profileData);
    
    setLoading(true);
    try {
      await sendComment(postId, comment, user.userId);
      setComment("");
      onCommentAdded();
    } catch (error) {
      setError("Failed to send comment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-20 bg-primary rounded-xl flex items-center justify-between ">
      <div className="w-20 md:w-28 flex items-center justify-center ">
        <img
          className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 object-cover rounded-full"
          src={profileData?.profilePicture ? `http://localhost:5000/${profileData.profilePicture}` : "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"}
          alt="User"
        />
      </div>
      <div className="w-full flex items-center justify-center md:justify-start">
        <input
        onChange={(e)=>setComment(e.target.value)}
          className="w-[80%] h-8 md:h-12 px-4 rounded-full text-sm md:text-lg bg-gray-100 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white shadow-md transition-all duration-300 ease-in-out"
          type="text"
          placeholder="Write your comment..."
        />
      </div>
      <div>
        {loading ? (
          <Loading />
        ) : (
          <button
            onClick={handleSend}
            className="bg-blue-500 text-xs w-10 sm:w-16 h-8 md:h-10 sm:text-xl sm:h-8 hover:bg-blue-600 text-white font-bold py-2  rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 "
          >
            Send
          </button>
        )}
      </div>
    </div>
  );
};

export default WriteComment;
