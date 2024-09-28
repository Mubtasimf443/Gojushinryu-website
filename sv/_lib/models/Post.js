/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/


import mongoose from 'mongoose';


const schema = mongoose.Schema({
  title : {
    type : String,  
    required :true
  },
  description :{
    type: String,
    required: true
  },
  thumb:{
    type: String,
    required: true
  },
  images :[{image : {
    type: String,
    required: true
  }}],
  
  date : {
    type: String,
    required: true,
  },
  
  
})

export const Posts = mongoose.model('Posts', schema);






