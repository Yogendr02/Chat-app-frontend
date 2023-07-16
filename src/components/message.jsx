import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSelector,useDispatch } from "react-redux";
import classname from "classnames"
import {changingtouser} from "../store/index"

function message({ socket }) {
  const [message, setmessage] = useState("")
  const [friendid, setfriendid] = useState(null)
  const [messagelist, setmessagelist] = useState([])
  const [sendingid, setsendingid] = useState(null)
  const dispatch = useDispatch()
  const nowchange = useSelector((state) => {
    return state.currentuserdetail.changetouser
  })
  const handlechange = (event) => {
    setmessage(event.target.value)
  }

  const user = localStorage.getItem("gooduser")
  const touser = useSelector((state) => {
    return state.currentuserdetail.touser
  })
  const postfunc = (data) => {
    return axios.post("https://chat-app-backend-mpd0.onrender.com/postmessage", data)
  }
  const getfunc = (data) => {
    return axios.post("https://chat-app-backend-mpd0.onrender.com/getmessage", data).then(res => res.data)
  }
  const getidfunc = (data) => {
    return axios.post("https://chat-app-backend-mpd0.onrender.com/getid", data).then(res => res.data)
  }
  const deletefunc = (data)=>{
    return axios.post("https://chat-app-backend-mpd0.onrender.com/deletemessage", data)
  }
  const getid = useMutation({
    mutationFn: getidfunc,
    retry:1000,
    onSuccess: (data) => {
      if (data[0] === undefined) {
        setmessagelist([])
      } else {
        setfriendid(data[0].id)
      }
    }
  })
  const getmessage = useMutation({
    mutationFn: getfunc,
    onSuccess: (data) => {
      let gp = data.map((item,index) => { return { message: item.message, writter: item.writter } })
      console.log(data[0],"check order")
      setmessagelist(gp)
      if(data[0]===undefined){
        setmessagelist([])
      }
    },retry:1000,
    onError: () => {
      setmessagelist([])
    }
  })
  const deletemessage = useMutation({
    mutationFn:deletefunc,
    onSuccess:()=>{
       getmessage.mutateAsync({id:friendid})
    }
  })

  useEffect(() => { if (user > touser) { getid.mutateAsync({ p1: user, p2: touser }) } else { getid.mutateAsync({ p1: touser, p2: user }) } }, [nowchange])
  useEffect(() => { getmessage.mutateAsync({ id: friendid }) }, [friendid])
  const postmessage = useMutation({
    mutationFn: postfunc,
    retry:1000,
    onSuccess:()=>{
      socket.emit("notificationhandling",{sender:user,receiver:touser})
    }
  })
  const handleclick = async() => {
    console.log({sender:user,receiver:touser},"notificationhandling")
    const dating = new Date()
    const messagedata = { writter: user, time: dating.getTime(), date: `${dating.getFullYear()} : ${dating.getMonth()} : ${dating.getDate()}`, message: message, id: friendid }
    postmessage.mutateAsync(messagedata)
    setmessagelist([...messagelist, { message: message, writter: user }])
    socket.emit("send-message", { id: sendingid, message: message })
    setmessage("")
  }
  const handledoubleclick = (item)=>{
    deletemessage.mutateAsync(item)
  }

  socket.on("receiveid", datap => {
    setsendingid(datap)
  })
  socket.on("receive", data => {
    setmessagelist([...messagelist, data])
  })

  return (<div className="grid grid-cols-1 p-2 w-full">
    <nav className="bg-black rounded-full brightness-200 m-2 pb-2 -mt-1">
    <h1
      class="font-extrabold text-transparent self-center text-center text-2xl bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600"
    >
      {touser}
    </h1>
    </nav>
    
    <div className="w-auto grid bg-white overflow-auto h-[83vh]">
      {messagelist.map(item => { return <div className="grid grid-cols-2" onDoubleClick={()=>{handledoubleclick(item)}}>{item.writter === user && <div className="col-start-1 w-[35vw]"></div>}<div className={classname("w-[35vw] cursor-pointer justify-self-auto h-fit bg-blue-800 text-white ml-4 rounded-full px-4 py-1 mb-1 col-span-1 break-all", { "col-start-2": item.writter === user, "col-start-1": item.writter !== user })}><div className="space-x-4">{item.message}</div></div>{item.writter === user && <div className="col-start-2 w-[35vw]"></div>}</div> })}
    </div>
    <div className="w-[73vw] fixed flex space-x-2 m-auto border-2 border-black rounded-full bottom-2 ">
      <input className="basis-11/12 bg-blue-100 m-auto rounded-full text-black py-2 pl-2" value={message} onChange={handlechange} placeholder="Put message here" />
      <div className="basis-1/12 bg-blue-400 text-black text-center pt-2 rounded-full cursor-pointer" onClick={handleclick}>Send</div>
    </div>
  </div>
  );
}

export default message;
