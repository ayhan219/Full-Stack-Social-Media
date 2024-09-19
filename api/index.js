const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const UserRouter = require("./router/UserRouter");
const PostRouter = require("./router/PostRouter");
const MessageRouter = require("./router/MessageRouter")
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");




dotenv.config();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/ProfilePhotos",
  express.static(path.join(__dirname, "ProfilePhotos"))
);

app.use(
  cors({
    origin: "http://localhost:5173", // Change this to your frontend origin
    credentials: true, // Allows cookies to be sent
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", UserRouter);
app.use("/api/post", PostRouter);
app.use("/api/message",MessageRouter)

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("connected to DB!");
};


app.listen(5000, async () => {
  await connectDB();
  console.log("server listening on port 5000");
});
