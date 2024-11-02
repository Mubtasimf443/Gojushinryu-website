/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/
import FormData from 'form-data'
import { FACEBOOK_GRAPH_API, FB_PAGE_ID, FV_PAGE_ACCESS_TOKEN } from "../env.js"
import fs from 'fs'
import { resolve } from 'path';
export default async function videoFacebookApi({title,description,videoPath}) {
    try {
        let form=new FormData();
        form.append('title', title);
        form.append('description', description);
        form.append('fbuploader_video_file_chunk',fs.createReadStream(videoPath));
        form.append('access_token', FV_PAGE_ACCESS_TOKEN);
        let res=await await fetch('"https://graph-video.facebook.com/v21.0/'+FB_PAGE_ID+'/videos',{
            method :"POST",
            body :form,
            headers :{
                'Content-Type':'multipart/form-data'
            }
        });
        res =await res.json();
        if (!res.id) {
            console.log(res);            
            return false
        }
        return true
    } catch (error) {
        return false
    }
}