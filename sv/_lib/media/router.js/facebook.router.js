/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah
By Allah's Marcy I will gain success , Insha Allah
*/

import { Router } from "express";
import { log, makeUrlWithParams } from "string-player";
import { FV_PAGE_ACCESS_TOKEN, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, FACEBOOK_GRAPH_API, FACEBOOK_GRAPH_VERSION, FB_PAGE_ID, FACEBOOK_VIDEO_UPLOAD_TIMEOUT, BASE_URL, APP_AUTH_TOKEN } from "../../utils/env.js";
import fetch from 'node-fetch';
import { resolve, dirname } from 'path';
// import FormData from "form-data";
import { getSettings, settingsAsArray, settingsAsString } from "../../model_base_function/Settings.js";
let router = Router();
import { Settings } from '../../models/settings.js';
import { fileURLToPath } from "url";
import Facebook from "../Facebook.js";
import dotenv from 'dotenv'
import catchError, { namedErrorCatching } from "../../utils/catchError.js";
dotenv.config();
import request from '../../utils/fetch.js'
import SocialMediaMail from "../../mail/social.media.email.js";

const fb = new Facebook({
    client_id: FACEBOOK_APP_ID,
    client_secret: FACEBOOK_APP_SECRET,
    redirect_uri: BASE_URL + '/api/media-api/facebook/callback',
});

let __dirname = dirname(fileURLToPath(import.meta.url));


router.get('/auth', async (req, res) => {
    try {
        return res.redirect(fb.getAuthUrl());
    } catch (error) {
        catchError(res, error);
    }
});


router.get('/callback', async (req, res) => {
    try {
        let { code } = req.query;
        if (!code) return res.status(400).send("Authorization code missing");
        let access_token = await fb.getAccessToken(code);
        access_token = await fb.exchangeAccessToken(access_token);
        log('token exchange.... ' + access_token);
        let user_id = await fb.getUserID(access_token);

        let page = await fb.getPages(user_id, access_token);

        let P = new fb.Page({
            pageid: page.id,
            page_accessToken: page.access_token
        });

        let Instagram_id = await P.getLinkedInstagramAccounts();

        let settings = await getSettings();
        settings.fb_access_token_status = true;
        settings.instagram_access_token_status = true;
        settings.instagram_user_id = Instagram_id;
        settings.fb_access_token_enroll_date = Date.now();
        settings.fb_access_token = access_token;
        settings.fb_page_access_token = page.access_token;
        settings.fb_page_id = page.id;
        settings.fb_user_id = user_id;
        log({
            access_token,
            user_id,
            page_id: page.id,
            page_access_token: page.access_token,
            Instagram_id
        })
        await settings.save();
        return res.redirect('/control-panal');
    } catch (error) {
        console.error(error);
        catchError(res, error);
    }
});


router.delete('/log-out', async function (req, res) {
    try {
        let set = await Settings.findOne({})

        //status
        set.fb_access_token_status = false;
        set.instagram_access_token_status = false;

        //ids
        set.fb_user_id = null;
        set.fb_page_id = null;
        set.instagram_user_id = null;

        //tokens
        set.fb_access_token = null;
        set.fb_page_access_token = null;
        set.instagram_token = null;

        await set.save();

        res.sendStatus(204);

    } catch (error) {
        console.error(error);
        catchError(res, error)
    }
});


router.use(
    function (req, res, next) {
        if (req.headers['authorization'] !== APP_AUTH_TOKEN) {
            log("Auth error , You are not recognized.......");
            return res.status(401).json({ error: 'You are not recognized', type: "auth_error" })
        } else next();
    }
)

router.post('/upload/images', async function (req, res) {
    try {
        let pageArray = await settingsAsArray(["fb_access_token_status", "fb_page_id", "fb_page_access_token"]);
        if (pageArray[0] === false) await disconnectFB();
        if (!pageArray[1]) await disconnectFB();
        if (!pageArray[2]) await disconnectFB();


        let P = new fb.Page({
            pageid: pageArray[1],
            page_accessToken: pageArray[2]
        });

        let { url, caption } = req.body;

        if (!url || typeof caption !== 'string') namedErrorCatching('missing_parameter', 'url or caption missing');
        if (!Array.isArray(url)) namedErrorCatching('invalid_parameter', 'url must be an array');
        if (url.length < 1) namedErrorCatching('invalid_parameter', 'url array must have at least one element');
        if (url.length > 300) namedErrorCatching('invalid_parameter', 'url array must have at most 300 elements');
        if (caption.length > 1000) namedErrorCatching('invalid_parameter', 'caption must be at most 1000 characters');

        let facebookImagesId = [];

        for (let i = 0; (i < url.length && i <= 9); i++) {
            let media_fbid = await P.uploadPhoto(url[i]).then(id => id.media_fbid).catch(error => namedErrorCatching('upload photo error', error));
            log({ media_fbid });
            facebookImagesId.push({ media_fbid });
        }

        let post_id = await P.postWithImages(facebookImagesId, caption);

        return res.status(201).json({ post_id });
    } catch (error) {
        console.error(error);
        return catchError(res, error);
    }
});



router.post('/upload/video', async function (req, res) {
    try {


        let { url, caption } = req.body;
        log(req.body);


        if (typeof url !== 'string') namedErrorCatching('perameter error', 'url is not a string');
        if (typeof caption !== 'string') namedErrorCatching('perameter error', 'caption is not a string');
        if (url.length > 300 || url.length < 15) namedErrorCatching('perameter error', 'url is very large or very small');
        if (caption.length > 1000) caption = caption.substring(0, 1000);
        if (caption.length < 5) namedErrorCatching('perameter error', 'caption is very large or very small');


        let pageArray = await settingsAsArray(["fb_access_token_status", "fb_page_id", "fb_page_access_token"]);
        if (pageArray[0] === false) await disconnectFB();
        if (!pageArray[1]) await disconnectFB();
        if (!pageArray[2]) await disconnectFB();

        let P = new fb.Page({
            pageid: pageArray[1],
            page_accessToken: pageArray[2]
        });

        let id = await P.uploadVideo({
            file_url: url,
            description: caption
        });

        return res.status(201).json({ id });

    } catch (error) {
        console.error(error);
        return catchError(res, error);
    }
}
)


router.post('/upload/feed', async function (req, res) {
    try {
        let pageArray = await settingsAsArray(["fb_access_token_status", "fb_page_id", "fb_page_access_token"]);

        if (pageArray[0] === false) await disconnectFB();
        if (!pageArray[1]) await disconnectFB();
        if (!pageArray[2]) await disconnectFB();

        if (typeof req.body.message !== 'string') namedErrorCatching('missing_parameter', 'message is not a string');
        if (!req.body.message) namedErrorCatching('missing_parameter', 'message is missing');
        if (req.body.message.length > 1000) namedErrorCatching('invalid_parameter', 'message must be at most 1000 characters');
        if (req.body.message.length < 5) namedErrorCatching('invalid_parameter', 'message must be at least 5 characters');

        let response = await request.post(`https://graph.facebook.com/v21.0/${pageArray[1]}/feed`,
            {
                message: req.body.message,
                access_token: pageArray[2],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        if (response.id) return res.status(201).json({ id: response.id });
        if (response.error) throw response.error;
        throw response;

    } catch (error) {
        return catchError(res, error);
    }
})


async function disconnectFB() {
    SocialMediaMail.notConnected.facebook()
    await Settings.findOneAndUpdate({
        fb_access_token_status: false,
        instagram_access_token_status: false,

        fb_page_id: null,
        fb_user_id: null,
        instagram_user_id: null,

        fb_access_token: null,
        instagram_token: null,
        fb_page_access_token: null
    });
    throw new Error('Facebook App Disconnected');

}

export default router
