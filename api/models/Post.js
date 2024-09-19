const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    likesOrDislike: [
      {
        status: {
          liked: { type: Boolean, default: false },
          disliked: { type: Boolean, default: false },
        },
        whoDid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],

    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    whoShared: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    totalLiked:{
      type:Number,
      default:null,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
