import React from 'react'
import Post from './Post'
import SharePost from './SharePost'



const Header = () => {
  return (
    <div className='w-full sm:w-[60%] h-screen-[10%]  flex flex-col items-center pt-20 gap-16'>
        <SharePost />
        <Post />
    </div>
  )
}

export default Header