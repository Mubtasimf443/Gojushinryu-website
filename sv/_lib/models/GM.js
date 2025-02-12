/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/



import mongoose from "mongoose";
import { BASE_URL } from "../utils/env.js";


let schema = new mongoose.Schema({
    image:{
        type :String,
        default:'/img/avatar.png' ,
        trim:true     
    },
    first_name:{
        trim:true,
        type :String,
        required :false
    },
    last_name:{
        type :String,
        trim:true,
        required :false
    },
    name:{
        type :String,
        required :false,
        trim:true
    },
    email:{
        type :String,
        required:true,
        unique:true,
        lowercase :true,
        trim:true
    },
    phone:{
        type :Number,
    },
    id :{
        type :Number,
        unique:true,
        default:Date.now
    },
    password :{
        type:String,
        required:true, 
        trim:true
    },
    username :{
        type:String,
        required:true,
        lowercase :true,
        trim:true
    },
    organization :{
        type:String,
        required:true,
        trim:true
    },
    
    bio: {
        trim:true,
        type:String,
        default :'I am happy to become invited as a grand master in SCHOOL OF TRADITIONAL MARTIAL ARTS INTERNATIONAL'
    }
})





export const GM = mongoose.model('Grand_Master',schema);