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
  images :[{
    image : {
      type: String,
      required: true
  }}],
  Date : {
    type: Number,
    default: Date.now,
  },
  eventDate:{
    type :Number,
    required:true
  },
  gm_writer:{
    type: mongoose.SchemaTypes.ObjectId,
    required: false ,
    ref:"Grand_Master"
  },
  admin_writen: {
      type: Boolean,
      required: false,  
      default: false
    },
  author :{
    type :String 
  },
  organizerCountry:String,
  participatingCountry:Number,
  participatingAtletes:Number
})



export const Events=  mongoose.model('Events', schema)