/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import mongoose from "mongoose";


let schema = new mongoose.Schema({
    first_name:{
        type :String,
        required :true
    },
    last_name:{
        type :String,
        required :true
    },
    email:{
        type :String,
        required :true,
        unique:true
    },
    phone:{
        type :Number,
        required :true ,
        unique :true

    },
    password :{
        type:String,
        required:true,
    },
    isRegistered :Boolean,
    isMember :{
        required:true,
        type:Boolean
    } ,
    address:{
        required:true,
        type:String
    }
})





const User= mongoose.model('User',schema);
export {User}