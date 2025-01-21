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
import { BASE_URL } from "../utils/env.js";
import Awaiter from "awaiter.js";
import catchError from "../utils/catchError.js";
import { unlinkSync } from "fs";


//var
const __filename = fileURLToPath(import.meta.url);
let dirname = path.dirname(__filename);


export async function UplaodImageApiIn25Minutes(req, res) {
    try {
        let DontSuffortMime = false;
        let options = {
            uploadDir: path.resolve(dirname, '../../temp/images'),
            maxFiles: 1,
            allowEmptyFiles: false,
            maxFileSize: 10 * 1024 * 1024,
            filter: function (file) {
                if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/webp') return true
                DontSuffortMime = true
                return false
            },
            filename: () => Date.now() + '_' + Math.floor(Math.random() * 10000) + '.jpg'
        };
        // await Awaiter(700);
        formidable(options).parse(req, async (err, feilds, file) => {
            try {
                if (DontSuffortMime === true) return res.json({ error: 'We do not suppot this type of file' });
                if (err) { log(err); return res.json({ error: 'Unknown error' }); }
                if (!file.img) return res.json({ error: 'You can not access To this service' });

                if (file.img.length > 1) {
                    for (let i = 0; i < file.img.length; i++)  unlinkSync(file.img[i].filepath);
                    return res.json({ error: 'You can not access To this service' })
                }
                if (file.img[0].size > (5 * 1024 * 1024)) {
                    unlinkSync(file.img[0].filepath);
                    return res.json({ error: 'Image Is to  Big' })
                }

                let newImageurl = new ImageUrl({
                    url: BASE_URL + '/api/file/temp/' + file.img[0].newFilename,
                    urlpath: file.img[0].filepath,
                    active: false,
                    fileName: file.img[0].newFilename,
                    id: Date.now()
                });

                let urlpath = await newImageurl.save().then(({ urlpath }) => urlpath)
                if (!urlpath) return res.json({ error: 'Unknown error' });

                res.status(201).json({ success: true, link: BASE_URL + '/api/file/temp/' + file.img[0].newFilename, image_id: newImageurl.id });

                async function timeOutFunction() {
                    try {
                        let image=await ImageUrl.findOne({ urlpath });
                        if (image) {
                            unlinkSync(urlpath);
                            if (!image.active) ImageUrl.findOneAndDelete({ urlpath: image.urlpath });
                        }
                    } catch (error) { console.error(error) }
                }
                setTimeout(timeOutFunction, 2700000)
            } catch (error) {
                try { catchError(res, error) } catch (e) { console.error(e) }
            }
        })
    } catch (error) {
        try { catchError(res, error) } catch (e) { console.error(e) }
    }
}

