import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext/UserContext";
import { useNavigate } from "react-router-dom";
import { FcLike } from "react-icons/fc";
import { FaComment } from "react-icons/fa";
import ProfilePosts from "../components/ProfilePosts";
import { IoMdClose } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import { MdEdit } from "react-icons/md";

const Profile = () => {
  const [profilePic, setProfilePic] = useState(
    "https://via.placeholder.com/150"
  );
  const [userPosts, setUserPosts] = useState([]);
  const { user, loading, getCurrentUser, profileData, setProfileData } =
    useContext(UserContext);
  const [openEditArea, setOpenEditArea] = useState(false);
  const [getEditableScreenPost, setGetEditableScreenPost] = useState(false);
  const [popuPost, setPopupPost] = useState({});
  const [editPost, setEditPost] = useState(false);
  const [newContent, setNewContent] = useState("");

  const [editedProfile, setEditedProfile] = useState({
    email: "",
    phone: "",
    address: "",
  });

  const navigate = useNavigate();

  const uploadProfilePicture = async (selectedFile) => {
    const formData = new FormData();
    formData.append("userId", user?.userId);
    formData.append("profilePicture", selectedFile);

    try {
      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);

      if (response.data) {
        setProfileData((prevData) => ({
          ...prevData,
          profilePicture: response.data,
        }));
      }
    } catch (error) {
      console.log("Error uploading profile picture:", error);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      uploadProfilePicture(selectedFile);
    }
  };
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/auth/updateprofile",
        {
          userId: user?.userId,
          ...editedProfile,
        }
      );

      setProfileData((prevData) => ({
        ...prevData,
        email: response.data.email,
        phone: response.data.phone,
        address: response.data.address,
      }));
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  };

  const getSpecificUserPosts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/post/getuserposts",
        {
          params: { userId: user.userId },
        }
      );
      setUserPosts(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
    // Set initial values in the edit form
    if (profileData) {
      setEditedProfile({
        email: profileData.email || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
      });
    }
    if (user) {
      getSpecificUserPosts();
    }
  }, [loading, user, profileData, navigate]);

  const openPostArea = async (id) => {
    setGetEditableScreenPost(!getEditableScreenPost);

    const findSpecificPost = userPosts.filter((post) => post._id === id);

    if (findSpecificPost) {
      setPopupPost(findSpecificPost);
      setNewContent(findSpecificPost[0].content);
    }
  };

  const changePostData = async (id) => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/post/updatepost",
        {
          postId: id,
          content: newContent,
        }
      );
      console.log(response);
      setGetEditableScreenPost(false);
      getSpecificUserPosts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center">
      <div className="bg-primary shadow-lg rounded-lg w-full max-w-5xl p-6 text-white">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center">
          {/* Profile Picture */}
          {loading ? (
            <span className="loading loading-bars loading-lg"></span>
          ) : (
            <div className="relative">
              <img
                src={
                  profileData?.profilePicture
                    ? `http://localhost:5000/${profileData.profilePicture}`
                    : profilePic
                }
                alt="Profile"
                className="rounded-full w-32 h-32 md:w-40 md:h-40 object-cover border-4 border-blue-500 cursor-pointer"
                onClick={() => document.getElementById("fileInput").click()} // Trigger file input click
              />
              <input
                type="file"
                id="fileInput"
                onChange={handleFileChange} // Handle file change
                accept="image/*"
                className="hidden"
              />
            </div>
          )}

          {/* User Info */}
          {profileData &&
            (loading ? (
              <span className="loading loading-bars loading-lg"></span>
            ) : (
              <div className="text-center md:text-left mt-6 md:mt-0 md:ml-8">
                <h2 className="text-2xl md:text-3xl font-semibold text-white">
                  {profileData.username}
                </h2>
                <p className="text-black">{profileData.email}</p>
                <div className="flex justify-center md:justify-start mt-4">
                  <button
                    onClick={() => setOpenEditArea(!openEditArea)}
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition"
                  >
                    {openEditArea ? "Cancel" : "Edit Profile"}
                  </button>
                </div>
              </div>
            ))}
        </div>

        <div className="flex justify-around md:justify-start mt-8 space-x-12 text-center md:text-left">
          <div>
            <span className="font-semibold text-lg">
              {profileData?.posts ? profileData.posts.length : 0}
            </span>
            <p>Posts</p>
          </div>
          <div>
            <span className="font-semibold text-lg">
              {profileData?.followers ? profileData.followers.length : 0}
            </span>
            <p>Followers</p>
          </div>
          <div>
            <span className="font-semibold text-lg">
              {profileData?.followings ? profileData.followings.length : 0}
            </span>
            <p>Following</p>
          </div>
        </div>

        {/* Edit Profile Area */}
        {openEditArea && (
          <div className="mt-8 bg-black p-6 rounded-lg">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between border-b py-2">
                <label className="font-medium">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editedProfile.email}
                  onChange={handleProfileChange}
                  className="bg-white text-black p-2 rounded-lg"
                />
              </div>
              <div className="flex justify-between border-b py-2">
                <label className="font-medium">Phone:</label>
                <input
                  type="tel"
                  name="phone"
                  value={editedProfile.phone}
                  onChange={handleProfileChange}
                  className="bg-white text-black p-2 rounded-lg"
                />
              </div>
              <div className="flex justify-between border-b py-2">
                <label className="font-medium">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={editedProfile.address}
                  onChange={handleProfileChange}
                  className="bg-white text-black p-2 rounded-lg"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    handleSaveProfile(), setOpenEditArea(!openEditArea);
                  }}
                  className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Additional Info (only displayed when not in edit mode) */}
        {!openEditArea && (
          <div className="mt-8">
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Username:</span>
              <span>{profileData?.username}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Email:</span>
              <span>{profileData?.email}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Phone:</span>
              <span>{profileData?.phone}</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-medium">Address:</span>
              <span>{profileData?.address}</span>
            </div>
          </div>
        )}
      </div>
      <div className="bg-primary shadow-lg rounded-lg w-full max-w-5xl text-white pt-14">
        <div className="text-center">
          <h3 className="font-bold text-3xl">Posts</h3>
        </div>
        <div>
          <div className="w-full p-8 flex flex-col items-center sm:items-baseline sm:flex-row gap-3">
            {userPosts.map((item) => (
              <ProfilePosts
                item={item}
                openPostArea={openPostArea}
                setUserPosts={setUserPosts}
              />
            ))}
          </div>
        </div>
      </div>
      {getEditableScreenPost && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="w-[80%] max-w-3xl h-auto bg-black text-white rounded-lg shadow-lg relative">
            <button
              className="absolute top-4 right-4 text-white text-5xl"
              onClick={() => setGetEditableScreenPost(!getEditableScreenPost)}
            >
              <IoMdClose />
            </button>
            <div className="w-full h-72 overflow-hidden rounded-t-lg">
              <img
                className="w-full h-full object-cover"
                src={`http://localhost:5000/` + popuPost[0].image}
                alt=""
              />
            </div>
            <div className="p-6">
              {editPost ? (
                <div>
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="w-full h-24 p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              ) : (
                <p className="text-white">{popuPost[0].content}</p>
              )}
              <div className="flex justify-end items-center">
                <MdEdit
                  onClick={() => setEditPost(!editPost)}
                  className="text-2xl text-blue-600 cursor-pointer mr-4"
                />
                <button
                  onClick={() => changePostData(popuPost[0]._id)}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Success
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
