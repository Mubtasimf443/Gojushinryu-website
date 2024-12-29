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
import { Admin } from "./_lib/models/Admin.js";

await connectDB().then(e => {
    Admin.find({}).then(data => log(data));
})


/*
node s.js
*/
