import React, { useContext } from "react";
import { UserContext } from "../UserContext/UserContext";
import { FcLike } from "react-icons/fc";

const Comments = ({ comments }) => {
  const { profileData } = useContext(UserContext);
  console.log(comments);

  const formatTimeAgo = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffMs = now - createdDate; // Difference in milliseconds
    const diffSeconds = Math.floor(diffMs / 1000); // Convert to seconds
    const diffMinutes = Math.floor(diffSeconds / 60); // Convert to minutes
    const diffHours = Math.floor(diffMinutes / 60); // Convert to hours

    if (diffHours > 0) {
      return `${diffHours}h`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m`;
    } else {
      return `${diffSeconds}s`;
    }
  };

  return (
    <div className="w-full bg-black p-4 mt-4 rounded-lg">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} className="flex gap-5 mb-4">
            <div className="pt-3">
              <img
                className="w-10 h-10 object-cover rounded-full"
                src={
                  comment.user?.profilePicture
                    ? `http://localhost:5000/${comment.user.profilePicture}`
                    : "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"
                }
                alt="User"
              />
            </div>
            <div className=" rounded-xl p-2 max-w-full flex flex-col text-white gap-4">
              <div className="flex flex-row gap-2">
                <h2 className="text-white whitespace-nowrap text-sm font-extrabold cursor-pointer hover:text-gray-600">
                  {comment.user.username} 
                </h2>
                <p className="whitespace-normal text-sm text-white inline-block break-all ">
                  {comment.comment} 
                </p>
              </div>
              <div className="flex flex-row gap-4 text-sm">
              <p className=" text-white text-xs sm:text-base flex items-center">
                {formatTimeAgo(comment.createdAt)}
              </p>
              <div className="flex gap-2 cursor-pointer">
                <FcLike/>
              <p className="text-xs sm:text-base flex items-center">2 likes</p>
              </div>
              <p  className="cursor-pointer text-xs sm:text-base flex items-center">reply</p>
              </div>
              
            </div>
          </div>
        ))
      ) : (
        <p className="text-white">No comments yet.</p>
      )}
    </div>
  );
};

export default Comments;
