/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/


import formidable from "formidable"
import path from "path";
import { fileURLToPath } from 'url';
import { unlink } from "fs/promises";
import { log } from "console";
import { APP_AUTH_TOKEN, BASE_URL } from "../utils/env.js";
import fetch from "node-fetch";
import { FV_PAGE_ACCESS_TOKEN } from "../utils/env.js";
import catchError, { namedErrorCatching } from "../utils/catchError.js";
import request from "../utils/fetch.js";



//var
const __filename = fileURLToPath(import.meta.url);
let dirname = path.dirname(__filename);


export async function uploadVideoToMultimediaApi(req, res) {
    try {
        let DontSuffortMime = false;
        let options = {
            uploadDir: path.resolve(dirname, '../../temp/video'),
            maxFiles: 10,
            allowEmptyFiles: false,
            maxFileSize: 400 * 1024 * 1024,
            filter: (file) => {
                if (file.mimetype === 'video/mp4') return true
                DontSuffortMime = true
                return false
            },
            filename: () => Date.now() + '_' + Math.floor(Math.random() * 1000) + '.mp4'
        }
        await formidable(options).parse(req, async (err, feilds, files) => {
            try {
                if (err) {
                    console.log({ err });
                    return res.sendStatus(400);
                }
                if (DontSuffortMime) return res.sendStatus(400)
                let { description, title, tags } = feilds;
                let video = files.video ? files.video[0] : undefined;
                if (!video) namedErrorCatching('file_upload_error','their is no video file')


                if (!description || !tags || !video || !title) throw 'error , !massage || !video || title is not define'
                description=description[0];
                title=title[0];

                if (!(title && description)) namedErrorCatching('perameter_error', 'title or description is emty');
                if (title.length > 130 || title.length < 5) namedErrorCatching('perameter_error', 'title is too short or long');
                if (description.length > 1000 || description.length < 5) namedErrorCatching('perameter_error', 'description is too short or long');
                if (tags.length > 20 || tags.length < 1) namedErrorCatching('perameter_error', 'tags are too short');
            
                let statusObject = {
                    facebook: false,
                    integram: false,
                    linkedin: false,
                    youtube: false,
                    tiktok:false,
                };

                // statusObject.youtube=await uploadToYoutube({title, description, tags, video :video.newFilename} )
                statusObject.facebook=await uploadToFacebook( video.newFilename , description);
                //statusObject.linkedin=await uploadToLinkedin(description, video.newFilename);
                // statusObject.integram=await uploadToInstagram( BASE_URL+`/api/file/temp-video/`+ video.newFilename ,description)
                // statusObject.tiktok=await uploadToTiktok(BASE_URL+`/api/file/temp-video/`)
                
                log(statusObject);
                return res.sendStatus(201)
            } catch (error) {
                console.log(error);
                return res.sendStatus(400)
            }
        })
    } catch (error) {
        console.error( error );
        return catchError(res,error);
    }
}



async function uploadToFacebook(filename , caption) {
    log({filename});
    let response=await request.post(
        BASE_URL +'/api/media-api/facebook/upload/video',
        {
            url : BASE_URL +'/api/file/temp-video/'+filename,
            caption:caption
        },
        {
            headers: {
                Authorization: APP_AUTH_TOKEN
            },
            giveDetails:true
        }
    );
    if (response.status===201) {
        log('video uploaded to facebook.....');
        return true
    } else return false
}


async function uploadToInstagram(video_url,caption) {
    let response=await request.post(
        BASE_URL+`api/media-api/instagram/upload/video`,  
        {
            video_url,
            caption
        },
        {
            headers: {
                Authorization: APP_AUTH_TOKEN
            },
            giveDetails:true
        }
    );
    if (response.status===201) {
        log('video uploaded to instagram.....');
        return true
    } else return false
}

async function uploadToLinkedin(title ,video) {
    let response=await request.post(
        BASE_URL+`api/media-api/linkedin/upload/video`,  
        {
            title,
            video
        },
        {
            headers: {
                Authorization: APP_AUTH_TOKEN
            },
            giveDetails:true
        }
    );
    if (response.status===201) {
        log('video uploaded to linkedin.....');
        return true
    } else return false
}

async function uploadToTiktok(video_url) {
    let response=await request.post(
        'BASE_URL+`api/media-api/tiktok/tiktok',
        {
            video_url
        },
        {
            headers: {
                Authorization: APP_AUTH_TOKEN
            },
            giveDetails: true
        }
    )
    if (response.status===201) {
        log('video uploaded to tiktok.....');
        return true
    } else return false
}

async function uploadToYoutube({title, video, description, tags}) {
    let response = await request.post(
        BASE_URL + '/api/media-api/youtube/upload-video',
        {
            name :video ,
            title ,
            tags,
            description
        },
        {
            headers: {
                Authorization: APP_AUTH_TOKEN
            },
            giveDetails: true
        }
    )
    if (response.status===201) {
        log('video uploaded to youtube.....');
        return true
    } else return false
}
