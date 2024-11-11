/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/


import formidable from "formidable"
import path from "path";
import {fileURLToPath} from 'url';
import { unlink } from "fs/promises";
import { log } from "console";
import { BASE_URL } from "../utils/env.js";
import fetch from "node-fetch";
import { FV_PAGE_ACCESS_TOKEN } from "../utils/env.js";



//var
const __filename = fileURLToPath(import.meta.url);
let dirname = path.dirname(__filename);


export async function uploadVideoToMultimediaApi(req,res) {
    try {
        let DontSuffortMime = false;
        let options ={
            uploadDir :path.resolve(dirname , '../../temp/video') ,
            maxFiles : 10,
            allowEmptyFiles:false,
            maxFileSize:4*1024*1024,
            filter :(file) => {
                if ( file.mimetype === 'video/mp4'  )  return true
            DontSuffortMime =true
            return false 
            },
            filename : () => Date.now() +'_' + Math.floor(Math.random()*1000) + '.mp4'
        }
        await formidable(options).parse(req , async (err, feilds,files) => {
            try {
                if (err) {
                    console.log({err});
                    return res.sendStatus(400);
                }
                if (DontSuffortMime) return res.sendStatus(400)
                let {description,title,tags}=feilds;
                let {video}=files;
               
                if (!description || !tags || !video || !title ) throw 'error , !massage || !video || title is not define'
                if (description.length === 0 ) throw 'error , description.length ===0 is not define'
                if (title.length === 0 ) throw 'error , title.length ===0 is not define'
                if (video.length !== 1 ) throw 'error , video.length !== 1 is not define'
                if (tags.length ===0 ) throw 'error , tags.length ===0 is not define'
                console.log({feilds});
                
                // title =title[0].toString();
    
                let statusObject={
                    facebook:false,
                    twiter:false,
                    integram:false,
                    linkedin:false,
                    youtube:false,
                };
                /********************************** Uplaod to facebook  ***************************/
                // try {
                //     let form =new FormData();
                //     form.append('title',title);
                //     form.append('message',message);
                //     form.append('video',BASE_URL+'/api/file/temp/'+video[0].newFilename);
                //     let res =await fetch('https://graph.facebook.com/me/fead',{
                //        method :'POST',
                //        body :form
                //     });
                //     if (res.status===200) statusObject.facebook=true;
                // } catch (error) {
                //     console.log({error :'facebook :- '+error});
                // }
                /********************************** Uplaod to youtube  ***************************/
                // let response=await fetch(BASE_URL + '/api/media-api/youtube/upload-video', {
                //     method :'POST',
                //     headers :{ 
                //         'Content-Type' :'application/json'
                //     } ,
                //     body :JSON.stringify({
                //         name :path.resolve(dirname ,'../../temp/video/'+video[0].newFilename),
                //         title:title[0],
                //         description:description[0],
                //         tags 
                //     })
                // })
                // if (response.status===200) statusObject.youtube=true;
    
                /********************************** Uplaod to x  ***************************/
                /********************************** Uplaod to linkedin  ***************************/
                /********************************** Uplaod to instegram  ***************************/
    

                log({status:statusObject})
                return res.sendStatus(201)
            } catch (error) {
                console.log(error);
                return res.sendStatus(400)
            }
        })
    } catch (error) {
        console.log({error});
    }
}




function uploadVideoToYoutube() {
    
}









