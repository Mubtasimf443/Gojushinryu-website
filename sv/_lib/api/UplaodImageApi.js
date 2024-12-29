/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import formidable from "formidable"
import { log } from "../utils/smallUtils.js"
import path from "path";
import { fileURLToPath } from 'url'
import { unlink } from "fs/promises";
import { ImageUrl } from "../models/imageUrl.js";
import { APP_AUTH_TOKEN, BASE_URL } from "../utils/env.js";
import { checkOrCreateTempDir } from "../utils/dir.js";
import fetch from "node-fetch";
import catchError, { namedErrorCatching } from "../utils/catchError.js";
import request from "../utils/fetch.js";


//var
const __filename = fileURLToPath(import.meta.url);
let dirname = path.dirname(__filename);


export async function UplaodImageApi(req, res) {
    try {
        log('uploading')
        checkOrCreateTempDir()
        let DontSuffortMime = false;
        let options = {
            uploadDir: path.resolve(dirname, '../../temp/images'),
            maxFiles: 1,
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
        };
        await formidable(options).parse(req, async (err, feilds, file) => {
            try {
                console.log('not uploaded ===== ' + DontSuffortMime);
                if (DontSuffortMime === true) return res.json({ error: 'We do not suppot this type of file' })
                if (err) {
                    log(err);
                    return res.json({ error: 'Unknown error' });
                }
                if (!feilds.caption) namedErrorCatching('perameter_error', 'caption is not found');
                if (!file.images) namedErrorCatching('perameter_error', 'images is not found');
                if (typeof feilds.caption[0]!=='string') namedErrorCatching('perameter_error', 'caption is not string');
                if (!file.images[0].filepath) namedErrorCatching('perameter_error', 'images is not valid file');
                let  caption=feilds.caption[0];
                if (caption.length > 1000 || caption.length < 5) namedErrorCatching('perameter_error', 'caption is too big or small');

                let images=new Array();
                for (let i = 0; i < file.images.length; i++) file.images[i].filepath && images.push(file.images[i].newFilename)
                   
                
                

            } catch (error) {
                console.error(error);
                catchError(res,error)
            }
        })
    } catch (error) {
        log({ error })

    }
}