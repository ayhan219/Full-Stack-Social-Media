const Message = require("../api/models/Message");
const User = require("../api/models/User")
const mongoose = require("mongoose");

const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:5173",
  },
});


const users = {}; 

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);


  socket.on("register", (userId) => {
    users[userId] = socket.id;
    console.log(`User ${userId} registered with socket ID ${socket.id}`);
  });


  socket.on("sendMessage", async (messageData) => {
    const { senderId, recipientId, message } = messageData;


    const recipientSocketId = users[recipientId];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", messageData);

     
      io.to(recipientSocketId).emit("getNotification", {
        senderId,        
        message,         
        messageType: "New Message" 
      });
      
      console.log(`Message sent to user ${recipientId} with socket ID ${recipientSocketId}`);
    } else {
      console.log(`Recipient ${recipientId} not found`);
    }
  });

 
  socket.on("disconnect", () => {
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});
