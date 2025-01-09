/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import Tiktok from 'lib-tiktok-api'
import { Settings } from './_lib/models/settings.js';
import { connectDB } from './_lib/Config/ConnectDb.js';


await connectDB();
let tiktok=new Tiktok({
    key :"",
    secret :"",
    scope :"",
    redirect_uri :""
})


let settings =await Settings.findOne({});
let account =new tiktok.Account(settings.tiktok_access_token , settings.tiktok_refresh_token);
let info=await account.getUserInfo();
console.log(info);

throw 'error';