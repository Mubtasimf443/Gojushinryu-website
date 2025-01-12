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
        type :Number,
        require :true
    },

    student_name :String,
    student_email :String,
    student_phone :String,
    student_city :String ,
    student_country :String ,
    student_district :String ,
    student_postcode :Number ,
    Date: { type: Date, default: Date.now },
   
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



    apply_date:{
        type :Number ,
        default :Date.now
    },

    paymentYears:[String],
    paidMonths : [String],
    notPaidMonths:[String],
    paymentThisMonth :{
        isPaid:Boolean,
        paidDate :Date,
    }
});

export const CourseEnrollments=model('CourseEnrollments',courseEnrollmentSchema)

 