import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState("");
  const [postId, setPostId] = useState("");
  const [postStatuses, setPostStatuses] = useState({});
  const [notification, setNotification] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileUserId, setProfileUserId] = useState(null);
  const [userProfileData, setUserProfileData] = useState("");
  const [userFollowers, setUserFollowers] = useState([]);
  const [openChat, setOpenChat] = useState(false);
  const [messagerId, setMessagerId] = useState("");
  const [notificationFromUser, setNotificationFromUser] = useState([]);
  const [userPost, setUserPost] = useState({});

  const getCurrentUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/current",
        { withCredentials: true }
      );
      setUser(response.data.user);
    } catch (error) {
      console.log("Error fetching current user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    getCurrentUser();
    getPost();

   
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    setUser(null);
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      window.location.reload();
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  const getPost = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/post");
      if (!Array.isArray(response.data)) {
        console.log("API response is not an array:", response.data);
        return;
      }
      const sortedPosts = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sortedPosts);

      const statusUpdates = {};
      if (user) {
        sortedPosts.forEach((post) => {
          const userAction = post.likesOrDislike.find(
            (status) => status.whoDid === user.userId
          );
          statusUpdates[post._id] = userAction
            ? userAction.status
            : { liked: false, disliked: false };
        });
      } else {
        sortedPosts.forEach((post) => {
          statusUpdates[post._id] = { liked: false, disliked: false };
        });
      }
      setPostStatuses(statusUpdates);
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  };

  const handleNotification = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/post/notifications",
        {
          params: { userId: user.userId },
        }
      );
      setNotification(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      getPost();
      handleNotification();
      getFollowers();
      getUserProfile()
    }
  }, [user]);

  const sendFollowing = async (id) => {
    if (!user?.userId) return;
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/auth/follow/${id}`,
        null,
        {
          params: { userId: user.userId },
        }
      );
      window.location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleUnfollow = async (id) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/auth/unfollow/${id}`,
        null,
        {
          params: { userId: user.userId },
        }
      );
      window.location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getFollowers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/getfollowers",
        {
          params: { userId: user.userId },
        }
      );
      setUserFollowers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/getuserprofile",
        {
          params: { userId: user.userId },
        }
      );
      
      setProfileData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loginUser,
        logout,
        getCurrentUser,
        getPost,
        posts,
        comment,
        setComment,
        setPostId,
        postId,
        postStatuses,
        setPostStatuses,
        notification,
        setNotification,
        handleNotification,
        setProfileImage,
        profileImage,
        profileData,
        setProfileData,
        loading,
        setLoading,
        profileUserId,
        setProfileUserId,
        sendFollowing,
        handleUnfollow,
        userProfileData,
        setUserProfileData,
        userFollowers,
        setUserFollowers,
        openChat,
        setOpenChat,
        messagerId,
        setMessagerId,
        notificationFromUser,
        setNotificationFromUser,
        userPost,
        setUserPost,
        getFollowers
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
