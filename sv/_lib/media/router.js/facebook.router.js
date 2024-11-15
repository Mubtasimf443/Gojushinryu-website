/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah
By Allah's Marcy I will gain success , Insha Allah
*/

import { Router } from "express";
import { log, makeUrlWithParams } from "string-player";
import { FV_PAGE_ACCESS_TOKEN, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, FACEBOOK_GRAPH_API, FACEBOOK_GRAPH_VERSION, FB_PAGE_ID, FACEBOOK_VIDEO_UPLOAD_TIMEOUT} from "../../utils/env.js";
import fetch from 'node-fetch'
import { resolve ,dirname} from 'path';
import fs from 'fs'
// import FormData from "form-data";
import { settingsAsString } from "../../model_base_function/Settings.js";
let fb_media_router =Router();
import {Settings} from '../../models/settings.js'
import { fileURLToPath } from "url";
import  request  from "request";
import uploadVideo from "../../../s.js";

fb_media_router.post('/image', facebookImageUpload)
fb_media_router.post('/video', videoFacebookApi)
fb_media_router.post('/refresh-token',refresh_tokenApi )
fb_media_router.post('/chunk',async (req,res)=>{
    try {
        res.sendStatus(200);
        await uploadVideo()
    } catch (error) {
        console.error({error});
    }
} )

/************************----------- Image Upload Api -----------************************/
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

/************************----------- Video Upload Api -----------************************/

async function videoFacebookApi(req,res) {
    let {title,description,filename}=req.body;  
    try {
        if (typeof title        !==  'string' ) throw 'title is null'
        if (typeof description  !==  'string' ) throw 'description is null'
        if (typeof filename     !==  'string' ) throw 'filename is null'

        let access_token = await settingsAsString('fb_access_token');
        let tokenDate    = await settingsAsString('fb_access_token_enroll_date');

        if ( !access_token || !tokenDate) {
            throw new Error('!FV_PAGE_ACCESS_TOKEN || !tokenDate')
        }

        updateFacebookApiAccessToken(tokenDate);


        let videoPath=resolve(dirname(fileURLToPath(import.meta.url)), '../../../public/12345678910.mp4');
        
       
        log('// file upload session started')
        let session=await initInializeVideoUploadSession({
            file_name:filename,
            file_length:fs.statSync(videoPath).size,
            file_type:"video/mp4",
            access_token
        });


        log('// file uploading started')
        let file_handle= await uploadAVideoFile({
            session,
            access_token,
            videoPath,
            filename,    
        });


        log('// video post started')
        await request.post(makeUrlWithParams('https://graph.facebook.com'+'/'+FACEBOOK_GRAPH_VERSION+'/'+FB_PAGE_ID+'/videos',{}),
            {
            headers :{
                "Content-Type": "multipart/form-data",
                "accept": "*/*"
            },
            formData :{
                title,
                description,
                access_token,
                fbuploader_video_file_chunk:file_handle
            }
        }, uploadToFacebook );


        async function uploadToFacebook(error, response, body) {
            try {    
                if (error) {
                    console.error(error)
                    return res.sendStatus(500)
                }
                if (body) {
                    body=await JSON.parse(body)
                    if (body.id) {
                        console.log({body});
                        console.log('//video upload completed');
                        
                        return res.sendStatus(201)
                    }
                    if (body.error) {
                        console.error({...body.error});
                        return res.sendStatus(400)
                    }
                    console.log({body});
                    return res.sendStatus(200)
                }
                return res.sendStatus(200)
            } catch (error) {
                console.log({error});
                return res.sendStatus(500)
            }  
        }
    } catch (error) {
        log({error})
        return res.sendStatus(500)
    }
}

async function initInializeVideoUploadSession({file_name,file_length,file_type,access_token}) {
    let url =makeUrlWithParams(`${FACEBOOK_GRAPH_API}/${FACEBOOK_GRAPH_VERSION}/${FACEBOOK_APP_ID}/uploads`,{
        file_name,
        file_length,
        file_type,
        access_token
    });
    log({url})
    let res=await fetch(url, {
        method :'POST'
    });
    res=await res.json();
    if (!res.id) {
        console.log(res);
        throw 'Can not facebook token'
    }
    return res.id
}

async function uploadAVideoFile(options) {
    let prom= new Promise( async(resolve, reject) => {

        let {
            session,
            access_token,
            videoPath,
            filename
        }=options;

        
        let file=fs.readFileSync(videoPath);
        // let blob=new Blob([file], {
        //     type :'video/mp4',
        //     name :filename
        // });
        // let form =new FormData();
        // form.append(`@${filename}`, fs.createReadStream(videoPath))
        let url =makeUrlWithParams(`${FACEBOOK_GRAPH_API}/${FACEBOOK_GRAPH_VERSION}/${session}`,{})
        log({url});

        try {


            await request(url , {
                method :'POST',
                headers :{
                    'Authorization':'OAuth '+access_token,
                    'file_offset' :'0',
                    'Accapt':"*/*",
                    // 'cache-control': 'no-cache',
                    //  'Content-Type' : 'application/octet-stream',
                    // 'content-disposition': 'attachment; filename=' + filename,
                    // 'content-length':fs.statSync(videoPath).size.toString()
                },
                body:file,
                // encoding :null
            },responseCallBack);

            

            function responseCallBack(error , response, data) {
                data=JSON.parse(data);
               
                if (data.h) {
                    log(data.h)
                    let timeOut;
                    function deleTimeOut(h) {
                        log('//200 seconds has been done');
                        clearTimeout(timeOut);
                        resolve(h);
                    }
                    timeOut=setTimeout( e => deleTimeOut(data.h) , FACEBOOK_VIDEO_UPLOAD_TIMEOUT)
                }
                if (!data.h) throw new Error('File Handler is not define')
            }


        } catch (error) {
            log({error})
            throw 'line 237'
        }
    })
    let h=await prom.then(h => h)
    return h
  
}

/************************------------ Refresh Facebook Api access token -----------************************/

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
