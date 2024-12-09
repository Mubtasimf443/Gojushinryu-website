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
    course_name :String,
    course_price :Number,
    course_id :{
        type :Number,//mongoose.SchemaTypes.ObjectId,
        //ref :"Course",
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
    stripe_session_id:String,
    date_as_Number:{
        type :Number ,
        default :Date.now
    }
})

export const CourseEnrollments=model('CourseEnrollments',courseEnrollmentSchema)

 