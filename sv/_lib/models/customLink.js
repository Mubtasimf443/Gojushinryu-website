/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/
import mongoose from 'mongoose';

const schema = mongoose.Schema({
    custom_link_type :{
        type :String,
        required :true
    } ,
    membership :{
        membership_name :String,
        membership_type :String ,
        membership_price :Number
    },
    course: {
        name :String , 
        price:Number,
        cousre_id :Number
    },
    linkActivated :{
        type :Boolean,
        default :true
    },
    activatedDate:{
        type :Number,
        default :Date.now,
    },
    expiringDate: Number ,
    unique_id :{
        type :Number,
        required :true,
        default :Date.now,
    }
    
});

const CustomLink=mongoose.model('CustomLink', schema);

export default CustomLink