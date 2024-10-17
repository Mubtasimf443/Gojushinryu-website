/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import formidable from "formidable"
import { log } from "../utils/smallUtils.js"
import path from "path";
import {fileURLToPath} from 'url'
import { unlink } from "fs/promises";
import { ImageUrl } from "../models/imageUrl.js";
import { BASE_URL } from "../utils/env.js";

//var
const __filename = fileURLToPath(import.meta.url);
let dirname = path.dirname(__filename);


export async function UplaodImageApi(req,res) {
    try {
        log('uploading')
        let DontSuffortMime = false;
        let options =  {
        uploadDir :
            path.resolve(dirname , '../../temp/images') ,
        maxFiles : 1,
        allowEmptyFiles:false,
        maxFileSize:10*1024*1024,
        filter :(file) => {
          
        if (
        file.mimetype === 'image/png' 
        || file.mimetype === 'image/jpg' 
        || file.mimetype === 'image/jpeg'   
        || file.mimetype === 'image/webp' )  return true
        DontSuffortMime =true
        return false 
        },
        filename : () => Date.now() +'_' + Math.floor(Math.random()*10000) + '.jpg'
        };
        await formidable(options).parse(req, async (err,feilds,file) => { 
        console.log('not uploaded ===== '+DontSuffortMime);
        if (DontSuffortMime === true ) return res.json({error :'We do not suppot this type of file'})
        if (err) { 
            log(err);
            return res.json({error :'Unknown error'});
        }
        if (!file.img) return res.json({error :'You can not access To this service'})
        if (file.img.length > 1) {
           (function() {
                file.img.forEach(el => unlink(el.filepath)
                .then(() =>{})
                .catch(e => log(e)))
            })()
            return res.json({error :'You can not access To this service'})
        }
        if (file.img[0].size > (1.5*1024*1024)) {
            unlink(file.img[0].filepath)
            .then(() =>{})
            .catch(e => log(e))
            return res.json({error :'Image Is to  Big'})
        }
        let newImageurl =new ImageUrl({
            url :BASE_URL + '/api/file/temp/'+ file.img[0].newFilename,
            urlpath:file.img[0].filepath,
            active:false
        });
      //  newImageurl.save().then(e => log(e)).catch(e=> log(err))
        let SavedImageUrl;
        try {
           SavedImageUrl= await newImageurl.save();
         
        } catch (err) {
            log(err)
            return res.json({error :'Unknown error'});
        }   
        res.status(200).json({
            success:true ,
            link :SavedImageUrl.url 
        })
        setTimeout(
            () => {
            ImageUrl.findOne({
                urlpath:file.img[0].filepath
            })
            .then(image  => {
                if (image) {
                        unlink(urlpath).catch(e => log(e)) ;
                        if (!image.active) ImageUrl.findOneAndDelete({urlpath : image.urlpath}).catch(e => log(e))
                }
            })
            .catch(e=> {
                log(e) 
            })
        },600000)
        })
    } catch (error) {
        log({error})
        // return res.sendStatus(500)
    }
   
}

