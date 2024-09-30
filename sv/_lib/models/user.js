/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import mongoose from "mongoose";


let schema = new mongoose.Schema({
    thumb :String,    
    name:{
        type :String,
        required :true
    },
    bio:{
        type:String,
        required :true,
        default:'I dream to become black belt in karate and Master Martial Arts'
    },
    age :Number,
    gender :{type :
        String,
        required:true,
        default :'male'
    },
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
    district:String,
    city:String,
    street:String,
    postCode :Number,
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
    },
    orders:[{
        id :{ type:mongoose.SchemaTypes.ObjectId, ref:'orders'}
    }],
    // fevorites :[{
    //     id :{ type:mongoose.SchemaTypes.ObjectId, ref:'orders'}
    // }]
})


schema.methods.checkDataForSignUp=function () {
    
}


const User= mongoose.model('User',schema);
export {User}