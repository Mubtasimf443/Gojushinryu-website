/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { log } from "string-player";
import {  APP_AUTH_TOKEN, TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, TIKTOK_REDIRECT_URI } from "../utils/env.js"
import fetch from "node-fetch";
import {Settings} from '../models/settings.js'
import formidable from "formidable";
import path from 'path'
import { fileURLToPath } from "url";

const __dirname=path.dirname(fileURLToPath(import.meta.url));

export function redirectionURLFunction() {
    return (
        `https://www.tiktok.com/v2/auth/authorize?`
        +`client_key=${TIKTOK_CLIENT_KEY}`
        +`&scope=user.info.basic,video.upload,video.publish`
        +'&response_type=code'
        +`&redirect_uri=${TIKTOK_REDIRECT_URI}`
        +`&state=${Math.random().toString(36).substring(2)}`
    )
}
export async function getAccessToken(code) {
    try {
        let object={
            code:code,
            client_key:TIKTOK_CLIENT_KEY,
            client_secret:TIKTOK_CLIENT_SECRET,
            grant_type :'authorization_code',
            redirect_uri :TIKTOK_REDIRECT_URI
        };
        let urlencoded= new URLSearchParams(object)
        let response=await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
            method :'POST',
            headers :{
                'Content-Type':'application/x-www-form-urlencoded',
                'Cache-Control':'no-cache'
            },
            body :urlencoded.toString()
        });
        response=await response.json();
        log(response)
        if (response.error) {
            return {
                hasError :true,
                error :response.error
            }
        }
        return {
            hasError:false,
            data:response
        }
    } catch (error) {
        console.error(error);
        return {
            hasError :true,
            error :error
        }
    }
}

let BASE_URL='https://gojushinryu.com'
export async function videoUploadTiktok(req, res) {
    try {
        if (req.headers['authorization'] !== APP_AUTH_TOKEN) return res.sendStatus(401);
        let { video_url, title } = req.body;
        let settings = await Settings.findOne({});
        if (!settings) throw 'server_video_upload_error: settings is null'
        if (!settings.tiktok_access_token_status) throw 'server_video_upload_error: tiktok access token status is false'
        let response = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': ` Bearer ${settings.tiktok_access_token}`
            },
            body: JSON.stringify({
                post_info: {
                    title: title,
                    privacy_level: 'PUBLIC_TO_EVERYONE',
                    video_cover_timestamp_ms: 1000
                },
                source_info: {
                    source: 'PULL_FROM_URL',
                    video_url
                },
                post_mode: "DIRECT_POST",
            })
        });
        response = await response.json();
        log({ response })
        if (response.data) {
            return res.status(200).json({
                hasError: false,
                publish_id: response.data.publish_id
            })
        }
        if (response.error) {
            return res.status(500).json({
                hasError: true,
                error: response.error
            })
        }
    } catch (error) {
        console.error(error);
        return res.sendStatus(500)
    }
}



export async function checkVideoUploadStatus(publish_id, user_access_token) {
    if (!publish_id) throw 'publish_id is undefined '
    if (!user_access_token) {
        let settings = await Settings.findOne({});
        if (!settings) throw 'server_video_upload_error: settings is null'
        if (!settings.tiktok_access_token_status) throw 'server_video_upload_error: tiktok access token status is false'
        user_access_token = settings.tiktok_access_token
    }
    await fetch('https://open.tiktokapis.com/v2/post/publish/status/fetch/', {
        headers: {
            'Authorization': `Bearer ${user_access_token}`,
            'Content-Type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            publish_id: publish_id
        }),
        method: 'POST'
    })
        .then(response => response.json())
        .then(res => log(res))
        .catch(err => console.error(err))
}


export async function tiktokCallback(req, res) {
    try {
        log(req.query);
        if (req.query.code) {
            let response = await getAccessToken(req.query.code);
            if (response.hasError) throw response.error;
            if (response.data) {
                let settings = await Settings.findOne({});
                if (!settings) return res.send('settings is null')
                if (settings) {
                    settings.tiktok_access_token_status = true;
                    settings.tiktok_access_token = response.data.access_token;
                    settings.tiktok_refresh_token = response.data.refresh_token;
                    await settings.save();
                    return res.status(200).send('YES , YAH , FINALY TIKTOK API ACCESS TOKEN IS SAVED')
                }
            }
        }
    } catch (error) {
        console.error(error);
        return res.send('error happened')
    }

}



export async function testVideoUpload(req,res) {
    try {
        let settings = await Settings.findOne({});
        if (!settings) throw 'server_video_upload_error: settings is null'
        if (!settings.tiktok_access_token_status) throw 'server_video_upload_error: tiktok access token status is false'
        let response = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': ` Bearer ${settings.tiktok_access_token}`
            },
            body: JSON.stringify({
                post_info: {
                    title: 'Test video upload',
                    privacy_level: 'PUBLIC_TO_EVERYONE',
                    video_cover_timestamp_ms: 1000
                },
                source_info: {
                    source: 'PULL_FROM_URL',
                    video_url:'https://gojushinryu.com/video-for-download'
                },
                post_mode: "DIRECT_POST",
            })
        });
        response = await response.json();
        log(response);
        if (typeof response !== 'object') return res.json(response)
        
    } catch (error) {
        console.error(error)
    }
}