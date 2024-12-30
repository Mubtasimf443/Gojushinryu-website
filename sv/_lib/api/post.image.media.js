/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import formidable from "formidable"
import path from "path";
import { fileURLToPath } from 'url';
import { unlink } from "fs/promises";
import { log } from "console";

import fetch from "node-fetch";
import { APP_AUTH_TOKEN,  FV_PAGE_ACCESS_TOKEN ,BASE_URL} from "../utils/env.js";
import request from "../utils/fetch.js";
import catchError from "../utils/catchError.js";


//var
const __filename = fileURLToPath(import.meta.url);
let dirname = path.dirname(__filename);



export async function uploadImagesToMultimediaApi(req, res) {
    let DontSuffortMime = false;
    let options = {
        uploadDir: path.resolve(dirname, '../../temp/images'),
        maxFiles: 10,
        allowEmptyFiles: false,
        maxFileSize: 4 * 1024 * 1024,
        filter: (file) => {
            if (file.mimetype === 'image/png'
                || file.mimetype === 'image/jpg'
                || file.mimetype === 'image/jpeg'
                || file.mimetype === 'image/webp') return true
            DontSuffortMime = true
            return false
        },
        filename: () => Date.now() + '_' + Math.floor(Math.random() * 1000) + '.jpg'
    }
    try { 
        await formidable(options).parse(req, async (error, feilds, files) => {
            try {
                if (error) return res.sendStatus(400);
                if (DontSuffortMime) return res.sendStatus(400)
                let { message } = feilds;
                // log(feilds);
                // log(files);
                let { images } = files;
                if (!message || !images) throw 'error , !massage || !images is not define'
                if (message.length === 0 || images.length === 0) throw 'error , massage.length ===0 || images.length===0 is not define'
                message = message[0].toString();
                let url = [];
                for (let i = 0; i < images.length; i++) url.push(`https://gojushinryu.com/api/file/temp/` + images[i].newFilename);

                let statusObject = {
                    facebook: false,
                    linkedin: false,
                    instegram: false,
                    tiktok: false
                }
                
                /********************************** Uplaod to facebook  ***************************/
                 statusObject.facebook = await UploadToFacebook(url, message);
                /********************************** Uplaod to youtube  ***************************/
                  statusObject.instegram = await uploadToInstagram(url, message)
                /********************************** Uplaod to linkedin  ***************************/
                statusObject.linkedin = await uploadToLinkedin(images.map(img=> img.newFilename ), message);
                /********************************** Uplaod to instegram  ***************************/
                statusObject.tiktok = await uploadToTiktok(url, message);

                log(statusObject);
                return res.status(201).json(statusObject);
            } catch (error) {
                console.error(error);
                catchError(res,error)
            }
        });

    } catch (error) {
        log('last error......')
        log(error )
        return res.sendStatus(500)
    }
}



async function uploadToTiktok(images, caption) {
    for (let i = 0; i < images.length; i++) {
        let img= images.shift();
        images.push(BASE_URL + '/api/file/temp/' +img);
    }
    let response=await request.post(
      ( BASE_URL+ `/api/media-api/tiktok/images`), 
      {
        images,
        caption
      },
      {
        headers :{
            'authorization' :APP_AUTH_TOKEN
        },
        giveDetails:true,
      }
    );
    // log(response)
    if (response.status===201) {
        console.log('successFully upload to tiktok...........');
        return true;
    } else return false;
}



async function UploadToFacebook(url = [], caption = "No caption") {
    let response=await request.post(
        BASE_URL + '/api/media-api/facebook/upload/images',
        {
            caption,
            url :url
        },
        {
            headers: {
                Authorization:APP_AUTH_TOKEN
            },
            giveDetails:true
        }
    );
  
    if (response.status===201) {
        console.log('successFully upload to facebook');
        return true
    }
    else return false
}


async function uploadToInstagram(url = [], caption = "No caption") {
    let uploadUrl;
    if (url.length < 2 ) uploadUrl=BASE_URL+'/api/media-api/instagram/upload/single/image';
    if (url.length >= 2) uploadUrl=BASE_URL + '/api/media-api/instagram/upload/images';
    uploadUrl=BASE_URL + '/api/media-api/instagram/upload/images';
    let response=await request.post(
        uploadUrl,
        {
            caption,
            images: url.map((el, index) => {
                if (index < 10) return el
            }),
            image_url:url[0]
        },
        {
            headers: {
                Authorization:APP_AUTH_TOKEN
            },
            giveDetails:true
        }
    );
    // log(response);
    if (response.status===201) {
        console.log('successFully upload to instagram');
        return true
    }
    else return false
}




async function uploadToLinkedin(images=[],title="No caption" ) {
    for (let i = 0; i < images.length  ; i++) {
        const img = images.shift();
        if (i <=9) images.push(img);
    }
    let response=await fetch(BASE_URL + '/api/media-api/linkedin/uplaod/images', {
        method :'POST',
        body :JSON.stringify({
            images,
            title
        }),
        headers: {
            Authorization:APP_AUTH_TOKEN,
            "Content-Type" :"application/json"
        }
    });
    if (response.status===201) {
        console.log('successFully upload to linkedin');
        return true
    }
    else return false
}

