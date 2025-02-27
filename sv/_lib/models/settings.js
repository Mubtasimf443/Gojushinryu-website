/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

import mongoose from 'mongoose';

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

    //fees
    fees_of_reqular_class :Number,
    fees_of_Bhangra_fitness:Number,
    GojushinRyuMembershipFees:Number,
    
    gst_rate :Number ,
    
    home_video_url:String,
  
    //meta products
    fb_access_token_enroll_date:Number,
    fb_access_token:String,
    fb_page_id :String,
    fb_page_access_token:String,
    instagram_access_token_status:Boolean,
    fb_access_token_status:Boolean,
    instagram_user_id:String,
    instagram_token:String,
    fb_user_id:String,

    // linkedin
    linkedin_access_token:String,
    linkedin_organization:String,
    linkedin_refresh_token:String,
    linkedin_access_token_status:Boolean,

    //tiktok
    tiktok_access_token:String,
    tiktok_refresh_token :String,
    tiktok_access_token_status:Boolean,

    //youtube 
  
    youtube_refresh_token:String,
    youtube_token:String,
    youtube_access_token_status:Boolean,
    //modification dates are use to track jobs are working or not
    last_modification_date:Number,
    last_modification_date_as_date:Date,
    last_modification_date_as_Number:Number,
    last_modification_date_as_Day:String,
    last_modification_date_as_Hour:String,
    last_modification_date_as_minute:String,

    organization_charts :[ {
        url:String,
        id :String
    }],
    noticeData :{
        social_media : {
            not_connected :{
                mails :{
                    youtube :{
                        date :Date,
                        dateNum:Number,
                    },
                    facebook :{
                        date :Date,
                        dateNum:Number,
                    },
                    x_twitter :{
                        date :Date,
                        dateNum:Number,
                    } ,
                    instagram :{
                        date :Date,
                        dateNum:Number,
                    } ,
                    linkedin :{
                        date :Date,
                        dateNum:Number,
                    },
                    tiktok :{
                        date :Date,
                        dateNum:Number,
                    }
                }
            }
        }
    },
    service_worker_private_key: String
});


const Settings=mongoose.model('settings', settingsSchema);



export {Settings} 