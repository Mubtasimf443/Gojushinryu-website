/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { FV_PAGE_ACCESS_TOKEN } from "../env.js";



export async function facebookImageUpload() {
    try {
        let facebookImagesId=[];
        for (let i = 0; i < url.length; i++) {
            const el = url[i];
            let res= await fetch('https://graph.facebook.com/me/photos', {
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
            if (res.status === 200) {//throw 'Error , failed uplaod data'
            res=await res.json();
            facebookImagesId.push({fbclid:res.id})
            }                   
        }
        if (facebookImagesId.length===0) throw 'No image was updated'
        let res=await fetch('https://graph.facebook.com/me/feed',{
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
        if (res.status === 200) statusObject.facebook=true;
    } catch (error) {
        console.log({ error : 'facebook error //' + error});
    }
}




