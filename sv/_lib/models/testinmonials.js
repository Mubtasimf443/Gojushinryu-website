/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/


import mongoose from 'mongoose'


let Schema =new mongoose.Schema({
    appreciator :{
        type :String,
        required :true 
    },
    appreciator_image_url :{
        type :String,
        required :true 
    },
    appreciation:{
        type :String,
        required :true 
    },
    date :{
        type :Number,
        required :true ,
        default :Date.now
    },
    appreciation_position :{
        type :String,
        required :true 
    }
});


const Testimonials=mongoose.model("Testimonials", Schema);

export default Testimonials