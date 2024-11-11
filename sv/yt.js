/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/


import { Router } from "express";
import eventEmiter from 'node:events'
import { createRequire } from "node:module";
import { YOUTUBE_CLIENT_ID as client_id ,YOUTUBE_CLIENT_SECRET as client_secret , YOUTUBE_API_REDIRECT_URL as redirect_uri } from './_lib/utils/env.js';
import { log } from "string-player";
import {CronJob} from 'cron';
import path from 'path'
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { checkOrCreateTempDir } from "./_lib/utils/dir.js";
import express from "express";
const require    =  createRequire(import.meta.url) ;
const fs         =  require('fs');
const readline   =  require("node:readline");
const { google } =  require('googleapis');


//variables 
let ytEvents        =  new eventEmiter();
let YouTubeRouter   =  Router();
let oAuth2Client    =  new google.auth.OAuth2(client_id, client_secret, 'http://localhost:3000/callback');
let yt_token        =  ''
let __dirName         =  path.dirname(fileURLToPath(import.meta.url));


const app=express();
app.get('/auth',async (req,res) => {

    try {
        const authUrl =await oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/youtube.upload'],
            prompt:"consent",
        });
        res.redirect(authUrl);
    } catch (error) {
        console.log({error});
        res.sendStatus(400)
    }  
})
app.get('/callback',async (req,res) => {
    try {
        console.log(req.query);
        let {code}=req.query;
        if (!code) return res.sendStatus(400);
        let token=await oAuth2Client.getToken(code,function(err,token) {
            if (err) {
                log({err});
                return res.send('error');
            }
            if (token) {
                console.log({token});
            }
            res.send('Access token saved. Ready to upload!')
        });
    } catch (error) {
        console.error({error});
        res.send('failed to get access token')
    }
})

app.listen(3000, e => log('alhamdulillah'));