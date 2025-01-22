/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
Insha Allah,  By his marcy I will Gain Success 
*/
import { v2 as cloudinary } from 'cloudinary';
import {CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET_KEY } from '../utils/env.js';
import { log } from '../utils/smallUtils.js';
import { ImageUrl } from '../models/imageUrl.js';

 cloudinary.config({ 
     cloud_name: CLOUDINARY_CLOUD_NAME,
     api_key:  CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECRET_KEY
});
export const Cloudinary  =cloudinary;

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


 
export async function UploadImageToCloudinaryFromImageUrl(url) {
    let image =undefined;
    let error=undefined;
    try {
        let path=await ImageUrl.findOne({url})
        .then(e => {
            if (!e) throw 'No Image in '+url
            return e.urlpath
        })
        image = await cloudinary.uploader.upload(path,{
            public_id:Date.now(),
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

export async function urlToCloudinaryUrl(url) {
    try {
        let img =await ImageUrl.findOne({url});
        if (!img?.urlpath ){
            throw 'Failed to find url in the database'
        } 
        let response = await cloudinary.uploader.upload(img.urlpath,{
            public_id:Date.now(),
            resource_type:'image',
        });
        if (!response?.url) throw 'failed to upload images on cloudinary';
        return response.url;
    } catch (error) {
        console.error(error);
        return null;
    }
}