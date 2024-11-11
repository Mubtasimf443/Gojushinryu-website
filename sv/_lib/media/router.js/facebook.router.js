/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah
By Allah's Marcy I will gain success , Insha Allah
*/

import { Router } from "express";
import { log } from "string-player";
import { FV_PAGE_ACCESS_TOKEN } from "../../utils/env.js";
import fetch from 'node-fetch'
import { resolve } from 'path';
import fs from 'fs'
let fb_media_router =Router();

fb_media_router.post('/image', facebookImageUpload)
fb_media_router.post('/videp', videoFacebookApi)

async function facebookImageUpload(req,res) {
    let {url}=req.body;
    try {
        let facebookImagesId=[];
        for (let i = 0; i < url.length; i++) {
            const el = url[i];
            let response= await fetch('https://graph.facebook.com/me/photos', {
                method :'POST',
                headers :{
                    "Content-Type":'application/json'
                },
                body :JSON.stringify({
                    published :false ,
                    url :el,
                    access_token:FV_PAGE_ACCESS_TOKEN
                })
            });
            if (response.status === 200) {//throw 'Error , failed uplaod data'
            response=await res.json();
            facebookImagesId.push({fbclid:response.id})
            }                   
        }
        if (facebookImagesId.length===0) throw 'No image was updated'
        let response=await fetch('https://graph.facebook.com/me/feed',{
            method :'POST',
            headers :{
                "Content-Type":'application/json'
            },
            body :JSON.stringify({
                published :false ,
                message,
                images:facebookImagesId,
                access_token:FV_PAGE_ACCESS_TOKEN
            })
        });
        if (response.status === 200) return res.sendStatus(200)
        if (response.status>299) {
            return res.sendStatus(200)
        }
    } catch (error) {
        console.log({ error : 'facebook error //' + error});
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


