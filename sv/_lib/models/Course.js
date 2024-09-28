/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/



import mongoose from 'mongoose';


const schema = mongoose.Schema({
  title: {
    required :true,
    type:String
    
  }  , 
  description :{
    required:true,
    type : String
  },
  price :{
    required: true,
    type: String
  },
  annual : Boolean,
  Date :[Number],
  
});