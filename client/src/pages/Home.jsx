import React from 'react'
import Sidebar from '../components/Sidebar'
import Header from "../components/Header"
import Friends from '../components/Friends'
import OpenChat from '../components/OpenChat'

const Home = () => {
  return (
    <div>
      <div className='flex bg-[#000000] gap-12 sm:gap-36 md:gap-2 relative'>
        <Sidebar />
        <Header />
        <Friends />
        {/* Chat Box fixed to the bottom-right corner */}
        <div className='fixed z-40 bottom-72 right-80 m-4'>
          <OpenChat />
        </div>
      </div>
    </div>
  )
}

export default Home
