/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

import mongoose from 'mongoose';

const Adminschema =new mongoose.Schema({
  name : String,
  fname:String,
  lname : String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  Otp: Number ,
  Secret_Key :{
    type:String,
    required:true
  },
  student_massages:[{

    student_id:{
      type:mongoose.SchemaTypes.ObjectId,
      ref:'User'
    },
    student_ID:Number,
    student_image:String,
    seen_massage:[{
      name :String,
      massage:String,
      date_as_number:{
        type:Number,
        default:Date.now
      }
    }],
    not_seen_massage:[{
      name :String,
      massage:String,
      date_as_number:{
        type:Number,
        default:Date.now
      }
    }],
  }]
})
const Admin = mongoose.model('Admin', Adminschema);
export { Admin }