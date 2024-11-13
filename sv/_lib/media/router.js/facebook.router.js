/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah
By Allah's Marcy I will gain success , Insha Allah
*/

import { Router } from "express";
import { log, makeUrlWithParams } from "string-player";
import { FV_PAGE_ACCESS_TOKEN, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, FACEBOOK_GRAPH_API, FACEBOOK_GRAPH_VERSION, FB_PAGE_ID} from "../../utils/env.js";
import fetch from 'node-fetch'
import { resolve } from 'path';
import fs from 'fs'
import FormData from "form-data";
import { settingsAsString } from "../../model_base_function/Settings.js";
let fb_media_router =Router();
import {Settings} from '../../models/settings.js'

fb_media_router.post('/image', facebookImageUpload)
fb_media_router.post('/video', videoFacebookApi)
fb_media_router.post('/refresh-token',refresh_tokenApi )

async function facebookImageUpload(req,res) {
    let {url, message}=req.body;
    if ((url instanceof Array)===false) return res.sendStatus(400)
    if (typeof message !== 'string') return res.sendStatus(400)
    try {
        let FV_PAGE_ACCESS_TOKEN=await settingsAsString('fb_access_token');
        let tokenDate=await settingsAsString('fb_access_token_enroll_date');
        if (!FV_PAGE_ACCESS_TOKEN || !tokenDate) {
            throw new Error('!FV_PAGE_ACCESS_TOKEN || !tokenDate')
        }
        updateFacebookApiAccessToken(tokenDate)
        let facebookImagesId=[];
        for (let i = 0; i < url.length; i++) {
            const el = url[i];
            let link= makeUrlWithParams(FACEBOOK_GRAPH_API + '/' +FACEBOOK_GRAPH_VERSION+'/'+ FB_PAGE_ID +'/photos', {}, true); 
            log({link})
            let response= await fetch(link, {
                method :'POST',
                headers :{
                    "Content-Type":'application/json'
                },
                body : JSON.stringify({
                    url :el,
                    published :false,
                    access_token:FV_PAGE_ACCESS_TOKEN
                })
            });
            let status=response.status;
            response=await response.json();
            log(response)
            if (  status>199 &&status<= 299 ) {//throw 'Error , failed uplaod data'
                if (response.id) facebookImagesId.push({media_fbid:response.id})
            }      
        }
        if (facebookImagesId.length===0) throw 'No image was updated'
        let response=await fetch(`https://graph.facebook.com/${FACEBOOK_GRAPH_VERSION}/${FB_PAGE_ID}/feed`,{
            method :'POST',
            headers :{
                "Content-Type":'application/json'
            },
            body :JSON.stringify({
                published :true ,
                message,
                attached_media:facebookImagesId,
                access_token:FV_PAGE_ACCESS_TOKEN
            })
        });
        console.log((await response.json()));
        if (response.status <= 299 && response.status >199) {
            return res.sendStatus(200)
        }
        if (response.status>299) {
            return res.sendStatus(200)
        }
    } catch (error) {
        console.log({ error : 'facebook error //' + error});
        res.sendStatus(500)
    }
}


async function videoFacebookApi(req,res) {
    let {title,description,videoPath}=req.body;
    try {
        let form=new FormData();
        form.append('title', title);
        form.append('description', description);
        form.append('fbuploader_video_file_chunk',fs.createReadStream(videoPath));
        form.append('access_token', FV_PAGE_ACCESS_TOKEN);
        let response=await await fetch('"https://graph-video.facebook.com/v21.0/'+FB_PAGE_ID+'/videos',{
            method :"POST",
            headers :{
                'Content-Type':'multipart/form-data'
            },
            body :form,
        });
        response =await response.json();
        if (!response.id) {
            console.log(response);            
            return res.sendStatus(200)
        }
        return res.sendStatus(200)
    } catch (error) {
        return res.sendStatus(500)
    }
}

async function refresh_token(token) {
   
    try {
        let url= makeUrlWithParams('https://graph.facebook.com/v21.0/oauth/access_token', {
            grant_type: 'fb_exchange_token',
            client_id: FACEBOOK_APP_ID,
            client_secret: FACEBOOK_APP_SECRET,
            fb_exchange_token: token
        });
        let response=await fetch(url);
        response=await response.json();
       
        if (response.access_token) {
            await Settings.findOne({})
            .then(async data => {
                if (!data) return
                data.fb_access_token =response.access_token;
                data.instagram_token =response.access_token;
                data.fb_access_token_enroll_date =Date.now();
                await data.save()  
                log('data is saved')
            })   
            
            return true
        }
        if (!response.access_token) {
            log({...response})    
            return false 
        }

    } catch (error) {
        console.log({error});      
        return false
    }
}


async function refresh_tokenApi(req,res) {
    let {token}=req.body;
    if (typeof token !== 'string') {
        return res.sendStatus(400)
    } 
    let status= await refresh_token(token);
    status ? res.sendStatus(200) : res.sendStatus(500) 
}


async function updateFacebookApiAccessToken(date) {
    date = Date.now()-date;
    log({date});
    date=date/1000;
    date=date/60;
    date=date/60;
    date=date/24;
    log({date});
    if (date >= 40) {
        let token=await settingsAsString('fb_access_token');
        await refresh_token(token).catch(error => console.error({error}))
    }
    if (date<40) return console.log('date is less then 40');
}

export default fb_media_router
