/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

import mongoose from "mongoose";


let imgUrlSchema=new mongoose.Schema({
    url :String,
    urlpath :String,
    active:Boolean,
    id :{
        type :Number ,
        default :Date.now
    }
})


export const ImageUrl = mongoose.model('imageUrl', imgUrlSchema);
  