const User = require("../models/User");
const Post = require("../models/Post");
const { find, findById } = require("mongoose/lib/model");
const { get } = require("mongoose/lib/helpers/populate/leanPopulateMap");

const createPost = async (req, res) => {
  const { content, whoShared } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    // Validate input
    if (!content || !whoShared) {
      return res.status(400).json({ message: "Provide all information" });
    }

    // Create a new post
    const newPost = new Post({
      content,
      whoShared,
      image,
    });

    // Save the post
    const savedPost = await newPost.save();

    // Update the user document with the new post ID
    await User.findByIdAndUpdate(whoShared, {
      $push: { posts: savedPost._id }, // Assuming 'posts' is an array in the User schema
    });

    return res.status(200).json({ message: "Post Created!" });
  } catch (error) {
    return res.status(400).json({ message: "Error creating post", error });
  }
};

const getPosts = async (req, res) => {
  try {
    const datas = await Post.find({}).populate({
      path: "whoShared",
      select: "-password", // Exclude the password field
    });

    return res.status(200).json(datas);
  } catch (error) {
    return res.status(400).json(error);
  }
};
const postComment = async (req, res) => {
  const { postId, comment, whoPostedComment } = req.body;
  try {
    if (!postId || !comment || !whoPostedComment) {
      return res.status(400).json({ message: "Provide all information" });
    }
    const findPost = await Post.findById(postId);
    findPost.comments.push({
      user: whoPostedComment,
      comment: comment,
      createdAt: new Date(),
    });
    await findPost.save();

    if (!findPost) {
      return res.status(400).json({ message: "Post not found" });
    }
    return res
      .status(200)
      .json({ message: "Comment added successfully", post: findPost });
  } catch (error) {
    return res.status(400).json(error);
  }
};
const getComments = async (req, res) => {
  const { postId } = req.query;

  try {
    const foundedPost = await Post.findById(postId).populate({
      path: "comments.user", // 'user' refers to the user field in comments array
      select: "username email profilePicture",
    });

    if (!foundedPost) {
      return res.status(400).json({ message: "Post not found" });
    }

    return res.status(200).json(foundedPost.comments);
  } catch (error) {
    return res.status(400).json(error);
  }
};

const postStatus = async (req, res) => {
  const { postId, status, whoDid } = req.body;

  try {
    if (!postId || !status || !whoDid) {
      return res.status(400).json({ message: "Provide all information" });
    }

    const findPost = await Post.findById(postId);
    if (!findPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingStatus = findPost.likesOrDislike.find(
      (entry) => entry.whoDid.toString() === whoDid.toString()
    );

    let likedBefore = false;

    if (existingStatus) {
      likedBefore = existingStatus.status.liked;
      existingStatus.status = status;
    } else {
      findPost.likesOrDislike.push({ status, whoDid });
    }
    if (likedBefore && status.liked === false && status.disliked === true) {
      findPost.totalLiked = Math.max(0, findPost.totalLiked - 1);
    }

    const postOwner = await User.findById(findPost.whoShared);
    if (!postOwner) {
      return res.status(404).json({ message: "Post owner not found" });
    }
    const findWhoDid = await User.findById(whoDid);

    if (!likedBefore && status.liked === true) {
      findPost.totalLiked += 1;
    }

    if (postOwner._id.toString() === findWhoDid._id.toString()) {
      postOwner.notifications.push({
        userId: whoDid,
        message: `Your post was ${
          status.liked ? "Liked" : "Disliked"
        } by yoursel
        `,
      });
    } else {
      postOwner.notifications.push({
        userId: whoDid,
        message: `Your post was ${status.liked ? "Liked" : "Disliked"} by ${
          findWhoDid.username
        }`,
      });
    }

    await findPost.save();
    await postOwner.save();

    return res.status(200).json({ message: "Successfully updated status" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const getNotifications = async (req, res) => {
  const { userId } = req.query;

  try {
    if (!userId) {
      return res.status(400).json({ message: "no user" });
    }
    const findUser = await User.findById(userId);
    if (!findUser) {
      return res.status(400).json({ message: "user couldn't find" });
    }
    return res.status(200).json(findUser.notifications);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const deleteNotification = async (req, res) => {
  const { userId, notificationId } = req.query;

  try {
    if (!userId || !notificationId) {
      return res.status(400).json({ message: "provide all information" });
    }
    const findUser = await User.findById(userId);

    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const notificationIndex = findUser.notifications.findIndex(
      (item) => item._id.toString() === notificationId
    );
    if (notificationIndex === -1) {
      return res.status(404).json({ message: "Notification not found" });
    }

    findUser.notifications.splice(notificationIndex, 1);
    await findUser.save();
    return res.status(200).json({ message: "notification deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const getSinglePost = async (req, res) => {
  const { postId } = req.query;

  try {
    if (!postId) {
      return res.status(400).json({ message: "no post Id" });
    }
    const findPost = await Post.findById(postId);
    if (!findPost) {
      return res.status(400).json({ message: "post not found" });
    }
    const findUser = await User.findById(findPost.whoShared);
    if (!findUser) {
      return res.status(400).json({ message: "user not found" });
    }

    return res.status(200).json({
      username: findUser.username,
      profilePicture: findUser.profilePicture,
      findPost,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const getUserPosts = async (req, res) => {
  const { userId } = req.query;

  try {
    if (!userId) {
      return res.status(400).json({ message: "no user id" });
    }
    const findUser = await User.findById(userId);

    if (!findUser) {
      return res.status(400).json({ message: "user not found" });
    }

    const posts = findUser.posts;
    let allPosts = [];

    const findPosts = await Promise.all(
      posts.map(async (postId) => {
        const post = await Post.findById(postId);
        return post;
      })
    );
    allPosts = findPosts;

    return res.status(200).json(allPosts);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const updatePost = async (req, res) => {
  const { content, postId } = req.body;

  try {
    if (!content || !postId) {
      return res.status(400).json({ message: "no content or post id" });
    }
    const findPost = await Post.findById(postId);

    if (!findPost) {
      return res.status(400).json({ message: "post not found" });
    }
    findPost.content = content;
    await findPost.save();

    return res.status(200).json({ message: "post updated" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const deletePost = async (req, res) => {
  const { postId, userId } = req.query;

  try {
    if (!postId) {
      return res.status(400).json({ message: "No post ID provided" });
    }

    const findUser = await User.findById(userId);
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const findPost = await Post.findById(postId);
    if (!findPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    await Post.findByIdAndDelete(postId);

    const newPosts = findUser.posts.filter(
      (post) => post._id.toString() !== postId
    );
    findUser.posts = newPosts;

    await findUser.save();

    return res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createPost,
  getPosts,
  postComment,
  getComments,
  postStatus,
  getNotifications,
  deleteNotification,
  getSinglePost,
  getUserPosts,
  updatePost,
  deletePost,
};
