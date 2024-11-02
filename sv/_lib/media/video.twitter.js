/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import fs from 'fs'
import { log } from '../smallUtils.js';
import OAuth from 'oauth-1.0a'
import crypto from 'crypto'
import {
    TWITER_USER_ACCESS_TOKEN,
    TWITER_USER_ACCESS_TOKEN_SECRET,
    TWITTER_APP_KEY,
    TWITTER_APP_SECRET 
} from '../env.js';
import fetch from 'node-fetch';



function HMAC_SHA1_Headers(options) {
    if (!options.consumer_key) throw 'consumer_key is undifined';
    if (!options.consumer_secret) throw 'consumer_secret is undifined';
    if (!options.access_token) throw 'access_token is undifined';
    if (!options.access_token_secret) throw 'access_token_secret is undifined';
    if (!options.url) throw 'url is undifined';
    if (!options.method) throw 'method is undifined';
    if (typeof options.data !=='object') throw 'data is not a object';
    
    let { 
        consumer_key,
        consumer_secret,
        access_token ,
        access_token_secret,
        url, 
        method,
        data
    }=options;

    const oauth = OAuth({
        consumer: { 
            key: consumer_key,
            secret: consumer_secret
            },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
            return crypto.createHmac('sha1', key).update(base_string).digest('base64');
        }
    });
    
    const token = {
        key: access_token,
        secret: access_token_secret,
    };

    const headers = oauth.toHeader(oauth.authorize({url,method,data}, token));
    return headers;
}

let keys={
    consumer_key:TWITTER_APP_KEY,
    consumer_secret:TWITTER_APP_SECRET,
    access_token:TWITER_USER_ACCESS_TOKEN,
    access_token_secret :TWITER_USER_ACCESS_TOKEN_SECRET,
}


export default async function UploadVideoTwitter(opt) {
    try {
        let {title,path}=opt;
        let init_id=await initianlizeVideo(fs.statSync(path));
        return init_id
    } catch (error) {
        console.error({error});
        return false 
    }
};


async function initianlizeVideo(size) {
    try {
        let url=`https://upload.twitter.com/1.1/media/upload.json?command=INIT&total_bytes=${size}&media_type=video/mp4`
        let headers=HMAC_SHA1_Headers({
            ...keys,
            url:'https://upload.twitter.com/1.1/media/upload.json'+`command=INIT&total_bytes=${size}&media_type=video/mp4`,
            method:'POST',
            data:{}
        });
        let res=await fetch(url,{
            method :"POST",
            headers :{
                ...headers,
                'Content-Type':"multipart/form-data"
            }
        }) ;
        res=await res.json();
        let {media_id,errors}=res;
        console.log(res);
        if (errors) return errors[0].message
        return media_id
    } catch (error) {
        console.error({error});
        return false
    }
}