import React, { useContext, useState, useEffect, useRef } from "react";
import ChatUser from "../components/ChatUser";
import { UserContext } from "../UserContext/UserContext";
import io from "socket.io-client";
import axios from "axios";
import { TiMessages } from "react-icons/ti";

const socket = io("http://localhost:8900", {});

const Chat = () => {
  const {
    user,
    setOpenChat,
    openChat,
    setMessagerId,
    messagerId,
    notificationFromUser,
    setNotificationFromUser,
    userFollowers,
  } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [specificUser, setSpecificUser] = useState({});

  const getSpecificUser = async (id) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/getuserprofile",
        {
          params: { userId: id },
        }
      );
      console.log(response);
      setSpecificUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const messageEndRef = useRef(null);

  const showUserId = (id) => {
    setMessagerId(id);
    setNotificationFromUser([]);
    setOpenChat(true);
  };

  useEffect(() => {
    socket.emit("register", user?.userId);

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/message/getmessages",
          {
            params: { userId: user?.userId, chatPartnerId: messagerId },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });
    socket.on("receiveMessage", (messageData) => {
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });


    socket.on("getNotification", async (notificationData) => {
      let username;
      try {
        const findUser = await axios.get(
          "http://localhost:5000/api/auth/getuserprofile",
          {
            params: { userId: notificationData.senderId },
          }
        );
        username = findUser.data.username;
      } catch (error) {
        console.log(error);
      }
      const newNotification = {
        username: username,
        message: notificationData.message,
      };

      setNotificationFromUser((prevNotification) => [
        ...prevNotification,
        newNotification,
      ]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("getNotification");
    };
  }, [user?.userId, messagerId]);

  useEffect(() => {
    // Scroll to the bottom every time messages are updated
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    const chatArea = messageEndRef.current?.parentNode; 
    if (chatArea) {
      chatArea.scrollTop = chatArea.scrollHeight; 
    }
  };

  const sendMessage = async () => {
    if (message.trim() !== "") {
      const messageData = {
        senderId: user.userId,
        username: user.username,
        recipientId: messagerId,
        message,
      };

      try {
        await axios.post("http://localhost:5000/api/message", messageData);
        socket.emit("sendMessage", messageData);
        setMessages((prevMessages) => [...prevMessages, messageData]);
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="w-full h-screen flex">
      {/* Sidebar (User List) */}
      <div className="w-[20%] h-full bg-black border-r-2 border-white text-white flex flex-col">
        <div className="flex items-center justify-center py-8">
          <h2 className="font-extrabold text-white text-sm sm:text-2xl">
            {user?.username}
          </h2>
        </div>

        <div className="font-bold text-white text-xl  sm:px-8 pb-4">
          <h2 className=" text-sm sm:text-xl">Messages</h2>
          <hr className="border-gray-700 mt-2" />
        </div>

        <div className="px-5 flex flex-col gap-4 overflow-y-auto">
          {userFollowers.map((item) => (
            <ChatUser
              key={item.id}
              item={item}
              showUserId={showUserId}
              getSpecificUser={getSpecificUser}
            />
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-[80%] h-full bg-gray-950 text-white flex flex-col">
        <div className="w-full h-24 bg-gray-950 flex items-center p-6 gap-4 shadow-lg">
          {messages.length > 0 && (
            <img
              className="w-16 h-16 rounded-full object-cover"
              src={
                specificUser.profilePicture !== null
                  ? "http://localhost:5000/" + specificUser.profilePicture
                  : "https://i.pinimg.com/236x/34/6e/1d/346e1df0044fd77dfb6f65cc086b2d5e.jpg"
              }
              alt="User Avatar"
            />
          )}
          <h3 className="font-bold text-2xl">{specificUser.username}</h3>
        </div>

        {/* Chat Messages */}
        <div className="w-full flex-grow p-6 space-y-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
          {messages.length > 0 ? (
            messages.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-4 ${
                  item.senderId === user.userId ? "justify-end " : ""
                }`}
              >
                {item.senderId !== user.userId && (
                  <img
                    className="w-14 h-14 rounded-full"
                    src={
                      specificUser.profilePicture
                        ? `http://localhost:5000/${specificUser.profilePicture}`
                        : "https://i.pinimg.com/236x/34/6e/1d/346e1df0044fd77dfb6f65cc086b2d5e.jpg"
                    }
                    alt="User Avatar"
                  />
                )}

                <div
                  className={`${
                    item.senderId === user.userId
                      ? " bg-blue-800"
                      : "bg-gray-700"
                  } text-white p-4 rounded-lg max-w-xs`}
                >
                  <p>{item.message}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center flex-col text-3xl pt-40">
              {" "}
              <TiMessages className="text-8xl" />
              <p className="text-center pt-20  font-medium">You are in messages area! <br /> Select a user that you are following</p>{" "}
            </div>
          )}
          <div ref={messageEndRef} /> {/* Invisible element for scroll */}
        </div>

        {
          user && <div className="w-full h-20 bg-black flex items-center px-6">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full h-12 p-4 text-black bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </div>
        }
      </div>
    </div>
  );
};

export default Chat;
