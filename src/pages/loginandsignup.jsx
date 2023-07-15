import React from 'react'
import Login from "../components/login"

function loginandsignup({socket}) {
  return (
    <div>
      <Login socket={socket}/>
    </div>
  )
}

export default loginandsignup
