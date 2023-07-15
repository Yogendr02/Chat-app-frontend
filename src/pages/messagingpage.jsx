import React, { useState } from 'react'
import Message from "../components/message"
import Userlist from "../components/userslist"
import Interaction from "../components/interaction"
function messagingpage({ socket }) {
  const [inter,setinter] = useState(true)
  const handleclick = ()=>{
    setinter(false)
  }
  return (
    <div className='grid grid-cols-4 w-full h-full'>
      <div className='col-span-1 shadow-2xl h-full' onClick={handleclick}>
        <Userlist socket={socket}/>
      </div>
      <div className='col-span-3 h-[100vh]'>
        {inter && <Interaction/>}
        {!inter && <Message socket={socket} />}
      </div>

    </div>
  )
}

export default messagingpage
