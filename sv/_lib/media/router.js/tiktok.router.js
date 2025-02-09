/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah
By Allah's Marcy I will gain success , Insha Allah
*/

import { Router } from "express";
import Tiktok from "lib-tiktok-api";
import { TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, TIKTOK_REDIRECT_URI } from "../../utils/env.js";
import catchError, { namedErrorCatching } from "../../utils/catchError.js";
import { getSettings, settingsAsArray } from "../../model_base_function/Settings.js";
import { log } from "string-player";
import { Settings } from "../../models/settings.js";
import SocialMediaMail from "../../mail/social.media.email.js";

const router =Router();


let tiktok=new Tiktok({
    key:TIKTOK_CLIENT_KEY,
    scope:['user.info.basic','video.upload','video.publish'],
    secret:TIKTOK_CLIENT_SECRET,
    redirect_uri :TIKTOK_REDIRECT_URI
});

router.get('/auth',async function (req,res){
    return res.redirect(tiktok.getAuthUrl());
});


router.get('/callback', async function (req, res) {
    try {
        if (!req.query.code) namedErrorCatching('perametar_missing', 'code is not define')
        let { access_token, refresh_token } = await tiktok.getAccessToken(req.query.code);

        let set = await getSettings();
        set.tiktok_access_token_status = true;
        set.tiktok_access_token = access_token;
        set.tiktok_refresh_token = refresh_token;
        await set.save()

        return res.redirect('/control-panal');
    } catch (error) {
        console.error(error);
        catchError(res, error)
    }
});

getSettings
router.get('/log-out' ,async function(req,res) {
    try {
        let set=await getSettings();
        set.tiktok_access_token_status=false;
        set.tiktok_access_token=null;
        set.tiktok_refresh_token=null;
        await set.save();
        res.sendStatus(204);
        return;
    } catch (error) {
        console.error(error);
        catchError(res,error)
    }
})



router.post('/tiktok',async function(req,res) {
    try {
        if (!req.body.video_url) namedErrorCatching('perameter_missing', 'video_url is missing');
        if (typeof req.body.video_url!=='string') namedErrorCatching('perameter_missing', 'video_url is not a string');
        if ( req.body.video_url.length > 300 || req.body.video_url.length < 15 ) namedErrorCatching('perameter_missing', 'video_url is to small or too large');
        
        let [status,access_token]=await settingsAsArray(['tiktok_access_token_status', 'tiktok_access_token']);
        if (!status || !access_token) await disconnectTiktok();
        let user=new tiktok.Account(access_token);
        let response=await user.initVideoOnInbox(req.body.video_url);
        
        log(response);
        return res.status(201).json(response);
    } catch (error) {
        console.error(error);
        catchError(res,error)  
    }
});


router.post('/images', async function (req,res) {
    try {
        let {images,caption}=req.body;
        if (!Array.isArray(images) || images?.length === 0) namedErrorCatching('perameter error', 'images is not a Array');
        if (typeof caption!=='string' || caption?.length <5 || caption?.length > 1000) namedErrorCatching('perameter error', 'caption is not a string,or too big or too small');
        let [status,access_token]=await settingsAsArray(['tiktok_access_token_status', 'tiktok_access_token']);
        if (!status || !access_token) await disconnectTiktok();
        let user=new tiktok.Account(access_token);
        let post_id=await user.uploadImages({
            images,
            caption
        })
        return res.status(201).json({post_id});
    } catch (error) {
        console.error(error);
        return catchError(res,error);
    }
}) ;
async function disconnectTiktok() {
    SocialMediaMail.notConnected.titkok();
    await Settings.findOneAndUpdate({}, { tiktok_access_token_status: false, tiktok_access_token: null, tiktok_refresh_token: null });
    throw new Error('Authentication error');
}


export default router;