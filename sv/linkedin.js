/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { log } from "string-player";
import { LINKEDIN_SECRET,LINKEDIN_KEY ,LINKEDIN_REDIRECT_URI} from "./_lib/utils/env.js";
import {createRequire} from 'module'
const require=createRequire(import.meta.url);
const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = 3000;

app.get('/auth', (req, res) => {
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_KEY}&redirect_uri=${LINKEDIN_REDIRECT_URI}}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const authCode = req.query.code;
  log({authCode})
  try {
    const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
      params: {
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: LINKEDIN_REDIRECT_URI,
        client_id: LINKEDIN_KEY,
        client_secret: LINKEDIN_SECRET,
      },
    });
    response.data && log(response.data);
    const accessToken = response.data.access_token;
    res.send(`Access Token: ${accessToken}`);
  } catch (error) {
    res.status(500).send('Error retrieving access token');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
