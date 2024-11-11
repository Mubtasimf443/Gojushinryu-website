/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import {  Router } from "express";
import eventEmiter from 'node:events'
import { createRequire } from "node:module";
import { YOUTUBE_CLIENT_ID as client_id ,YOUTUBE_CLIENT_SECRET as client_secret , YOUTUBE_API_REDIRECT_URL as redirect_uri } from '../../../_lib/utils/env.js';
import { log } from "string-player";
import {CronJob} from 'cron';
import path from 'path'
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { checkOrCreateTempDir } from "../../utils/dir.js";
import { Settings } from "../../models/settings.js"
const require    =  createRequire(import.meta.url) ;
const fs         =  require('fs');
const readline   =  require("node:readline");
const { google } =  require('googleapis');


//variables 
let ytEvents        =  new eventEmiter();
let YouTubeRouter   =  Router();
let yt_token        =  ''
let __dirName       =  path.dirname(fileURLToPath(import.meta.url))



//route's
YouTubeRouter.get('/refresh',async (req,res) => {  await Jobs(); res.sendStatus(200); })
YouTubeRouter.get('/generate-youtube-access-token-code', getYoutubeAccessToken);
YouTubeRouter.get('/callback',saveAccessToken );
YouTubeRouter.post('/upload-video',uploadVideoOnYoutube )
export default YouTubeRouter

//jobs
let job=new CronJob('1 1 1 * * *',Jobs )
job.start();

//functions

async function getYoutubeAccessToken(req,res) {
    let oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
    try {
        const authUrl =await oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/youtube.upload'],
            prompt:"consent"
        });
        return res.status(200).json({url : authUrl})
    } catch (error) {
        log({error})
        return res.status(500).json({error :'server error, can not perform the task'})
    }
} 
async function saveAccessToken(req,res) {
    let oAuth2Client    =  new google.auth.OAuth2(client_id, client_secret, redirect_uri);
    try {
        let {code}=req.query;
        console.log(req.query);
        if (!code) return res.sendStatus(400);
        await oAuth2Client.getToken(code,async (err, token) => {
            try {
                if (err) {
                    console.error('Error retrieving access token', err);
                    return res.sendStatus(400);
                  }
                  yt_token=token;
                  let settings=await Settings.findOne({}).catch(e => {
                    log(e);
                    return null
                });
                if (!settings) {
                    log('//account is hacked')
                    return res.sendStatus(500);
                }
                settings.youtube_token=token.access_token;
                settings.youtube_refresh_token=token.refresh_token;
                settings.youtube_access_token_status=true;
                await settings.save().then(()=>{})
                console.log('Access token saved. Ready to upload!');
            } catch (error) {
                console.error({error});       
            }      
          });
        res.redirect('/control-panal');
        return;
    } catch (error) {
        log({error})
        return res.sendStatus(500)
    }
}
async function Jobs() {
    try {
        let oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
        let settings=await Settings.findOne({});
        if (!settings) throw 'error , settings is null'
        let {youtube_refresh_token,youtube_token,youtube_access_token_status}=settings;
        if (!youtube_access_token_status) return res.sendStatus(400)
        oAuth2Client.setCredentials({
            access_token:youtube_token,
            refresh_token:youtube_refresh_token
        });
        log('token refreshing started')
        oAuth2Client.refreshAccessToken(async (err, token) => {
            try {
                if (err) {
                    log('error :'+err)
                    return 
                }
                settings.youtube_access_token_status=true;
                settings.youtube_token=token.access_token;
                settings.youtube_refresh_token=token.refresh_token;
                await settings.save().then(e => log('token saved'));
            } catch (error) {
                log({error})
            }
        });    
    } catch (error) {
        log({error})
    }
}
async function uploadVideoOnYoutube(req,res) {
    log('youtube video upload started')
    let oAuth2Client  =  new google.auth.OAuth2(client_id, client_secret, redirect_uri);
    try {
        let settings=await Settings.findOne({});
        if (!settings) throw 'error , settings is null'
        let {youtube_refresh_token,youtube_token,youtube_access_token_status}=settings;
        if (!youtube_access_token_status) return res.sendStatus(400)
        oAuth2Client.setCredentials({
            access_token:youtube_token,
            refresh_token:youtube_refresh_token
        });
        let {name,title, description,tags} =req.body;
        console.log({name});
        
        if (!name) return res.sendStatus(400);
        if (!title) return res.sendStatus(400);
        if (!description) return res.sendStatus(400);
        if (!tags || tags instanceof Array === false) return res.sendStatus(400) ;
        if (!fs.existsSync(name)) return res.sendStatus(400);
        let videoPath=path.resolve(name)
        async function uploadVideo(res) {
            try {
                const youtube = google.youtube({ version: 'v3', auth: oAuth2Client });
                let options= {
                    part: 'snippet,status',
                    requestBody: {
                        snippet: {
                            title,description,tags
                        },
                        status: { 
                            privacyStatus: 'public' 
                        },
                    },
                    media: {
                        body: fs.createReadStream(videoPath), // Path to your video file
                    },
                };
                let respones=await youtube.videos.insert(options);
                console.log('Video uploaded successfully! Video');
                return 200
            } catch (error) {
                console.log({error});
                return 400
            } 
        }
        let status= await uploadVideo(res);
        return res.sendStatus(status)
          
    } catch (error) {
        log({error})
        return res.sendStatus(400)
    }
}