import React from "react";

const ChatUser = ({item,showUserId,getSpecificUser}) => {
  return (
    <>
      <div onClick={()=>{
        showUserId(item._id)
        getSpecificUser(item._id)
    }
        } key={item._id} className="w-full flex items-center text-white font-bold cursor-pointer hover:bg-gray-600 ease-in-out duration-150 hover:rounded-xl  gap-5">
        <img
          className=" w-8 h-8 sm:w-12 sm:h-12 rounded-full"
          src={item.profilePicture !==null ? `http://localhost:5000/${item.profilePicture}` : "https://i.pinimg.com/236x/34/6e/1d/346e1df0044fd77dfb6f65cc086b2d5e.jpg"}
          alt=""
        />
        <h3 className="hidden sm:block">{item.username}</h3>
      </div>
    </>
  );
};

export default ChatUser;
