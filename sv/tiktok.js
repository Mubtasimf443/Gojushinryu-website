/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/
import {createRequire} from 'module'
import { TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET } from './_lib/utils/env.js';
import { log } from 'console';
const require=createRequire(import.meta.url)
const express = require('express');
const axios = require('axios');
const fs = require('fs');

require('dotenv').config();



const app = express();
const PORT = 3000;

const redirect_uri='https://localhost:3000/callback/'


// Step 1: Redirect user to TikTok for authentication
app.get('/auth', (req, res) => {
    const authUrl = `https://www.tiktok.com/v2/auth/authorize?`+`client_key=${TIKTOK_CLIENT_KEY}&`
    +`response_type=code&`+`scope=user.info.basic,video.upload&`+`redirect_uri=${redirect_uri}`;
    res.redirect(authUrl);
});


let auth2Data={
    client_key:TIKTOK_CLIENT_KEY,
    client_secret:TIKTOK_CLIENT_SECRET,
    grant_type:'refresh_token',
    refresh_token:'REFRESH_TOKEN'
}



// Step 2: Handle TikTok's callback and exchange code for an access token
app.get('/callback', async (req, res) => {
  const code = req.query.code;
  console.log(req.query);
  
  try {
    let response = await axios.post('https://open-api.tiktok.com/oauth/access_token/', {
      client_key: TIKTOK_CLIENT_KEY,
      client_secret: TIKTOK_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
    });

    const { access_token } = response.data.data;
    console.log({access_token});
    
    res.send(`Access Token: ${access_token}`);
    // Store the access token securely and use it to make API requests
  } catch (error) {
    res.status(500).send('Error fetching access token');
  }
});

app.get('/hello', (req,res)=> {
    log(req.query)
    res.send('hello')
})

app.listen(PORT, () => {
  console.log(`Alhamdulillah, Server running on http://localhost:${PORT}`);
});




// Function to upload a video
async function uploadVideo(accessToken, videoFilePath) {
  try {
    const videoBuffer = fs.readFileSync(videoFilePath);
    
    const response = await axios.post(
      'https://open-api.tiktok.com/video/upload/', 
      {
        video: videoBuffer
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    console.log('Video uploaded:', response.data);
  } catch (error) {
    console.error('Error uploading video:', error.response.data);
  }
}
