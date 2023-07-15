import {userreducer,addcurrentuser,addtouser,changingtouser} from "./user"

import { configureStore } from "@reduxjs/toolkit";
const store = configureStore({
    reducer:{
        currentuserdetail: userreducer,
    },
});

export {addcurrentuser,store,addtouser,changingtouser}