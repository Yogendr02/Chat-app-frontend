import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import PersonPinCircleRoundedIcon from '@mui/icons-material/PersonPinCircleRounded';
import ChatIcon from '@mui/icons-material/Chat';
import axios from "axios";
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { addtouser, changingtouser } from '../store';

export default function AlignItemsList({ socket }) {
    const [onlines, setonlines] = React.useState([])
    const [touser, settouser] = React.useState(null)
    const [notifier, setnotifier] = React.useState([])
    const nowchange = useSelector((state) => {
        return state.currentuserdetail.changetouser
    })
    const dispatch = useDispatch()
    const userfunc = () => {
        return axios.get("https://chat-app-backend-0ahq.onrender.com/getall")
            .then(res => res.data
            )
    };
    const friendidfunc = (data) => {
        return axios.post("https://chat-app-backend-0ahq.onrender.com/postid", data)
    };

    const user = localStorage.getItem("gooduser")
    const users = useQuery({
        queryKey: ["users"],
        queryFn: userfunc
    })
    const friendid = useMutation({
        mutationFn: friendidfunc,
    })

    const colors = ["bg-neutral-600", "bg-slate-600", "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-yellow-500", "bg-lime-500", "bg-green-500", "bg-emerald-500", "bg-teal-500", "bg-cyan-600", "bg-sky-600", "bg-blue-600", "bg-indigo-600", "bg-fuchsia-600", "bg-violet-600", "bg-purple-600", "bg-pink-600", "bg-rose-600"]
    const colorlist = []
    if (users.status === "success") {
        for (let i = 0; i < (users.data).length; i++) {
            colorlist.push(colors[Math.floor(Math.random() * 19)])
        }
    }

    if (users.status === "loading") {
        return <div>loading</div>
    }

    socket.on("getactives", data => {
        setonlines(data)
    })

    socket.on("sendingnotification", data => {
        setnotifier(data)
    })
    const handleclick = (leuser) => {
        socket.emit("getid", leuser)
        socket.emit("removenotification",{sender:leuser,receiver:user})
        dispatch(addtouser(leuser))
        settouser(leuser)
        dispatch(changingtouser(Math.random()))
        if (leuser > user) {
            friendid.mutateAsync({ p1: leuser, p2: user, id: leuser + user })
        } else {
            friendid.mutateAsync({ p1: user, p2: leuser, id: user + leuser })
        }
        console.log(leuser)
    }

    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} className='overflow-auto'>
            {users.data.map((item, index) => {
                if (item.name === user) {
                    return
                }
                return (
                    <div onClick={() => { handleclick(item.name) }}>
                        <ListItem alignItems="flex-start" className='cursor-pointer' >
                            <ListItemAvatar >
                                <div className={`w-12 h-12 rounded-full ${colorlist[index]} text-white font-medium text-xl pt-2 text-center`}>{item.name[0].toUpperCase()} </div>
                            </ListItemAvatar>
                            <ListItemText
                                primary={item.name}
                                className='pt-3'
                                onClick={() => { handleclick(item.name) }}
                            />
                            <ListItemAvatar >
                                {notifier.some(
                                    value => { return (value.sender === item.name && value.receiver === user) }) && <ChatIcon />}
                            </ListItemAvatar>
                            <ListItemAvatar >
                                {(onlines.includes(item.name)) && <PersonPinCircleRoundedIcon />}
                            </ListItemAvatar>
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </div>)
            })}
        </List>
    );
}