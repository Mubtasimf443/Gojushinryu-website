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
    country:{
        required:true,
        type:String
    },
    pin:Number,
    isRegistered :Boolean,
    isMember :{
        required:true,
        type:Boolean,
        default:false
    } ,
  
    resetingThePassword :{
        type:Boolean,
        required:true,
        default:false
    },
    resetingThePasswordOTP:{
        type:Number,
        required:true,
        default:0
    }
})


schema.methods.checkDataForSignUp=function () {
    
}


const User= mongoose.model('User',schema);
export {User}