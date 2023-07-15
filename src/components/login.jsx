import React, { useState } from 'react'
import {TextField,Button} from "@mui/material"
import {useMutation} from "@tanstack/react-query"
import { useNavigate } from 'react-router-dom'
import { useDispatch } from "react-redux";
import { addcurrentuser } from "../store/index";

import axios from "axios"
function login({socket}) {
  const [user,setuser] = useState("")
  const [login,setlogin] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const handlechange = (event)=>{
    setuser(event.target.value)
  }
  const posting = (users)=>{
    return axios.post(`https://chat-app-backend-0ahq.onrender.com/${users.url}`,{name:users.user1}).then(res=>res.data)
  }
  const checkuser = useMutation({
    mutationKey:["user"],
    mutationFn:posting,
    onSuccess:()=>{navigate("/messaging")}
  })
  const handlesignup = ()=>{
    checkuser.mutateAsync({url:"ok",user1:user})
    socket.emit("checked",user)
    dispatch(addcurrentuser(user))
  }
  const handlelogin = ()=>{
    checkuser.mutateAsync({url:"finduser",user1:user})
    localStorage.setItem("gooduser",user)
    socket.emit("checked",user)
    dispatch(addcurrentuser(user))
  }

  return (
    <div className="bg-[url('https://wallpaperaccess.com/full/392777.jpg')] h-[100vh] w-full ">
      <h1 className='m-auto text-center w-[50vw] font-extrabold text-3xl text-orange-700 italic font-sans border-b-2'>Welcome! to new Gen Z social media app</h1>
      <div className='flex '>
      <div className='grid space-y-2 w-96 m-auto self-center basis-1/2'>
        <h1 className='text-orange-700 m-auto font-bold text-3xl'>{login? "Login" : "SignUp"}</h1>
      <TextField className='bg-white rounded-xl w-96 justify-self-center' id="outlined-basic" label="Username" variant="outlined" onChange={handlechange}/>
    {login?
      <Button variant="contained" onClick={handlelogin} className='w-48 justify-self-center'>Login</Button> : 
      <Button variant="contained" onClick={handlesignup} className='w-48 justify-self-center'>SignUp</Button> 
    }
    {login? <div className='text-blue-900 font-bold m-auto'>Don't have a account? <button onClick={()=>{setlogin(!login)}} className='text-2xl underline cursor-pointer italic text-red-600'>Signup</button></div> : <div className='text-blue-900 font-bold m-auto'>Already have a account <button onClick={()=>{setlogin(!login)}} className='text-2xl underline cursor-pointer italic text-purple-950'>Login</button></div>}
      </div>
      <div className='basis-1/2'>
<img src="https://cameronmcefee.com/img/work/the-octocat/original.jpg" alt="" className='h-96 w-96 rounded-full mt-24 ml-52'/>
      </div>
      </div>
      
    
    </div>
  )
}

export default login
