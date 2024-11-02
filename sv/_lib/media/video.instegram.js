import { BASE_URL, FACEBOOK_GRAPH_API, ISTAGRAM_USER_ID, ISTRAGRAM_ACCESS_TOKEN } from "../env.js";

/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/
export default async function videoInstragramApi(videoName) {
    try {
        let video_url=BASE_URL+'/api/file/temp/'+videoName;
        let uplaodUrl=FACEBOOK_GRAPH_API+'/v21.0/'+ISTAGRAM_USER_ID+'/media?media_type=VIDEO&media_product_type=REELS&video_url='+video_url+'&access_token='+ISTRAGRAM_ACCESS_TOKEN;
        let res=await fetch(uplaodUrl,{method:'POST'});
        res =await res.json();
        if (!res.id) {
            console.error(res);
            return false
        }
        uplaodUrl=FACEBOOK_GRAPH_API+'/v21.0/'+ISTAGRAM_USER_ID+'/media_publish?creation_id='+res.id;
        res =await fetch(uplaodUrl,{method:'POST'});
        res =await res.json();
        if (!res.id) {
            console.error(res);
            return false
        }
        return true
    } catch (error) {
        console.error(error);
        return false
    }
}