import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext/UserContext"
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const UserPage = () => {
  const [profilePic, setProfilePic] = useState(
    "https://via.placeholder.com/150"
  );
  const { user, sendFollowing,loading,handleUnfollow,userProfileData,setUserProfileData } = useContext(UserContext);
  const { userId } = useParams();

  const getUserProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/getuserprofile",
        {
          params: { userId: userId },
        }
      );
      setUserProfileData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, [userId]);

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center">
      <div className="bg-primary shadow-lg rounded-lg w-full max-w-5xl p-6 text-white">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center">
          {/* Profile Picture */}
          <div className="relative">
            <img
              src={
                userProfileData?.profilePicture
                  ? `http://localhost:5000/${userProfileData.profilePicture}`
                  : profilePic
              }
              alt="Profile"
              className="rounded-full w-32 h-32 md:w-40 md:h-40 object-cover border-4 border-blue-500"
            />
          </div>

          {/* User Info */}
          {userProfileData && (
            <div className="text-center md:text-left mt-6 md:mt-0 md:ml-8 flex flex-col gap-3 text-white items-center">
              <h2 className="text-2xl md:text-3xl font-semibold text-white">
                {userProfileData.username}
              </h2>
              <p className="text-gray-500">{userProfileData.email}</p>
              {user!==null && userProfileData.followers.includes(user.userId) ? (
                loading ? <span className="loading loading-dots loading-lg"></span> : <button onClick={()=>handleUnfollow(userId)} className="btn btn-error">Unfollow</button>
              ) : (
                <button
                  onClick={() => sendFollowing(userId)}
                  className="bg-blue-500  h-10 text-xl  hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {loading  ? <span className="loading loading-dots loading-lg"></span> :"Follow"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Stats (Similar to Instagram) */}
        <div className="flex justify-around md:justify-start mt-8 space-x-12 text-center md:text-left">
          <div>
            <span className="font-semibold text-lg">
              {userProfileData?.posts ? userProfileData.posts.length : 0}
            </span>
            <p>Posts</p>
          </div>
          <div>
            <span className="font-semibold text-lg">
              {userProfileData?.followers
                ? userProfileData.followers.length
                : 0}
            </span>
            <p>Followers</p>
          </div>
          <div>
            <span className="font-semibold text-lg">
              {userProfileData?.followings
                ? userProfileData.followings.length
                : 0}
            </span>
            <p>Following</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8">
          <div className="flex justify-between border-b py-2">
            <span className="font-medium">Username:</span>
            <span>{userProfileData?.username}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-medium">Email:</span>
            <span>{userProfileData?.email}</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-medium">Phone:</span>
            <span>+1 234 567 890</span>
          </div>
          <div className="flex justify-between border-b py-2">
            <span className="font-medium">Address:</span>
            <span>1234 Main St, City, Country</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
