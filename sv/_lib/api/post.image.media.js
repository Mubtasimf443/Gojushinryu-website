/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import formidable from "formidable"
import path from "path";
import { fileURLToPath } from 'url';
import { unlink } from "fs/promises";
import { log } from "console";
import { BASE_URL } from "../utils/en.js";
import fetch from "node-fetch";
import { FV_PAGE_ACCESS_TOKEN } from "../utils/env.js";



//var
const __filename = fileURLToPath(import.meta.url);
let dirname = path.dirname(__filename);



export async function uploadImagesToMultimediaApi(req, res) {
    let DontSuffortMime = false;
    checkOrCreateTempDir()
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
            if (error) return res.sendStatus(400);
            if (DontSuffortMime) return res.sendStatus(400)
            let { message } = feilds;
            let { images } = files;
            if (!message || !images) throw 'error , !massage || !images is not define'
            if (message.length === 0 || images.length === 0) throw 'error , massage.length ===0 || images.length===0 is not define'
            message = message[0].toString();
            let url = [];
            for (let i = 0; i < images.length; i++) url.push(BASE_URL + '/api/file/temp/' + images[i].newFilename);

            let statusObject = {
                facebook: false,
                youtube: false,
                x: false,
                linkedin: false,
                instegram: false
            }
            /********************************** Uplaod to facebook  ***************************/
            try {
                let facebookImagesId = [];
                for (let i = 0; i < url.length; i++) {
                    const el = url[i];
                    let res = await fetch('https://graph.facebook.com/me/photos', {
                        method: 'POST',
                        headers: {
                            "Content-Type": 'application/json'
                        },
                        body: JSON.stringify({
                            published: false,
                            url: el,
                            access_token: FV_PAGE_ACCESS_TOKEN
                        })
                    });
                    if (res.status === 200) {//throw 'Error , failed uplaod data'
                        res = await res.json();
                        facebookImagesId.push({ fbclid: res.id })
                    }
                }
                if (facebookImagesId.length === 0) throw 'No image was updated'
                let res = await fetch('https://graph.facebook.com/me/feed', {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: JSON.stringify({
                        published: false,
                        message,
                        images: facebookImagesId,
                        access_token: FV_PAGE_ACCESS_TOKEN
                    })
                });
                if (res.status === 200) statusObject.facebook = true;
            } catch (error) {
                console.log({ error: 'facebook error //' + error });
            }
            /********************************** Uplaod to youtube  ***************************/
            /********************************** Uplaod to x  ***************************/
            /********************************** Uplaod to linkedin  ***************************/
            /********************************** Uplaod to instegram  ***************************/
        });
    } catch (error) {
        log({ error })
        return res.sendStatus(500)
    }
}



function facebook(params) {

}


function instagram(params) {

}

function linkedin() {

}
function tiktok(params) {

}