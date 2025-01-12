/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/


import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    rate: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        default: Date.now
    },
    code: {
        type: String,
        required: true
    },
    uses: {
        type: Number,
        default: 0
    },
    activated: {
        type: Boolean,
        default: true
    },
    usesAmount :{
        type: Number,
        default: 0
    },
    expiringDate :{
        type: Number,
        required :true
    }
});

export const CourseCoupons = mongoose.model('course_coupon', schema);
export default CourseCoupons;