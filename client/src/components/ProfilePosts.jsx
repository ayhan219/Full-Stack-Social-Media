import React, { useContext } from "react";
import { FcLike } from "react-icons/fc";
import { FaComment } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { UserContext } from "../UserContext/UserContext";

const ProfilePosts = ({ item, openPostArea, setUserPosts }) => {
  const {user} = useContext(UserContext)
  const deletePost = async (id) => {
    try {
      const response = await axios.delete(
        "http://localhost:5000/api/post/deletepost",
        {
          params: { 
            postId: id ,
            userId: user.userId
          },
        }
      );
      if (response.status === 200) {
        setUserPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== id)
        );
      }
      window.location.reload();
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      key={item._id}
      className="group w-4/5 sm:w-2/5 h-60 bg-white hover:bg-gray-800 hover:opacity-75 transition duration-300 ease-in-out relative rounded-lg overflow-hidden shadow-lg"
    >
      <div className="relative w-full h-full">
        <img
          className="w-full h-full object-cover"
          src={
            item?.image
              ? `http://localhost:5000/${item.image}`
              : "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
          }
          alt="Post Thumbnail"
        />
        <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black to-transparent">
          {/* Edit ve Delete Butonları */}
          <div className="w-full absolute top-0 flex justify-evenly font-extrabold text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <CiEdit
              onClick={() => openPostArea(item._id)}
              className="cursor-pointer"
            />
            <MdDelete
              onClick={() => deletePost(item._id)}
              className="cursor-pointer"
            />
          </div>

          <div className="flex justify-between text-white text-lg font-semibold">
            <div className="flex items-center gap-2">
              <FcLike />
              <span>{item.totalLiked === null ? `0` : item.totalLiked}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaComment />
              <span>
                {item.comments.length === 0 ? `0` : item.comments.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePosts;
