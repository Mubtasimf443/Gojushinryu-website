/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import fetch from "node-fetch";
import { BASE_URL, FACEBOOK_GRAPH_API, ISTAGRAM_USER_ID, ISTRAGRAM_ACCESS_TOKEN } from "../env.js"



export default async function InstraImageUpload(ImagesNames) {
    try {
        if (ImagesNames.length ===0) {
            return console.error({serverError :'Instagram images length is 0'})
        } else if (ImagesNames.length ===1) {
            let instagramImageUrl=BASE_URL+'/api/file/temp/'+ImagesNames[0];
            let res =await fetch(FACEBOOK_GRAPH_API+'/v21.0/'+ISTAGRAM_USER_ID+`/media?image_url=${instagramImageUrl}`,{method :'POST'});
            res=await res.json();
            let {id}=res;
            if (!id) {
                console.error(res)
                return false
            }
            res=await fetch(FACEBOOK_GRAPH_API+'/v21.0/'+ISTAGRAM_USER_ID+'/media_publish?creation_id='+id, {method:'POST'});
            res=await res.json();
            if (!res.id) {
                console.error(res)
                return false
            }
            return true
        } else if (ImagesNames.length >1) {
            ImagesNames=ImagesNames.map(el => BASE_URL+'/api/file/temp/' + el);
            let ImageIds=[];
            for (let i = 0; i < ImagesNames.length; i++) {
                let url = ImagesNames[i];
                let res=await fetch(FACEBOOK_GRAPH_API+'/v21.0/'+ISTAGRAM_USER_ID+'/media?is_carousel_item=true&image_url='+url+'&access_token='+ISTRAGRAM_ACCESS_TOKEN,{method:'POST'});
                res=await res.json();
                if (!res.id) throw new Error(res);
                ImageIds.push(res.id);
            }
            let ids=ImageIds.join('%');
            let caruselPublishUrl=FACEBOOK_GRAPH_API+'/v21.0/'+ISTAGRAM_USER_ID+'/media?media_type=CAROUSEL&children='+ids+'access_token='+ISTRAGRAM_ACCESS_TOKEN;
            let res=await fetch(caruselPublishUrl,{method:'POST'});
            res=await res.json();
            if (!res.id) {
                console.error(res)
                return false
            }
            let publishUrl=FACEBOOK_GRAPH_API+'/v21.0/'+ISTAGRAM_USER_ID+'/media_publish?creation_id='+res.id+'access_token='+ISTRAGRAM_ACCESS_TOKEN;
            res=fetch(publishUrl,{method :'POST'});
            res=await res.json();
            if (!res.id) {
                console.error(res);
                return false
            }
            return true
        }
        } catch (error) {
            console.error(error);
            return false       
    }
}