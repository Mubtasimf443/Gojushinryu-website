/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

import mongoose from 'mongoose';
const Adminschema = mongoose.Schema({
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
  }
})
const Admin = mongoose.model('Admin', Adminschema);
export { Admin }