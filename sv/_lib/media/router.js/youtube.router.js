/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { Router } from "express";
import eventEmiter from 'node:events'
import { createRequire } from "node:module";
import { YOUTUBE_CLIENT_ID as client_id, YOUTUBE_CLIENT_SECRET as client_secret, YOUTUBE_API_REDIRECT_URL as redirect_uri } from '../../../_lib/utils/env.js';
import { log } from "string-player";
import { CronJob } from 'cron';
import path from 'path'
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { checkOrCreateTempDir } from "../../utils/dir.js";
import { Settings } from "../../models/settings.js"
import catchError from "../../utils/catchError.js";
import { getSettings } from "../../model_base_function/Settings.js";
const require = createRequire(import.meta.url);
const fs = require('fs');
const readline = require("node:readline");
const { google } = require('googleapis');


//variables 
let ytEvents = new eventEmiter();
let YouTubeRouter = Router();
let yt_token = ''
let __dirName = path.dirname(fileURLToPath(import.meta.url))



//route's
YouTubeRouter.get('/refresh', async function (req, res)  { 
    try {        
        let status = await refresh_token();
        return (status ? res.sendStatus(200) :res.sendStatus(400)); 
    } catch (error) {
        console.error(error);
        catchError(res,error)
    }
})

YouTubeRouter.get('/log-out', async function (req, res) {
    try {
        let set=await getSettings();
        set.youtube_access_token_status=false ;
        set.youtube_refresh_token=null;
        set.youtube_token=null;
        await set.save();
        res.sendStatus(204);
        return;
    } catch (error) {
        console.error(error);
        catchError(res,error)
    }
});
YouTubeRouter.get('/generate-youtube-access-token-code', getYoutubeAccessToken);
YouTubeRouter.get('/callback', saveAccessToken);
YouTubeRouter.post('/upload-video', uploadVideoOnYoutube)




export default YouTubeRouter

//functions
async function getYoutubeAccessToken(req, res) {
    let oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
    try {
        const authUrl = await oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/youtube.upload'],
            prompt: "consent"
        });
        return res.status(200).json({ url: authUrl })
    } catch (error) {
        log({ error })
        return res.status(500).json({ error: 'server error, can not perform the task' })
    }
}


async function saveAccessToken(req, res) {
    let oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
    try {
        let { code } = req.query;
        console.log(req.query);
        if (!code) return res.sendStatus(400);

        await oAuth2Client.getToken(code, async (err, token) => {
            try {
                if (err) {
                    console.error('Error retrieving access token', err);
                    return res.sendStatus(400);
                }
                yt_token = token;
                log({token});
                let settings = await Settings.findOne({}).catch(e => {
                    log(e);
                    return null
                });
                if (!settings) {
                    log('//account is hacked')
                    return res.sendStatus(500);
                }
                settings.youtube_token = token.access_token;
                settings.youtube_refresh_token = token.refresh_token;
                settings.youtube_access_token_status = true;
                await settings.save().then(() => { })
                console.log('Access token saved. Ready to upload!');
            } catch (error) {
                console.error({ error });
            }
        });
        res.redirect('/control-panal');
        return;
    } catch (error) {
        log({ error })
        return res.sendStatus(500)
    }
}



async function uploadVideoOnYoutube(req, res) {
   
    try {
        let { name, title, description, tags } = req.body;
        console.log({ name });
        if (!name) return res.sendStatus(400);
        if (!title) return res.sendStatus(400);
        if (!description) return res.sendStatus(400);
        if (!tags || tags instanceof Array === false) return res.sendStatus(400);
        if (!fs.existsSync(name)) return res.sendStatus(400);


        log('youtube video upload started')
        let oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
        let settings = await Settings.findOne({});
        if (!settings) throw 'error , settings is null'
        let { youtube_refresh_token, youtube_token, youtube_access_token_status } = settings;
        if (!youtube_access_token_status) return res.sendStatus(400);

        oAuth2Client.setCredentials({
            access_token:youtube_token,
            refresh_token: youtube_refresh_token
        });

        
        let videoPath = path.resolve(name)
        async function uploadVideo(res) {
            try {
                const youtube = google.youtube({ version: 'v3', auth: oAuth2Client });
                let options = {
                    part: 'snippet,status',
                    requestBody: {
                        snippet: {
                            title, description, tags
                        },
                        status: {
                            privacyStatus: 'public'
                        },
                    },
                    media: {
                        body: fs.createReadStream(videoPath), // Path to your video file
                    },
                };
                let respones = await youtube.videos.insert(options);
                console.log('Video uploaded successfully! Video');
                return 200
            } catch (error) {
                console.log({ error });
                return 400
            }
        }
        let status = await uploadVideo(res);
        return res.sendStatus(status === 200 ? 201 :400)

    } catch (error) {
        log({ error })
        return res.sendStatus(400)
    }
}


async function refresh_token() {
    try {
        let {refresh_token,access_token}=await Settings.findOne({}).then(
            function(settings) {
                if (!settings) throw 'settings is not available...';
                else if ( settings.youtube_refresh_token && settings.youtube_token) {
                    return ({
                        refresh_token:settings.youtube_refresh_token,
                        access_token: settings.youtube_token
                    });
                } else {
                    throw 'there is no youtube access token or rft'
                }
            }
        );
        let oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
        oAuth2Client.setCredentials({
            access_token,
            refresh_token
        });

        let data=await oAuth2Client.refreshAccessToken();
        if (data.credentials?.access_token&& data.credentials?.refresh_token ) {
            let s=await getSettings();
            s.youtube_access_token_status=true;
            s.youtube_refresh_token=data.credentials?.refresh_token ;
            s.youtube_token=data.credentials?.access_token;
            await s.save();
            return true;
        }
        else return false
    } catch (error) {
        console.error( error);
        return false;
    }
}