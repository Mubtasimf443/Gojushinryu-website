/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah
By Allah's Marcy I will gain success , Insha Allah
*/

import fetch from "node-fetch"
import { Router } from "express";
import catchError, { namedErrorCatching } from "../../utils/catchError.js";
import Instagram from "../instegram.js";
import { settingsAsArray } from "../../model_base_function/Settings.js";
import { log } from "string-player";

let router=Router();



router.post('/upload/single/image', async function (req,res) {
    try {
        let caption = req.body.caption, image_url = req.body.image_url;
        if (typeof caption!=='string') namedErrorCatching('perametar error','caption is not a string');
        if (typeof image_url!=='string') namedErrorCatching('perametar error','image_url is not a string');
        if (caption.length > 1000 || caption.length < 5) namedErrorCatching('perametar error','caption is too long or too short');
        if (image_url.length > 300 || image_url.length < 14) namedErrorCatching('perametar error','image_url is too long or too short');

        let instagram=await getInstagram();

        let creation_id=await instagram.uploadSingleImage({
            caption,
            image_url
        });
        
        let post_id=await instagram.publishCreation(creation_id);

        return res.json({post_id});
    } catch (error) {
        console.error(error);
        return catchError(res, error);
    }
});



router.post('/upload/images', async function (req,res) {
    try {
        let {images,caption}=await req.body;
        if (!Array.isArray(images)) namedErrorCatching('perameter error', "perameter images is not a array")
        if (images.length <2 ||images.length >10 ) namedErrorCatching('perameter error', "perameter images can not have more or less then 1 or 10 item")
        if (!caption) throw 'missing perametar caption'
        if (typeof caption !=='string') throw ' perametar caption is not a string'
        if ( caption.length >1000) throw ' perametar caption is too large or too short'
        if ( caption.length <5) throw ' perametar caption is too large or too short'

        let instagram= await getInstagram();
        let post_id =await instagram.createCarusel({
            images,
            caption
        });
        return res.json({post_id});
    } catch (error) {
        console.error(error);
        return catchError(res, error);
    }
})

router.post('/upload/video', async function (req,res) {
    try {
        let {video_url,caption}=req.body;
        if (typeof video_url !=='string') throw 'video_url is not a string'
        if (typeof caption !=='string') throw 'video_url is not a string'
        if ( caption.length >1000) throw ' perametar caption is too large or too short'
        if ( caption.length <5) throw ' perametar caption is too large or too short'
        let instagram=await getInstagram();
        let creation_id=await instagram.uploadReel({video_url,caption});
        await instagram.checkFinishUploadOrNot(creation_id, 100);
        let post_id=await instagram.publishCreation(creation_id);
        return res.json({post_id});
    } catch (error) {
        console.error(error);
        return catchError(res, error);
    }
})


async function getInstagram() {
    let [status, id,accessToken]=await settingsAsArray(['instagram_access_token_status','instagram_user_id','fb_access_token']);
    if (!status) namedErrorCatching('auth_error','Instagram access token not found');
    if (!id) namedErrorCatching('auth_error','Instagram user id not found');
    if (!accessToken) namedErrorCatching('auth_error','Instagram access token id token not found');
    return new Instagram({accessToken,id});
}



export default router;