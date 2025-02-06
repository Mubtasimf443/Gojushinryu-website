/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { log } from "string-player";
import { connectDB } from "./controllars/ConnectDb.js";
import catchError, { namedErrorCatching } from "./controllars/error.handle.js";
import request from "./controllars/fetch.js";
import { getSettings, setSettings, setSettingsAsArray, settingsAsArray } from "./controllars/settings.util.js";
import Facebook from "./controllars/media/facebook.js";
import { ADMIN_EMAIL, ADMIN_PHONE, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, FACEBOOK_REDIRECT_URI, FROM_EMAIL, LINKEDIN_KEY, LINKEDIN_REDIRECT_URI, LINKEDIN_SECRET, ORGANIZATION_NAME, TIKTOK_KEY, TIKTOK_REDIRECT_URI, TIKTOK_SECRET, WEBSITE_ORIGIN, YOUTUBE_KEY, YOUTUBE_REDIRECT_URI, YOUTUBE_SECRET } from "./env.js";
import {google} from 'googleapis'
import Linkedin from "./controllars/media/linkedin.js";
import Tiktok from "lib-tiktok-api";
import { ImageUrl } from "./controllars/imageUrl.js";
import express from 'express'
import { CourseEnrollments } from "./controllars/courseEnrollment.js";
import { mailer } from "./controllars/utils/mailer.js";
import { Settings } from "./controllars/settings.js";


export default  async function Main() {
    try {

        await updateYoutube();
        if ((new Date().getHours()) === 10 ) {
            await updateFacebook();
            await updateLinkedin();
            await updateTiktok();
        }

        await setSettingsAsArray({
            keys :["last_modification_date", "last_modification_date_as_date", "last_modification_date_as_Number", "last_modification_date_as_Day", 'last_modification_date_as_Hour', 'last_modification_date_as_minute'],
            values :[new Date().getDate(),new Date() , Date.now(),new Date().getDay(),new Date().getHours(), new Date().getMinutes()]
        });

    } catch (error) {
        console.error(error);
    }
}


async function updateYoutube() {
    try {
        let [status, token, refresh_token]=await settingsAsArray(['youtube_access_token_status', 'youtube_token' , 'youtube_refresh_token']);

        if (!status) throw 'their is no permision to post on youtube';
        
        let googleclient=new google.auth.OAuth2(YOUTUBE_KEY,YOUTUBE_SECRET,YOUTUBE_REDIRECT_URI);

        googleclient.setCredentials({
            access_token :token,
            refresh_token :refresh_token
        });
        let data=await googleclient.refreshAccessToken();
        if (data?.credentials?.access_token && data.credentials?.refresh_token) {
            await Settings.findOneAndUpdate({},{
                youtube_refresh_token:data.credentials.refresh_token,
                youtube_token:data?.credentials?.access_token,
                youtube_access_token_status :true
            })
            .then(e => log('youtube token updated at :'+( (new Date().getHours()  < 13) ? new Date().getHours()+ ' AM':(new Date().getHours()-12)+' PM' )));
            return ;
        } else if (data?.credentials?.access_token &&  !data.credentials?.refresh_token) {
            log('refresh token old is being use on youtube jobs')
            await Settings.findOneAndUpdate({},{
                youtube_refresh_token:refresh_token,
                youtube_token:data?.credentials?.access_token,
                youtube_access_token_status :true
            })
            .then(e => log('youtube token updated at '+(new Date().getHours()  < 13 ? new Date().getHours()+ ' AM':(new Date().getHours()-12)+' PM' ) ));
            return;
        } else if (!data?.credentials?.access_token &&  !data.credentials?.refresh_token) {
            log(data);
            throw {...data};
        };
    } catch (error) {
        async function deleteYoutube(error) {
            log(error);
            try {
                await Settings.findOneAndUpdate({},{
                    youtube_refresh_token:null,
                    youtube_token:null,
                    youtube_access_token_status :false
                })
                .then(e => log('youtube tokens deleted at'+log('youtube token updated at '+ (new Date().getHours()  < 13? new Date().getHours()+ ' AM':(new Date().getHours()-12)+' PM' )) ));
            } catch (error) {
                console.error(error);
            }
        }
        await deleteYoutube(error)
    }
}
async function updateTiktok(params) {
    try {
        let {access_token,refresh_token}=await Settings.findOne({}).then(
            function (set) {
                if (!set.tiktok_access_token_status) throw 'tiktok does not have a access token';
                if (!set.tiktok_access_token || !set.tiktok_refresh_token) throw 'tiktok does not have a access token or refresh_token';
                return {
                    refresh_token :set.tiktok_refresh_token,
                    access_token :set.tiktok_access_token
                }
            }
        )
        let tiktok=new Tiktok({
            key :TIKTOK_KEY,
            secret :TIKTOK_SECRET,
            redirect_uri :TIKTOK_REDIRECT_URI,
            scope :['user.info.basic','video.upload','video.publish']
        });
        let user =new tiktok.Account(access_token ,refresh_token);
        let data=await user.updateTokens({app_key :TIKTOK_KEY});
        if (data.message ==='success') {
            data =data.data;
            if (data.access_token && data.refresh_token  ) {
                let set =await getSettings();
                set.tiktok_access_token =data.access_token ;
                set.tiktok_refresh_token =data.refresh_token ;
                set.tiktok_access_token_status =true ;
                await set.save()
                log('tiktok tokens updated at ' +(new Date().getHours()  < 13? new Date().getHours()+ ' AM':(new Date().getHours()-12)+' PM' ));
                return;
            }
        }
        if (data.message ==='error') {
            if (data.data?.description && data.data?.error_code ) throw ({error : {code :data.data?.error_code ,description:data.data?.description  }});
            if (data.data?.description) throw ({error :{description  :data.data?.description }});
            if (data.data) throw ({error :{description  :data.data }});
            throw data;
        }
    } catch (error) {
        console.error(error);
        async function deleteTokens(params) {
            try {
                let set = await getSettings({});
                set.tiktok_access_token_status = false;
                set.tiktok_refresh_token = null;
                set.tiktok_access_token = null;
                await set.save();
                log(`tiktok tokens removed at ${(new Date().getHours() < 13 ? new Date().getHours() + ' AM' : (new Date().getHours() - 12) + ' PM')}`);
            } catch (error) {
                console.log(error);
            }
        }
        await deleteTokens();
    }
}
async function updateLinkedin(params) {
    try {
        let settings = await Settings.findOne({});
        if (!settings) throw 'their is no settings'
        if (!settings.linkedin_refresh_token || !settings.linkedin_access_token_status) namedErrorCatching('auth_error', 'there is no linkedin_refresh_token');

        let linkedin=new Linkedin({
            key:LINKEDIN_KEY,
            secret :LINKEDIN_SECRET,
            redirect_uri:LINKEDIN_REDIRECT_URI
        });
       
        let {access_token,refresh_token}=await linkedin.exchangeAccessToken(settings.linkedin_refresh_token);

        await Settings.findOneAndUpdate({}, {
            linkedin_access_token_status:true,
            linkedin_access_token :access_token,
            linkedin_refresh_token :refresh_token
        })
        .then(e => log('linkedin data updated at '+(new Date().getHours()  < 13? new Date().getHours()+ ' AM':(new Date().getHours()-12)+' PM' )))
        .catch(e => {throw 'linkedin error , bugs in linkedin.exchangeAccessToken'})
    } catch (error) {
        console.error(error);
        async function deleteLinkedinData(params) {
            await Settings.findOneAndUpdate({}, {
                linkedin_access_token :null,
                linkedin_access_token_status:false,
                linkedin_refresh_token :null,
                // linkedin_organization :null
            }).then(e => log('linkedin data deleted at' +(new Date().getHours()  < 13? new Date().getHours()+ ' AM':(new Date().getHours()-12)+' PM' )));
        }
        return ;
    }
}
async function updateFacebook() { 
    try {
        let [status, status_instagram, access_token, page_access_token, ig_id, page_id, user_id] = await settingsAsArray(['fb_access_token_status', 'instagram_access_token_status', 'fb_access_token', 'fb_page_access_token', 'instagram_user_id', 'fb_page_id', 'fb_user_id']);
        
        if (!access_token || !status) throw 'there is no access_token'
        let fb=new Facebook({
            client_id :FACEBOOK_APP_ID,
            client_secret :FACEBOOK_APP_SECRET,
            redirect_uri :FACEBOOK_REDIRECT_URI,
            scope :[]
        });
        let new__access_token=await fb.exchangeAccessToken(access_token);
        let new__user_id=await fb.getUserID(new__access_token);
        let new__P=await fb.getPages(new__user_id, new__access_token);
        let
            new_page_id = new__P.id,
            new__page_access_token = new__P.access_token;
        let P=new fb.Page({
            pageid :new_page_id,
            page_accessToken : new__page_access_token
        })
        let new__ig_id=await P.getLinkedInstagramAccounts();

        await Settings.findOneAndUpdate({}, {
            fb_access_token_status: true,
            instagram_access_token_status: true,
            fb_access_token: new__access_token,
            fb_page_access_token: new__page_access_token,
            fb_page_id: new_page_id,
            fb_user_id: new__user_id,
            instagram_user_id: new__ig_id,
            instagram_token: new__access_token
        })
        .then(e => log('facebook tokens updated at ' +  (new Date().getHours()  < 13? new Date().getHours()+ ' AM':(new Date().getHours()-12)+' PM' )));

    } catch (error) {
        console.error(error);
        async function deleteFacebook(params) {
            try {
                let settings=await Settings.findOneAndUpdate({}, {
                    fb_access_token_status :false ,
                    instagram_access_token_status :false,
                    fb_access_token :null,
                    fb_page_access_token :null ,
                    fb_page_id :null,
                    fb_user_id :null,
                    instagram_user_id :null,
                    instagram_token :null
                })
                .then(e => log('facebook tokens and data are removed at '+(new Date().getHours()  < 13? new Date().getHours()+ ' AM':(new Date().getHours()-12)+' PM' )))
                
            } catch (error) {
                console.error(error);
            }
        }
        await deleteFacebook();
    }
}

export async function deleteImageUrlsAfter24Hour(req=express.request,res=express.response){
    try {
        res.sendStatus(204);
        let urls = await ImageUrl.find({});
        for (let i = 0; i < urls.length; i++) {
            const id = urls[i].id;
            if ((Date.now() - id)  > (24 *60*60*1000)) {
                await ImageUrl.findByIdAndDelete(urls[i]._id)
                .then(el => console.log('deleted image url id is ' + el._id))
                .catch(el => console.error(el));
            }
        }
    } catch (error) {
        console.error(error);
    }
}
