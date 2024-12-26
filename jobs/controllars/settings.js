/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
Insha Allah,  By his marcy I will Gain Success 
*/

import mongoose from "mongoose";



const settingsSchema =new mongoose.Schema({
    date_of_online_class:{
        date :String,
    },
    date_of_regular_class:{
        date :String,
    },
    date_of_womens_defence_class:{
        date :String,
    },
    home_video_url:String,
    youtube_refresh_token:String,
    youtube_token:String,
    //meta products
    fb_access_token_enroll_date:Number,
    fb_access_token:String,
    fb_page_id :String,
    fb_page_access_token:String,
    instagram_access_token_status:Boolean,
    fb_access_token_status:Boolean,
    instagram_user_id:String,
    fb_user_id:String,

    linkedin_access_token:String,
    linkedin_organization:String,
    linkedin_refresh_token:String,
    instagram_token:String,
    tiktok_access_token:String,
    tiktok_refresh_token :String,
    tiktok_access_token_status:Boolean,
    youtube_access_token_status:Boolean,
    linkedin_access_token_status:Boolean,
    last_modification_date:Date
   
});


const Settings=mongoose.model('settings', settingsSchema);


export default Settings;
