import React from "react";
import { IoIosClose } from "react-icons/io";
import { FaSpinner } from "react-icons/fa"; // Spinner icon
import { useContext } from "react";
import { UserContext } from "../UserContext/UserContext";

const NotificationMessage = ({ isLoading, handleClose, item3, index }) => {
  const { setNotificationFromUser } = useContext(UserContext);
  return (
    <div onClick={()=>setNotificationFromUser([])}
      key={index}
      className="flex flex-col gap-2 bg-gray-100 border border-gray-300 rounded-lg p-4 shadow-lg"
    >
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <FaSpinner className="text-gray-500 animate-spin text-2xl" />
        </div>
      ) : (
        <div
          key={index}
          className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-4 shadow-md"
        >
          <div className="flex items-center gap-3">
            {/* Notification Icon */}
            <div className="bg-blue-500 text-white rounded-full p-2 flex items-center justify-center">
              <p className="font-bold text-sm">{item3.username}</p>
            </div>

            {/* Notification Message */}
            <p className="text-sm font-medium text-gray-700">
              {item3.message || "Notification message"}
            </p>
          </div>

          {/* Close Button */}
         
        </div>
      )}
    </div>
  );
};

export default NotificationMessage;
