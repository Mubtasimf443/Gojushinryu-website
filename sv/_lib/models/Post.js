/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/



import mongoose from 'mongoose';


const pSchema =new mongoose.Schema({
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
  images :[ {
      type: String,
  }],
  date : {
    type: Date,
    default: Date.now,
  },
  dateAsNumber:{
    type: Number,
    default: Date.now,
  }
})



export const Posts=  mongoose.model('Posts', pSchema)
