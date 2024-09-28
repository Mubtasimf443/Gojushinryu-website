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
  Date : {
    type: String,
    required: true,
  },
  gm_writen:{
    type: Boolean,
    required: true,
    default:false
  }, 
  event_date: {
    type: String,
    required: true,
  },
  gm_writer:{
    type: mongoose.SchemaTypes.ObjectId.GM,
    required: false
  },
  admin_writen: {
      type: Boolean,
      required: true
  //  ,  default: false
    },
  admin_writer: {
      type: mongoose.SchemaTypes.ObjectId.Admin,
      required: false
  },
  
})



const Events= mongoose.model('Events', schema)

export {
  Events
}