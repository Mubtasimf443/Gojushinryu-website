/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah
By Allah's Marcy I will gain success , Insha Allah
*/

import { query, Router } from "express";
import { LINKEDIN_KEY,LINKEDIN_SECRET,LINKEDIN_REDIRECT_URI, LINKEDIN_PERSON_URN } from "../../utils/env.js";
import {createRequire} from 'module'
import { log } from "string-player";
import { Settings } from "../../models/settings.js";
import { existsSync, readFileSync } from "fs";
const require=createRequire(import.meta.url);
const axios = require('axios');

const linkedinRouter=Router();

linkedinRouter.get('/auth',LinkedInAuthRedirect);
linkedinRouter.get('/auth-callback', linkedinAuthCallback);
linkedinRouter.post('/uplaod/images', );


export default linkedinRouter

function LinkedInAuthRedirect(req,res) {
    try {
        const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_KEY}&redirect_uri=${LINKEDIN_REDIRECT_URI}}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
        res.status(200).json({url : authUrl});
    } catch (error) {
        log({error});
        return res.sendStatus(500);
    }
}
async function linkedinAuthCallback(req,res) {
    try {
        let {code}=req.query;
        if (!code) return res.sendStatus(400);
        const response = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
            params: {
              grant_type: 'authorization_code',
              code: code,
              redirect_uri: LINKEDIN_REDIRECT_URI,
              client_id: LINKEDIN_KEY,
              client_secret: LINKEDIN_SECRET,
            },
        });
        if (response.data) {
            const {access_token} = response.data;
            if (!access_token) {
                log({error:response.data})
                log('// error :access_token is not defined')
                return res.sendStatus(400)
            }
            let settings=await Settings.findOne({});
            settings.linkedin_access_token=access_token;
            settings.linkedin_access_token_status=true;
            await settings.save();
            res.sendStatus(200);
            return;
        }
    } catch (error) {
        if (typeof error === 'object') log(error.message);
        log({error});
        return res.sendStatus(500);
    }
}
async function uplaodImages(req,res) {
    try {
        let {images,text}=req.body;
        if (!images) throw 'error , images is not define'
        if (!text) throw 'error , text is not define'
        if (typeof text !== 'string') throw 'error ,text is not a string'
        if (images instanceof Array !== false) throw 'error ,images is not a Array'
        if (images.length ===0 ||images.length>5) throw 'error ,images Array is or big then 1 ,5'
        
        let settings=await settings.findOne({});
        if (!settings) throw 'settings is null'
        let {linkedin_access_token_status,linkedin_access_token}=settings;
        if (!linkedin_access_token_status) return res.sendStatus(400);
        const registerResponse = await axios.post(
            'https://api.linkedin.com/v2/assets?action=registerUpload',
            {
                registerUploadRequest: {
                    owner: 'urn:li:person:'+LINKEDIN_PERSON_URN, // Replace with your LinkedIn person URN
                    recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
                    serviceRelationships: [
                        {
                            identifier: 'urn:li:userGeneratedContent',
                            relationshipType: 'OWNER',
                        },
                    ],
                    supportedUploadMechanism: ['SYNCHRONOUS_UPLOAD'],
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${linkedin_access_token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        let uploadUrl = registerResponse.data.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
        let asset = registerResponse.data.value.asset;
        images=images
        for (let i = 0; i < images.length; i++) {
            let P = images[i];
            if (existsSync(P) && i<4) {
                let streem=readFileSync(P);
                await axios.put(uploadUrl, imageBuffer, {
                    headers: {
                        'Content-Type':'image/jpeg'
                    },
                });
            }
        }

        console.log('Image uploaded successfully');

        const postResponse = await axios.post(
            'https://api.linkedin.com/v2/ugcPosts',
            {
                author: 'urn:li:person:'+LINKEDIN_PERSON_URN, // Replace with your LinkedIn person URN
                lifecycleState: 'PUBLISHED',
                specificContent: {
                    'com.linkedin.ugc.ShareContent': {
                        shareCommentary: {
                            text: text,
                        },
                        shareMediaCategory: 'IMAGE',
                        media: [
                            {
                                status: 'READY',
                                description: {
                                    text: text,
                                },
                                media: asset,
                                title: {
                                    text: text,
                                },
                            },
                        ],
                    },
                },
                visibility: {
                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${linkedin_access_token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        res.sendStatus(200);
        return;
    } catch (error) {
       log({error});
       return res.sendStatus(400)
    }
}