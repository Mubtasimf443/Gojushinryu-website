/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/



import mongoose from "mongoose";


let schema = new mongoose.Schema({
    
    Membership_Type:{
        type :String,
        required:true,
    },
    email:{
        type :String,
        required:true,
    }
 
    
})





const Membership = mongoose.model('Membership',schema);
export {Membership}
