import React, { useContext, useState, useEffect } from "react";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { FaComments } from "react-icons/fa";
import Comments from "./Comments";
import { UserContext } from "../UserContext/UserContext";
import { formatDistanceToNow } from "date-fns";
import WriteComment from "./WriteComment";
import axios from "axios";
import { FcLike } from "react-icons/fc";
import { Link } from "react-router-dom";

const Post = () => {
  const [openComments, setOpenComments] = useState({});

  const { posts, loading, setLoading } = useContext(UserContext);
  const [bigScreenOpenComments, setBigScreenOpenComments] = useState({});
  const [postComments, setPostComments] = useState({});
  const [openInBigScreen, setOpenInBigscreen] = useState(false);
  const [getSinglePostData, setGetSinglePostData] = useState({});
  const [singlePostId, setSinglePostId] = useState(null);
  const url = "http://localhost:5000/";
  const {
    user,
    postStatuses,
    setPostStatuses,
    notification,
    setNotification,
    handleNotification,
    profileImage,
  } = useContext(UserContext);

  const getComments = async (postId) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/post/getcomments",
        {
          params: { postId },
        }
      );
      setPostComments((prevState) => ({
        ...prevState,
        [postId]: response.data,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentToggle = (postId) => {
    setOpenComments((prevState) => {
      const newState = { ...prevState, [postId]: !prevState[postId] };
      if (newState[postId] && !postComments[postId]) {
        getComments(postId);
      }
      return newState;
    });
  };
  const handleBigScreenCommentToggle = (postId) => {
    setBigScreenOpenComments((prevState) => {
      const newState = { ...prevState, [postId]: !prevState[postId] };
      if (newState[postId] && !postComments[postId]) {
        getComments(postId);
      }
      return newState;
    });
  };

  const handleLikeDislike = async (postId, type) => {
    try {
      const newPostStatus =
        type === "like"
          ? { liked: true, disliked: false }
          : { liked: false, disliked: true };

      setPostStatuses((prevStatuses) => ({
        ...prevStatuses,
        [postId]: newPostStatus,
      }));

      const response = await axios.put(
        "http://localhost:5000/api/post/poststatus",
        {
          postId,
          status: newPostStatus,
          whoDid: user.userId,
        }
      );
      setNotification(response.data);
      handleNotification();
    } catch (error) {
      console.log(error);
    }
  };

  const updateComments = (postId) => {
    getComments(postId);
  };

  const getOnePost = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/post/getsinglepost",
        {
          params: { postId: id },
        }
      );
      setGetSinglePostData(response.data);
      setSinglePostId(id);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSinglePost = async (id) => {
    await getOnePost(id);
    setOpenInBigscreen(!openInBigScreen);
  };

  return (
    <>
      <div className=" w-full md:w-[50%] shadow-2xl rounded-lg mb-10 relative flex flex-col gap-32 ">
        {/* Header */}
        {posts.map((item) => (
          <div key={item._id}>
            <div className="w-full h-24 bg-primary rounded-t-lg ">
              <div className="flex p-5 items-center gap-5 text-white">
                <Link
                  to={
                    user && user.userId === item.whoShared._id
                      ? `${`/profile`}`
                      : `${`/profile/${item.whoShared._id}`}`
                  }
                >
                  <img
                    className="w-12 h-10 sm:w-16 sm:h-14 object-cover rounded-full"
                    src={
                      item.whoShared.profilePicture !== null
                        ? `http://localhost:5000/${item.whoShared.profilePicture}`
                        : "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"
                    }
                    alt="User"
                  />
                </Link>
                <div className=" text-xs sm:text-base flex gap-1 sm:gap-3 flex-col">
                  <Link
                    to={
                      user && user.userId === item.whoShared._id
                        ? `${`/profile`}`
                        : `${`/profile/${item.whoShared._id}`}`
                    }
                  >
                    <h2 className="text-base md:text-xl">
                      {item.whoShared.username}
                    </h2>
                  </Link>
                  <p>
                    {formatDistanceToNow(new Date(item.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="w-full">
              {item.image !== null && (
                <img
                  onClick={() => {
                    handleOpenSinglePost(item._id);
                  }}
                  className="w-full h-[20rem] object-cover cursor-pointer"
                  setItWillOpenThisPost
                  src={`${url}${item.image}`}
                  alt="Post"
                />
              )}
            </div>

            {/* Post Content */}
            <div
              onClick={() => {
                handleOpenSinglePost(item._id);
              }}
              className="text-sm  md:text-base pt-6 px-5 break-words cursor-pointer "
            >
              <p>{item.content}</p>
            </div>

            {/* Like, Dislike, and Comment Section */}
            <div className="flex justify-between items-center pt-6 px-2 sm:px-5 h-32">
              <div className="text-2xl md:text-3xl flex gap-2 sm:gap-5">
                <div
                  onClick={() => handleLikeDislike(item._id, "like")}
                  className="flex  text-sm md:text-xl md:gap-1 hover:text-blue-800  ease-in-out duration-300 cursor-pointer"
                >
                  <AiFillLike
                    className={`cursor-pointer ${
                      postStatuses[item._id]?.liked
                        ? "text-red-700"
                        : "text-inherit"
                    }`}
                  />
                  <p className="">Likes</p>
                </div>

                <div
                  onClick={() => handleLikeDislike(item._id, "dislike")}
                  className="flex hover:text-blue-800 text-sm md:text-xl md:gap-1 ease-in-out duration-150 cursor-pointer"
                >
                  <AiFillDislike
                    className={`cursor-pointer  ${
                      postStatuses[item._id]?.disliked
                        ? "text-red-700"
                        : "text-inherit"
                    }`}
                  />
                  <p className="">Dislike</p>
                </div>
                <div className="flex gap-1 text-sm md:text-xl sm:gap-2">
                  <FcLike />
                  <p>{item.totalLiked}</p>
                </div>
              </div>
              <div
                onClick={() => handleCommentToggle(item._id)}
                className="flex text-xl gap-3 cursor-pointer text-white"
              >
                <FaComments />
                <h3 className="hidden md:block">Comments</h3>
              </div>
            </div>

            {/* Comment Section */}
            {openComments[item._id] && (
              <div className="bg-black rounded-xl mb-20">
                <WriteComment
                  postId={item._id}
                  onCommentAdded={() => updateComments(item._id)}
                />
                <Comments comments={postComments[item._id] || []} />
              </div>
            )}
          </div>
        ))}
      </div>
      {openInBigScreen && (
        <div
          onClick={() => {
            setOpenInBigscreen(!openInBigScreen);
          }}
          className="fixed -top-40 right-0 left-0 bottom-0 z-50 bg-black bg-opacity-75 flex justify-center items-center"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-black w-3/5 sm:w-2/5  rounded-lg"
          >
            {/* Büyük ekran içerik kısmı */}
            <div className="w-full h-24 bg-primary rounded-t-lg">
              <div className="flex p-5 items-center gap-5 text-white">
                <img
                  className="w-12 h-10 sm:w-16 sm:h-14 object-cover rounded-full"
                  src={
                    getSinglePostData.profilePicture !== null
                      ? `http://localhost:5000/${getSinglePostData.profilePicture}`
                      : "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"
                  }
                  alt="User"
                />
                <div className="text-xs sm:text-base flex gap-1 sm:gap-3 flex-col">
                  <h2 className="text-base md:text-xl">
                    {getSinglePostData.username}
                  </h2>
                  {formatDistanceToNow(
                    new Date(getSinglePostData.findPost.createdAt),
                    {
                      addSuffix: true,
                    }
                  )}
                </div>
              </div>
            </div>

            {/* Görsel veya resim alanı */}
            <div className="w-full">
              {getSinglePostData.findPost.image !== null && (
                <img
                  className="w-full h-[20rem] object-cover cursor-pointer"
                  setItWillOpenThisPost
                  src={`${url}${getSinglePostData.findPost.image}`}
                  alt="Post"
                />
              )}
            </div>

            {/* Post içeriği */}
            <div className="text-sm md:text-base pt-6 px-5 break-words text-white">
              <p>{getSinglePostData.findPost.content}</p>
            </div>

            {/* Like, Dislike, ve Comment bölümü */}
            <div className="flex justify-between items-center pt-6 px-2 sm:px-5 h-32">
              <div className="text-2xl md:text-3xl flex gap-2 sm:gap-5">
                <div
                  onClick={() => handleLikeDislike(singlePostId, "like")}
                  className="flex  text-sm md:text-xl md:gap-1 hover:text-blue-800  ease-in-out duration-300 cursor-pointer"
                >
                  <AiFillLike
                    className={`cursor-pointer ${
                      postStatuses[singlePostId]?.liked
                        ? "text-red-700"
                        : "text-inherit"
                    }`}
                  />
                  <p className="">Likes</p>
                </div>

                <div
                  onClick={() => handleLikeDislike(singlePostId, "dislike")}
                  className="flex hover:text-blue-800 text-sm md:text-xl md:gap-1 ease-in-out duration-150 cursor-pointer"
                >
                  <AiFillDislike
                    className={`cursor-pointer  ${
                      postStatuses[singlePostId]?.disliked
                        ? "text-red-700"
                        : "text-inherit"
                    }`}
                  />
                  <p className="">Dislike</p>
                </div>

                <div className="flex gap-1 text-sm md:text-xl sm:gap-2">
                  <FcLike />
                  <p>{getSinglePostData.findPost.totalLiked}</p>
                </div>
              </div>

              <div
                onClick={() => handleBigScreenCommentToggle(singlePostId)}
                className="flex text-xl gap-3 cursor-pointer text-white"
              >
                <FaComments />
                <h3 className="hidden md:block">Comments</h3>
              </div>
            </div>

            {/* Comment kısmı */}
            {bigScreenOpenComments[singlePostId] && (
              <div className="bg-black rounded-xl mb-20">
                <WriteComment
                  postId={singlePostId}
                  onCommentAdded={() => updateComments(singlePostId)}
                />
                <Comments comments={postComments[singlePostId] || []} />
              </div>
            )}
          </div>
        </div>
      )}
     
    </>
  );
};

export default Post;
