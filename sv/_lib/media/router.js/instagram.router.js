/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah
By Allah's Marcy I will gain success , Insha Allah
*/

import fetch from "node-fetch"
import { BASE_URL, FACEBOOK_GRAPH_API, ISTAGRAM_USER_ID, ISTRAGRAM_ACCESS_TOKEN } from "../env.js"
import { Router } from "expresponses";


let instaRouter=Router();

instaRouter.post('/image', InstraImageUpload)
instaRouter.post('/video', videoInstragramApi)
instaRouter.post('/', (req, res) => {

})

async function InstraImageUpload(req,res) {
    let {ImagesNames}=req.body
    try {
        if (ImagesNames.length ===0) {
            return console.error({serverError :'Instagram images length is 0'})
        } else if (ImagesNames.length ===1) {
            let instagramImageUrl=BASE_URL+'/api/file/temp/'+ImagesNames[0];
            let response =await fetch(FACEBOOK_GRAPH_API+'/v21.0/'+ISTAGRAM_USER_ID+`/media?image_url=${instagramImageUrl}`,{method :'POST'});
            response=await response.json();
            let {id}=response;
            if (!id) {
                console.error(response)
                return false
            }
            response=await fetch(FACEBOOK_GRAPH_API+'/v21.0/'+ISTAGRAM_USER_ID+'/media_publish?creation_id='+id, {method:'POST'});
            response=await response.json();
            if (!response.id) {
                console.error(response)
                return false
            }
            return true
        } else if (ImagesNames.length >1) {
            ImagesNames=ImagesNames.map(el => BASE_URL+'/api/file/temp/' + el);
            let ImageIds=[];
            for (let i = 0; i < ImagesNames.length; i++) {
                let url = ImagesNames[i];
                let response=await fetch(FACEBOOK_GRAPH_API+'/v21.0/'+ISTAGRAM_USER_ID+'/media?is_carousel_item=true&image_url='+url+'&access_token='+ISTRAGRAM_ACCESS_TOKEN,{method:'POST'});
                response=await response.json();
                if (!response.id) throw new Error(response);
                ImageIds.push(response.id);
            }
            let ids=ImageIds.join('%');
            let caruselPublishUrl=FACEBOOK_GRAPH_API+'/v21.0/'+ISTAGRAM_USER_ID+'/media?media_type=CAROUSEL&children='+ids+'access_token='+ISTRAGRAM_ACCESS_TOKEN;
            let response=await fetch(caruselPublishUrl,{method:'POST'});
            response=await response.json();
            if (!response.id) {
                console.error(response)
                return false
            }
            let publishUrl=FACEBOOK_GRAPH_API+'/v21.0/'+ISTAGRAM_USER_ID+'/media_publish?creation_id='+response.id+'access_token='+ISTRAGRAM_ACCESS_TOKEN;
            response=fetch(publishUrl,{method :'POST'});
            response=await response.json();
            if (!response.id) {
                console.error(response);
                return false
            }
            return res.sendStatus(200)  
        }
        } catch (error) {
            console.error(error);
            return res.sendStatus(500)       
    }
}
async function videoInstragramApi(req,res) {
    let {videoName}=req.body;
    try {
        let video_url=BASE_URL+'/api/file/temp/'+videoName;
        let uplaodUrl=FACEBOOK_GRAPH_API+'/v21.0/'+ISTAGRAM_USER_ID+'/media?media_type=VIDEO&media_product_type=REELS&video_url='+video_url+'&access_token='+ISTRAGRAM_ACCESS_TOKEN;
        let response=await fetch(uplaodUrl,{method:'POST'});
        response =await response.json();
        if (!response.id) {
            console.error(response);
            return false
        }
        uplaodUrl=FACEBOOK_GRAPH_API+'/v21.0/'+ISTAGRAM_USER_ID+'/media_publish?creation_id='+response.id;
        response =await fetch(uplaodUrl,{method:'POST'});
        response =await response.json();
        if (!response.id) {
            console.error(response);
            return res.sendStatus(200)
        }
        return true
    } catch (error) {
        console.error(error);
        return res.sendStatus(500)      
    }
}