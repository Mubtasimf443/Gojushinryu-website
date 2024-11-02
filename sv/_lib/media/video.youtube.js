/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/


import {google} from 'googleapis'
import fs from 'fs'
import path from 'path'
import {fileURLToPath} from 'url'
import { 
    YOUTUBE_API_REDIRECT_URL,
    YOUTUBE_CLIENT_ID,
    YOUTUBE_CLIENT_SECRET 
} from '../utils/env.js';



const __filename = fileURLToPath(import.meta.url);
let dirName = path.dirname(__filename);




const oauth2Client = new google.auth.OAuth2(
    YOUTUBE_CLIENT_ID,
    YOUTUBE_CLIENT_SECRET,
    YOUTUBE_API_REDIRECT_URL
);


const youtube=google.youtube({
    version :'v3',
    auth:oauth2Client
});


const scopes = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube',
];



export async function uploadVideoOnYoutubeFunc({
    title,
    description,
    privacyStatus,
    videoPath,
    tags
})
{
    try {
        let res= await youtube.videos.insert({
            part :'snippet,status',
            requestBody :{
                snippet :{
                    title: title,
                    description: description,
                    tags: tags
                },
                status :{
                    privacyStatus :privacyStatus
                }
            },
            media :{
                body :fs.createReadStream(videoPath)
            }
        });
        return true
    } catch (error) {
        console.log(error);
        return false
    }
}
