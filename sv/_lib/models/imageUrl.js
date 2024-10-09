/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

import mongoose from "mongoose";


let imgUrlSchema= mongoose.Schema({
    url :String,
    urlpath :String,
    active:Boolean,
})

 const ImageUrl = mongoose.model('imageUrl', imgUrlSchema);
 export  {ImageUrl}