import axios from "axios";

export const sendComment = async (postId, comment, userId) => {
  try {
    const response = await axios.put("http://localhost:5000/api/post/postcomment", {
      postId,
      comment,
      whoPostedComment: userId,
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};