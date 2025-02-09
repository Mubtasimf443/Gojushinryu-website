/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah
By Allah's Marcy I will gain success , Insha Allah
*/

import { Router } from "express";
import {createRequire} from 'module'
import { existsSync, fstat, readFileSync } from "fs";
import { getSettings, setSettingsAsArray, settingsAsArray } from "../../model_base_function/Settings.js";
import catchError, { namedErrorCatching } from "../../utils/catchError.js";
import Client from "../Linkedin.js";
import path, { dirname } from "path";
const require=createRequire(import.meta.url);
import { fileURLToPath } from "url";
import { log } from "string-player";
import { LINKEDIN_KEY,LINKEDIN_SECRET , LINKEDIN_REDIRECT_URI, APP_AUTH_TOKEN } from "../../utils/env.js";
import { Settings } from "../../models/settings.js";
import SocialMediaMail from "../../mail/social.media.email.js";


const __dirname=dirname(fileURLToPath(import.meta.url));
const router=Router();

let Linkedin=new Client({
    key:LINKEDIN_KEY,
    secret:LINKEDIN_SECRET,
    redirect_uri:LINKEDIN_REDIRECT_URI ,
    scopes:[
        `profile`,
        `email`,
        `w_member_social`,
        'openid',
        'r_organization_social',
        'rw_organization_admin',
        'w_member_social',
        "w_organization_social",
        'r_basicprofile',
        'r_organization_admin',
    ]
})


router.get('/auth', function(req, res) {
    res.redirect(Linkedin.getAuthUrl())
});

router.get('/auth-callback',async function(req, res) {
    try {
        if (!req.query.code) throw 'perameter code is not define'
        let {access_token,refresh_token}=await Linkedin.getAccessToken(req.query.code);
        let db__keys=["linkedin_access_token","linkedin_refresh_token"],db__values=[access_token,refresh_token];
        let pages =await Linkedin.getPageIds(access_token);
        if (Array.isArray(pages) && pages?.length >=1) {
            db__keys=[...db__keys ,"linkedin_organization" ,"linkedin_access_token_status"];
            db__values=[...db__values ,pages[0] ,true];
            let saved =await setSettingsAsArray({keys :db__keys , values :db__values}).then(e => true).catch(e => false)
            return (
                saved  ? res.redirect('/control-panal') : res.status(400).send(`<h1>Sorry Failed to parse your data</h1>`)
            )
        } 
        if (!Array.isArray(pages)) throw 'can not get page access token'
    } catch (error) {
        console.error(error);
        catchError(res,error);
    }
} )
 
router.get('/log-out' ,async function(req,res) {
    try {
        let set=await getSettings();
        set.linkedin_access_token_status=false;
        set.linkedin_access_token=null;
        set.linkedin_refresh_token=null;
        await set.save();
        res.sendStatus(204);
        return;
    } catch (error) {
        console.error(error);
        catchError(res,error)
    }
})

router.use(function (req, res, next) {
    if (req.headers['authorization'] !== APP_AUTH_TOKEN) {
        log("Auth error , You are not recognized.......");
        return res.status(401).json({ error: 'You are not recognized', type: "auth_error" })
    } else next();
})


router.post('/uplaod/images', async function uploadImages(req, res) {
    try {
        let
            images = ( Array.isArray( req.body.images )  ? req.body.images : []),
            title = (typeof req.body.title === 'string' ? req.body.title : '');
        
        if (images.length === 0) namedErrorCatching('perameter-error', 'images is a emty array');

        let [accessToken, accessTokenStatus, organization] = await settingsAsArray(["linkedin_access_token", "linkedin_access_token_status", "linkedin_organization"]);
        if (!accessTokenStatus || !accessToken || !organization) {
            SocialMediaMail.notConnected.LinkedIn();
            await Settings.findOneAndUpdate({}, { linkedin_access_token: null, linkedin_access_token_status: false, linkedin_refresh_token: null });
            return res.sendStatus(401);
        }
        
        for (let i = 0; i < images.length; i++) {
            let name=images.shift();
            if (typeof name ==='string' && name) {
                let condition=existsSync(path.resolve(__dirname, '../../../temp/images/'+name));
                if (condition) images.push(name);
                if (!condition) log(`file name :${name} does not exist`);
            }
        }

        if (images.length === 0) namedErrorCatching('perameter-error', 'images is a emty array');
        if (!title) namedErrorCatching('perameter-error', 'title is emty');

        let mediaData = await Linkedin.page.initAndUploadMultipleImages({
            accessToken,
            organization,
            images,
            title
        });

        await Linkedin.page.postWithMedia(accessToken, organization, mediaData, title);

        return res.sendStatus(201);

    } catch (error) {
        catchError(res, error)
    }
});


router.post('/upload/video', async function (req, res) {
    try {
        let
            title = (typeof req.body.title === 'string' ? req.body.title : ''),
            video = (typeof req.body.video === 'string' ? req.body.video : ''),
            [accessToken, accessTokenStatus, organization] = await settingsAsArray(["linkedin_access_token", "linkedin_access_token_status", "linkedin_organization"]);
        if (!accessTokenStatus || !accessToken || !organization)  {
            SocialMediaMail.notConnected.LinkedIn();
            await Settings.findOneAndUpdate({}, { linkedin_access_token: null, linkedin_access_token_status: false, linkedin_refresh_token: null });
            return res.sendStatus(401);
        }
        if (!title) namedErrorCatching('perameter-error', 'title is emty');
        if (!video) namedErrorCatching('perameter-error', 'video is emty');
        video = path.resolve(__dirname, `../../../temp/video/${video}`);
        if (!existsSync(video)) namedErrorCatching('perameter-error', "video does not exist");
        let { asset, uploadUrl } = await Linkedin.page.initVideo({
            accessToken,
            organization_urn: organization
        });
        await Linkedin.page.uploadVideo(uploadUrl, readFileSync(video), accessToken);
        let id = await Linkedin.page.finishVideoUpload(asset, accessToken, organization, title);
        // log({linkedin_video_id:id});
        return res.sendStatus(201);
    } catch (error) {
        catchError(res, error);
    }
});


router.post('/upload/feed',async function (req,res) {
    try {
        let {accessToken,organization}=await getLinkedinData(),message=req.body.message;
        if (typeof message !== 'string') namedErrorCatching('perameter-error', 'message is not a string');
        if (message.length>1300) namedErrorCatching('perameter-error', 'message is too large');
        if (message.length < 5) namedErrorCatching('perameter-error', 'message is too small');
        let post_id=await Linkedin.page.uploadTEXT({
            accessToken,
            organization,
            text :message,
        });
        return res.status(201).json({post_id});
    } catch (error) {
        console.error(error);
        catchError(res,error);
    }
});

async function getLinkedinData() {
    let [accessToken, accessTokenStatus, organization] = await settingsAsArray(["linkedin_access_token", "linkedin_access_token_status", "linkedin_organization"]);
    if (!accessTokenStatus || !accessToken || !organization) {
        SocialMediaMail.notConnected.LinkedIn();
        await Settings.findOneAndUpdate({}, { linkedin_access_token: null, linkedin_access_token_status: false, linkedin_refresh_token: null });
        namedErrorCatching('auth_error', 'linkedin is not authenticated');
    }
    return ({ organization,accessToken});
}





export default router
