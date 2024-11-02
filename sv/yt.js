/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/
import {createRequire} from 'module'
import { YOUTUBE_CLIENT_ID as client_id ,YOUTUBE_CLIENT_SECRET as client_secret , YOUTUBE_API_REDIRECT_URL as redirect_uri } from './_lib/utils/env.js';
import { log } from 'console';
const require=createRequire(import.meta.url) ;
const fs = require('fs');
const readline = require("node:readline");
const { google } = require('googleapis');


// Set the OAuth2 client with your credentials
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);

// Set the required API scope for uploading videos
const SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];






// Function to get a new access token
function getAccessToken() {

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this URL:', authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        console.error('Error retrieving access token', err);
        return;
      }
      oAuth2Client.setCredentials(token);
      console.log('Access token saved. Ready to upload!');
      uploadVideo(); // Call the upload function
    });
  });
}

// Function to upload the video
function uploadVideo() {
  const youtube = google.youtube({ version: 'v3', auth: oAuth2Client });
  youtube.videos.insert(
    {
      part: 'snippet,status',
      requestBody: {
        snippet: {
          title: 'My Simple YouTube Upload',
          description: 'This is an example of a simple video upload.',
          tags: ['example', 'upload', 'simple'],
        },
        status: {
          privacyStatus: 'public', // Set to 'public', 'private', or 'unlisted'
        },
      },
      media: {
        body: fs.createReadStream('video.mp4'), // Path to your video file
      },
    },
    (err, response) => {
      if (err) {
        console.error('Error uploading the video:', err);
        return;
      }
      console.log('Video uploaded successfully! Video ID:', response.data.id);
    }
  );
}

// Start the process
getAccessToken();
