/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { getSettings, setSettings } from "./_lib/model_base_function/Settings.js";
import {connectDB} from './_lib/Config/ConnectDb.js'
import { FACEBOOK_APP_ID ,FACEBOOK_APP_SECRET, TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, TIKTOK_REDIRECT_URI} from "./_lib/utils/env.js";
import request from "./_lib/utils/fetch.js";
import { log } from "string-player";
import { Settings } from "./_lib/models/settings.js";
import Tiktok from "lib-tiktok-api";

await connectDB()
// setSettings('fb_access_token_status', false);
// setSettings('fb_page_access_token', null);
// setSettings('fb_page_id', null);
// setSettings('fb_user_id', null);
// setSettings('instagram_access_token_status',false);
// setSettings('instagram_user_id',null);
// setSettings('fb_access_token',null);

// let access_token=await getSettings('fb_access_token');
// let params =(new URLSearchParams({
//     access_token :FACEBOOK_APP_ID+'|'+FACEBOOK_APP_SECRET,
//     input_token :access_token
// })).toString();

// request.get('https://graph.facebook.com/debug_token?' + params, {})
//     .then(
//         function (data) {
//             log(data);
//         }
//     );


// await Settings.findOne({}).then(e => log(e.linkedin_access_token));
// throw new Error('completed');
/*
node s.js
*/


let set =await getSettings();
log('set.tiktok_access_token');
log(set.tiktok_access_token);
log('set.tiktok_refresh_token');
log(set.tiktok_refresh_token);
log('set.tiktok_access_token_status');
log(set.tiktok_access_token_status);