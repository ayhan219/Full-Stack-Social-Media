import React, { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext/UserContext";
import { MdEmojiEmotions } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import Loading from "../assets/Loading";

const SharePost = () => {
  const { user, profileImage, getPost, profileData } = useContext(UserContext);

  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePost = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("content", content);
    formData.append("whoShared", user.userId);

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/post",
        formData,
        {
          headers: {
            "Content-Type": "Multipart/form-data",
          },
        }
      );
      getPost();
      setContent("");
      setImage(null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onEmojiClick = (emojiObject, event) => {
    setContent((prev) => prev + emojiObject.emoji);
    setOpenEmoji(!openEmoji);
  };

  return (
    <div className=" w-full md:w-[50%] rounded-lg bg-white shadow-lg p-6 md:p-8 space-y-4 relative">
      <div className="flex items-start space-x-4">
        {/* Profile Picture */}
        <img
          className="w-12 h-12 md:w-14 md:h-14 object-cover rounded-full border-2 border-gray-300"
          src={
            profileData?.profilePicture
              ? `http://localhost:5000/${profileData.profilePicture}`
              : "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"
          }
          alt="Profile"
        />
        <div className="flex-grow">
          {/* Input Field */}
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-gray-100 rounded-lg p-3 text-sm md:text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-colors"
            type="text"
            placeholder={
              profileData !== null
                ? `Share something, ${profileData.username}`
                : "If you want to share, then Login :)"
            }
          />
        </div>
        {/* Emoji Picker */}
        <div
          onClick={() => setOpenEmoji(!openEmoji)}
          className="text-2xl md:text-3xl cursor-pointer text-yellow-400 hover:text-yellow-500 transition"
        >
          <MdEmojiEmotions />
        </div>
      </div>

      {/* Emoji Picker Dropdown */}
      {openEmoji && (
        <div className="absolute right-0 top-36 md:right-8  z-50">
          <EmojiPicker height={300} width={250} onEmojiClick={onEmojiClick} />
        </div>
      )}

      {/* Image Upload and Share Button */}
      <div className="flex items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <label
          htmlFor="file-upload"
          className="flex items-center space-x-2 cursor-pointer bg-gray-200 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-300 transition"
        >
          <input
            id="file-upload"
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="hidden"
          />
          <span>Upload Image</span>
        </label>

        {/* Share Button */}
        {loading ? (
          <Loading />
        ) : (
          <button
            onClick={handlePost}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Share
          </button>
        )}
      </div>
    </div>
  );
};

export default SharePost;
