/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { Router } from "express";
import eventEmiter from 'node:events'
import { createRequire } from "node:module";
import { YOUTUBE_CLIENT_ID as client_id ,YOUTUBE_CLIENT_SECRET as client_secret , YOUTUBE_API_REDIRECT_URL as redirect_uri } from '../../../_lib/utils/env.js';
import { log } from "string-player";
import {CronJob} from 'cron';
import path from 'path'
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { checkOrCreateTempDir } from "../../utils/dir.js";
const require    =  createRequire(import.meta.url) ;
const fs         =  require('fs');
const readline   =  require("node:readline");
const { google } =  require('googleapis');


//variables 
let ytEvents        =  new eventEmiter();
let YouTubeRouter   =  Router();
let oAuth2Client    =  new google.auth.OAuth2(client_id, client_secret, redirect_uri);
let yt_token        =  ''
let __dirName         =  path.dirname(fileURLToPath(import.meta.url))


//route's
YouTubeRouter.get('/generate-youtube-access-token-code', getYoutubeAccessToken);
YouTubeRouter.get('/generate-youtube-access-token-and-save',saveAccessToken );
YouTubeRouter.post('upload-video-on-youtube',uploadVideoOnYoutube )
export default YouTubeRouter

//jobs
let job=new CronJob('1 1 * * * *',Jobs )
job.start();

//functions

async function getYoutubeAccessToken(req,res) {
    try {
        const authUrl =await oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        return res.status(200).json({url : authUrl})
    } catch (error) {
        log({error})
        return res.status(500).json({error :'server error, can not perform the task'})
    }
}


async function saveAccessToken(req,res) {
    try {
        let {code}=req.query;
        if (!code) return res.sendStatus(400);
        await oAuth2Client.getToken(code, (err, token) => {
            if (err) {
              console.error('Error retrieving access token', err);
              return res.sendStatus(400);
            }
            yt_token=token;
            oAuth2Client.setCredentials(token);
            console.log('Access token saved. Ready to upload!');
          });
    } catch (error) {
        log({error})
        return res.sendStatus(500)
    }
}

async function Jobs() {
    try {
        if (yt_token !== '') {
            oAuth2Client.refreshAccessToken((err, token) => {
                if (err) return
                yt_token=token;
            });
        }
    } catch (error) {
        log({error})
    }
}

async function uploadVideoOnYoutube(req,res) {
    try {
        let {name,title, description,tags} =req.body;

        
        if (!name) return res.sendStatus(400);
        if (!title) return res.sendStatus(400);
        if (!description) return res.sendStatus(400);
        if (!tags || tags instanceof Array === false) return res.sendStatus(400);
        name =Number(name).toString();
        if (name === 'NaN') return res.sendStatus(400);


        checkOrCreateTempDir()
        let videoPath =resolve(__dirName, '../../../temp/images/'+name+'.mp4');
        if (!fs.existsSync(videoPath)) return res.sendStatus(400);


        async function uploadVideo(res) {
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
            await youtube.videos.insert(options,(err, response) => {
                if (err) {
                    console.error('Error uploading the video:', err);
                    return res.sendStatus(200);
                }
                console.log('Video uploaded successfully! Video ID:', response.data.id);
            });
        }
        await uploadVideo(res)
          
    } catch (error) {
        return res.sendStatus(400)
    }
}