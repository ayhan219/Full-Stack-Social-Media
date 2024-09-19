import React, { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../UserContext/UserContext";
import io from "socket.io-client";
import axios from "axios";

// Socket.IO client
const socket = io("http://localhost:8900", {});

const OpenChat = () => {
  const { user, setOpenChat, openChat, messagerId,notificationFromUser,setNotificationFromUser } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  

  const messageEndRef = useRef(null); // Ref for the end of the message list

  useEffect(() => {
    socket.emit("register", user?.userId);

    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/message/getmessages', {
          params: { userId: user?.userId, chatPartnerId: messagerId }
        });
        setMessages(response.data);

        setRecipientUsername(response.data[0]?.recipientUsername); // Check if recipientUsername exists
        
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    // Mesaj alma
    socket.on("receiveMessage", (messageData) => {
      
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    // Bildirim alma
    socket.on("getNotification",async (notificationData) => {
      let username;
      try {
        const findUser = await axios.get("http://localhost:5000/api/auth/getuserprofile",{
         params:{userId:notificationData.senderId}
        })
        username = findUser.data.username
        
      } catch (error) {
        console.log(error);
        
      }
      const newNotification ={
        username:username, 
        message:notificationData.message,
      }
      
      setNotificationFromUser((prevNotification)=>[...prevNotification,newNotification]);
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
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (message.trim() !== '') {
      const messageData = {
        senderId: user.userId,
        username: user.username,
        recipientId: messagerId,
        message,
      };

      
      
      try {
        await axios.post('http://localhost:5000/api/message', messageData); 
        socket.emit('sendMessage', messageData);
        setMessages((prevMessages) => [...prevMessages, messageData]);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <>
      {openChat ? (
        <div className="w-[350px] h-[400px] bg-white fixed bottom-4 right-4 rounded-xl shadow-lg p-4 flex flex-col">
          <div className="flex justify-between items-center border-b pb-2 mb-3">
            <h3 className="text-lg font-bold text-gray-700">Chat</h3>
            <button
              onClick={() => setOpenChat(false)}
              className="text-red-500 text-sm"
            >
              Close
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 flex ${
                    msg.senderId === user.userId && "justify-end"
                  } `}>
                  <strong className={`${msg.senderId === user.userId && "text-black"}`}>
                    {msg.senderId === user.userId ? "me" : msg.username}:
                  </strong>{" "}
                  {msg.message}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">no messages</p>
            )}
            <div ref={messageEndRef} /> {/* Invisible element for scroll */}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      ) : null}

    
     
    </>
  );
};

export default OpenChat;
