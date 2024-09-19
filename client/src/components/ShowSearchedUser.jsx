import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext/UserContext";

const ShowSearchedUser = ({ users, onUserSelect }) => {
  const { user, setProfileUserId } = useContext(UserContext);
  const navigate = useNavigate();

  const handleUserClick = (id) => {
    setProfileUserId(id);
    if (onUserSelect) {
      onUserSelect(id); // Pass the user ID to the handler
    }
    if (id === user.userId) {
      navigate("/profile");
    } else {
      navigate(`/profile/${id}`);
    }
  };

  return (
    <div className="absolute w-full  md:w-64 lg:w-64 max-h-80 overflow-auto  bg-white shadow-lg rounded-lg border border-gray-200">
      {users.length > 0 ? (
        users.map((item) => (
          <div
            key={item._id}
            onClick={() => handleUserClick(item._id)}
            className="flex items-center p-4 border-b border-gray-300 hover:bg-gray-100 cursor-pointer transition duration-200 ease-in-out"
          >
            <img
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-gray-300"
              src={
                item.profilePicture
                  ? `http://localhost:5000/${item.profilePicture}`
                  : "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"
              }
              alt={item.username}
            />
            <div className="ml-4">
              <h4 className="text-sm   sm:text-sm md:text-base lg:text-xl font-semibold text-gray-800">
                {item.username}
              </h4>
              {/* Optional: Add more user details if needed */}
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-gray-500">No users found</div>
      )}
    </div>
  );
};

export default ShowSearchedUser;
