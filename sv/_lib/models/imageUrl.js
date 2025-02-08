/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

import mongoose from "mongoose";


let imgUrlSchema=new mongoose.Schema({
    url :String,
    urlpath :String,
    active:Boolean,
    fileName :String,
    id :{
        type :Number ,
        default :Date.now,
        unique:true
    },
 
})


export const ImageUrl = mongoose.model('imageUrl', imgUrlSchema);
  