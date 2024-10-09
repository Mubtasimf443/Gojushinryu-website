/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

import mongoose,{Schema,model} from 'mongoose'

let courseEnrollmentSchema =new Schema({
    id:{
        type :Number,
        require :true,  
        default :Date.now
    },
    course_id :{
        type :mongoose.SchemaTypes.ObjectId,
        ref :"Course",
        require :true
    },
    student_id :{
        type :mongoose.SchemaTypes.ObjectId,
        ref :"User",
        require :true
    },
    student_city :String ,
    student_country :String ,
    student_district :String ,
    student_postcode :Number ,
    Date :Date,
    course_price :Number,
    paid :{
        type :Boolean,
        require :true,  
        default :false
    },
    activated :{
        type :Boolean,
        require :true,  
        default :false
    },
    payment_method :String,
    paypal_token:String,
    
})

export const CourseEnrollments=model('CourseEnrollments',courseEnrollmentSchema)

 