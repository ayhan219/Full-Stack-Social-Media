import React from "react";
import { GoDotFill } from "react-icons/go";

const Friend = ({ item,showUserId }) => {

  

  return (
    <>
      <div onClick={()=>showUserId(item._id)} key={item._id} className="w-full h-16  flex gap-2 justify-evenly items-center cursor-pointer ">
        <div className="w-[65%] h-14 font-extrabold text-white flex items-center gap-5 rounded-full">
          <div className="relative">
            <img
              className="w-10 h-10 object-cover rounded-full"
              src={
                item.profilePicture !== null
                  ? `http://localhost:5000/${item.profilePicture}`
                  : "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg"
              }
              alt=""
            />
          
          </div>

          <div className="">
            <h3>{item.username}</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default Friend;
