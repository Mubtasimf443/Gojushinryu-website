/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/



import mongoose from "mongoose";


let schema = new mongoose.Schema({
    image:{
        type :String,
        default:'http://localhost:4000/img/avatar.png'      
    },
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
    },
    id :{
        type :Number,
        unique:true,
        default:Date.now
    },
    password :{
        type:String,
        required:true,
    },
    username :{
        type:String,
        required:true,
    },
    organization :{
        type:String,
        required:true,
    },
    
    bio: {
        type:String,
        default :'I am happy to become invited as a grand master in Goju Shin Ryu International'
    }
})





export const GM = mongoose.model('Grand_Master',schema);