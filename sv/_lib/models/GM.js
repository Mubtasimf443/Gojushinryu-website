/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/



import mongoose from "mongoose";


let schema = new mongoose.Schema({
    image:String,
    first_name:{
        type :String,
        required :false
    },
    last_name:{
        type :String,
        required :false
    },
    name:{
        type :String,
        required :false
    },
    email:{
        type :String,
        required:true,
        unique:true
    },
    phone:{
        type :Number,
        unique :false
    },
    id :{
        type :String,
        unique:true
    },
    password :{
        type:String,
        required:true,
    },
    bio: String
})





export const GM = mongoose.model('Grand_Master',schema);