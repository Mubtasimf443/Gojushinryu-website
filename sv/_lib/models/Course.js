/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/
import mongoose, { Mongoose } from 'mongoose'


const CourseSchema = mongoose.Schema({
  id :Number,
  name: {
    unique :true,
    type:String ,
    required:true
  }  , 
  description :{
    type : String
  },
  price :{
    unique :true,
    type:String ,
    required:true
  },
  Date :[Number],
  dateArray:[Number],
  courseType:String,
  price:String,
  seniorTime:String,
  joniourTime:String ,
  thumb :{
    type:String ,
    required:true
  }, 
  images :[String ]
});




let Course =mongoose.model('Course',CourseSchema)
export default Course;