import { IoIosClose } from "react-icons/io";
import { FaSpinner } from "react-icons/fa"; // Spinner icon
import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../UserContext/UserContext";
import LoadingEffect from "../assets/Loading"

const Notification = ({
  item2,
  notification,
  openNotification,
  setOpenNotification,
}) => {
  const { user, handleNotification } = useContext(UserContext);
  const [loading, setLoading] = useState(false); // Track loading state

  const deleteNotification = async (e, id) => {
    e.preventDefault();
    setLoading(true); // Set loading to true
    try {
      const response = await axios.delete(
        "http://localhost:5000/api/post/deletenotification",
        {
          params: {
            userId: user.userId,
            notificationId: id,
          },
        }
      );
      console.log(response);
      handleNotification();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Stop loading once the operation is done
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-100 border border-gray-300 rounded-lg p-4 shadow-lg">
      <div className="flex items-center gap-3">
        {/* Notification Icon */}
        <div className="bg-blue-500 text-white rounded-full p-2 flex items-center justify-center">
          <p className="font-bold text-sm">{item2.type ? item2.type[0] : "N"}</p>
        </div>

        {/* Notification Message */}
        <p className="text-sm font-medium text-gray-700">{item2.message}</p>
      </div>

      {/* Close Button or Spinner */}
      {loading ? (
       <LoadingEffect />
      ) : (
        <IoIosClose
          onClick={(e) => deleteNotification(e, item2._id)}
          className="text-gray-500 hover:text-red-600 cursor-pointer text-5xl transition-colors duration-300"
        />
      )}
    </div>
  );
};

export default Notification;
