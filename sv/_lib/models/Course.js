/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/
import mongoose from 'mongoose';


const CourseSchema = mongoose.Schema({
  thumb :{
    type:String ,
    required:true
  }, 
  images :[{
    type:String ,
    required:true
  }],
  id :{
    type:Number,
    default:Date.now
  },
  url :{
    type : String,
    required:true
  },
  title: {
    unique :true,
    type:String ,
    required:true
  }  , 
  description :{
    type : String,
    required:true
  },
  price :{
    type:String ,
    required:true
  },
  dates :[Number],
  courseDuration:{
    type:String ,
    required:true
  },
  juniorEndTime:{
    type:String ,
    required:true
  },
  juniorStartTime :{
    type:String ,
    required:true
  },
  seniorStartTime:{
    type:String ,
    required:true
  },
  seniorEndTime:{
    type:String ,
    required:true
  }
});




let Course =mongoose.model('Course',CourseSchema)
export default Course;