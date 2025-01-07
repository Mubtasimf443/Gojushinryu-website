/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import mongoose, { Mongoose } from "mongoose";


let schema = new mongoose.Schema({
    id :Number,
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
    date_of_birth:String,
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
    joining_date:String,
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
    memberShipArray :[{
        _id:{
            ref:'Membership',
            type:mongoose.SchemaTypes.ObjectId
        },
        id:Number,
        membership :String,
        Organization :String,
        name:String,
    }],
    enrolled_course:[{
       id : {
        type :Number// type :mongoose.SchemaTypes.ObjectId,
        // ref :"Course",
       } ,
       paid :{
        type :Boolean,
       },
       courseEnrollMentID :{
        type :mongoose.SchemaTypes.ObjectId,
        ref :'CourseEnrollments',
       }
    }],
    //For reseting the password
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
    banned :{
        type :Boolean,
        default :false,
        required :true,
    },
    notification:[{
        id :{
            type :Number,
            default:Date.now
        },
        title :String,
        massage:String,
        viewed:{
            type :Boolean,
            default:false
        }
    }],
    not_seen_massage:[{
        name:{
            type:String,
            default:'Sensei Varun Jettly'
        },
        massage:String,
        data_as_number :{
            type:Number,
            default:Date.now
        }
    }],
    seen_massage:[{
        name:{
            type:String,
            default:'Sensei Varun Jettly'
        },
        massage:String,
        data_as_number :{
            type:Number,
            default:Date.now
        }
    }]
})


schema.methods.checkDataForSignUp=function () {
    
}


const User= mongoose.model('User',schema);
export {User}