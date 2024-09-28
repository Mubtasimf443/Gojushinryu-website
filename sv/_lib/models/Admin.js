/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/ 

import mongoose from 'mongoose';

const schema = mongoose.Schema({
  first_name:String, 
  last_name:String,
  email :{
    type : String,  
    required :true, 
    unique:true
  },
  password:{
    type: String,
    required: true
  },
  
 
})

const Admin = mongoose.model('User', schema);

export {Admin}