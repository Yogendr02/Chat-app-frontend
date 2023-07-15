import { createSlice } from "@reduxjs/toolkit";
const user = createSlice({
    name:"user",
    initialState:{
        currentuser:"",
        touser:"",
        changetouser:true
    },
    reducers:{
        addcurrentuser(state,action){
            state.currentuser = action.payload
        },
        addtouser(state,action){
            state.touser = action.payload
        },
        changingtouser(state,action){
            state.changetouser = action.payload
        }
    }
})

export const userreducer = user.reducer
export const {addcurrentuser,addtouser,changingtouser} = user.actions