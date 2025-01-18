/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

import mongoose, { Schema, model } from 'mongoose'


const Student ={
    student_name: String,
    student_email: String,
    student_phone: String,
    student_address:String,
    student_postcode: String,
    student_sex: String,
    student_dob:String,
    student_image :String,
    student_id :String,
}
let courseEnrollmentSchema = new Schema({
    id: {
        type: Number,
        require: true,
        default: Date.now
    },
    course_name: String,
    course_price: Number,
    ...Student,
    course_id: {
        type: Number,
        require: true
    },
    additional_details: {
        hasDisability: String,
        hasViolence: String,
        hasBadMedical: String,
        disabilityDetails:String,
        purpose:String
    },

    Date: { type: Date, default: Date.now },

    paid: {
        type: Boolean,
        require: true,
        default: false
    },

    activated: {
        type: Boolean,
        require: true,
        default: false
    },

    payment_method: String,
    paypal_token: String,
    stripe_session_id: String,



    apply_date: {
        type: Number,
        default: Date.now
    },

    paymentsData: [{
        id: String,
        payment_date: Date,
        paidAmount: String,
        month: String,
        Year: Number,
        date: Number,
        paid: Boolean,
        lastPaymentRequestSendDate : Number,
        paypal_token :String,
        stripe_session_id :String,
        payment_method :String,
    }],

    paymentThisMonth: {
        isPaid: { type: Boolean, default: false },
        paidDate: Date,
    }
});
export const CourseEnrollments = model('CourseEnrollments', courseEnrollmentSchema)
export default CourseEnrollments;
