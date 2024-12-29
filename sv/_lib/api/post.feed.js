/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { log } from "string-player";
import catchError, { namedErrorCatching } from "../utils/catchError.js";
import { APP_AUTH_TOKEN, BASE_URL } from "../utils/env.js";
import request from "../utils/fetch.js";


export default async function postFeed(req,res) {
    try {
        let message=req.body.message;
        if (!message) namedErrorCatching('perameter_error', 'message is not undefined');
        if (typeof message !=='string') namedErrorCatching('perameter_error', 'message is not string');
        if (message.length> 1300 || message.length < 5) namedErrorCatching('perameter_error', 'message is too short or too big');

        let uploaded={
            facebook:false,
            linkedin :false,
            twitter :false
        }

        uploaded.facebook=await uploadToFacebook(message);
        uploaded.linkedin=await uploadToLinkedin(message);
        uploaded.twitter=await uploadToTwitter(message);
        log(uploaded);
        return res.status(201).json({
            success :true
        })
    } catch (error) {
        catchError(res,error)
    }
}


async function uploadToFacebook(message) {
    try {
        let response = await request.post(BASE_URL + '/api/media-api/facebook/upload/feed',
            {
                message
            },
            {
                headers: {
                    'authorization': APP_AUTH_TOKEN
                },
                giveDetails :true
            }
        );
        if (response.status===201) {
            return true;
        }
        throw response.json
    } catch (error) {
        console.error(error);
        return false;
    }
}


async function uploadToLinkedin(message) {
    try {
        let response=await request.post(
            BASE_URL +'/api/media-api/linkedin/upload/feed',
            {
                message
            },
            {
                headers :{
                    'authorization': APP_AUTH_TOKEN
                },
                giveDetails:true
            }
        );
        if (response.status===201) {
            return true
        }
        else return response.json
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function uploadToTwitter(message) {
    try {

        return true
    } catch (error) {
        return false;
    }
}