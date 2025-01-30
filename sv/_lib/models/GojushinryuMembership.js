/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import mongoose, { Schema } from "mongoose";

let schema = new Schema({
    id: {
        type: Number,
        default: Date.now,
        unique:true
    },
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    student_image :String,
    date: {
        type: Date,
        default: Date.now
    },
    fname:{
        type :String,
        trim:true,
    },
    lname: {
        type :String,
        trim:true,
    },
    email: {
        type :String,
        trim:true,
        lowercase:true,
    },
    phone: {
        type :String,
        trim:true,
    },
    date_of_birth: String,
    country: {
        type :String,
        trim:true,
    },
    city: {
        type :String,
        trim:true,
    },
    district: {
        type :String,
        trim:true,
    },
    postcode: {
        type :String,
        trim:true,
    },
    doju_Name: {
        type :String,
        trim:true,
    },
    instructor: {
        type :String,
        trim:true,
    },
    current_grade: String,
    violance_charge: String,
    permanent_disabillity: String,
    previous_membership_expiring_date: String,
    previous_injury: String,
    gender:{
        type :String,
        trim:true,
    },
    signature: {
        type :String,
        trim:true,
    },
    is_previous_member: String,
    experience_level: String,
    has_violance_charge: String,
    has_permanent_injury: String,
    membership_name: String,
    membership_company: String,
    membership_type: String,
    membership_exp_date: Date,
    accepted_roles: { role1: { type: Boolean, default: true }, role2: { type: Boolean, default: true }, },
    activated: {
        type: Boolean,
        default: false
    },
    admin_approved:{
        type: Boolean,
        default: false
    },
    isPaidInitialFees :{
        type: Boolean,
        default: false
    }
});


export const GojushinryuMembership=mongoose.model('GojushinryuMembership',schema);
export default GojushinryuMembership;
