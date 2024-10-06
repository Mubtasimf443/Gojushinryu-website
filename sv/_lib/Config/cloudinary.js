/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
Insha Allah,  By his marcy I will Gain Success 
*/
import { v2 as cloudinary } from 'cloudinary';
import {CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET_KEY } from '../utils/env.js';
import { log } from '../utils/smallUtils.js';
const Cloudinary  = cloudinary.config({ 
     cloud_name: CLOUDINARY_CLOUD_NAME,
     api_key:  CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECRET_KEY
});


export async function UploadImageToCloudinary(url,type ) {
    let image =undefined;
    let error=undefined;
    try {
        log(url)
        image = await cloudinary.uploader.upload(url,{
            public_id: type ? type :Date.now(),
            resource_type:'image',
        })
    } catch (err) {
        console.log(err);
        
        error =err;
    }
    if (image) return {image} ;
    if (error) return {error};
    if (!image && !error ) return {error :'cloudinary error'}
};