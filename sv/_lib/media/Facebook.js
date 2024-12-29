
/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { log } from "string-player";
import fetch from "node-fetch";
import catchError, { namedErrorCatching } from "../utils/catchError.js";


export default class Facebook {
    constructor({ client_id, redirect_uri, scope, client_secret }) {
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.redirect_uri = redirect_uri;
        this.scope = scope instanceof Array ? scope : ['publish_video', 'pages_read_engagement', 'pages_manage_metadata', 'pages_manage_posts', 'pages_show_list', 'instagram_basic', 'instagram_content_publish', 'instagram_manage_insights', 'read_insights', 'business_management', 'pages_read_user_content'];
    }
    getAuthUrl = function (params) {
        let redirect_uri = this.redirect_uri, client_id = this.client_id, scope = this.scope.join(',');
        let authurl = (`https://www.facebook.com/v21.0/dialog/oauth?` + (new URLSearchParams({
            client_id,
            redirect_uri,
            scope,
            state: 'csrf_token',
        })).toString());

        return authurl;

    }
    getAccessToken = async function (code) {
        let object = {
            client_id: this.client_id,
            redirect_uri: this.redirect_uri,
            client_secret: this.client_secret,
            code,
        };
        // console.log(object);

        let params = (new URLSearchParams(object)).toString();

        let response = await fetch('https://graph.facebook.com/v21.0/oauth/access_token?' + params);
        response = await response.json();
        if (response.error || !response.access_token) throw (response.error ? response.error : response);
        return response.access_token
    }
    exchangeAccessToken = async function (fb_exchange_token) {
        let
            grant_type = 'fb_exchange_token',
            client_id = this.client_id,
            client_secret = this.client_secret;
        let params = (new URLSearchParams({
            client_id,
            fb_exchange_token,
            client_secret,
            grant_type
        })).toString();
        log({params});
        let res = await fetch(`https://graph.facebook.com/v21.0/oauth/access_token?`+params);
        res = await res.json().catch(() => ({ error: 'can not parse json data' }));
        log(res)
        if (res?.error) namedErrorCatching('exchange token error', res?.error);
        if (res?.access_token) return res.access_token;
        throw res;
    }
    getUserID = async function (access_token) {
        let response = await fetch(`https://graph.facebook.com/me?access_token=${access_token}`);
        response = await response.json();
        // console.log(response);
        if (response.error || !response.id) throw (response.error ? response.error : response);
        return response.id;
    }
    getPages = async function (user_id, access_token) {
        let response = await fetch(`https://graph.facebook.com/v21.0/${user_id}/accounts?access_token=${access_token}`);
        response = await response.json();
        // log(response);
        if (response.error || !response.data) throw (response.error ? response.error : response);
        if (response.data.length === 0 || !response.data[0].access_token) throw 'User has No Page , please create a page'
        if (response.data[0].access_token) {
            let id = response.data[0].id,
                access_token = response.data[0].access_token;
            return { id, access_token }
        }
    }
    Page = Page
}

class Page {
    constructor({ pageid, page_accessToken }) {
        if (!pageid) namedErrorCatching('Class Page error', "page id is not define")
        if (!page_accessToken) namedErrorCatching('Class Page error', "page access Token id is not define")
        this.pageid = pageid;
        this.page_accessToken = page_accessToken;
    }
    uploadVideo = async function ({ file_url, description }) {
        let access_token = this.page_accessToken;
        let params = (new URLSearchParams({
            access_token,
            file_url,
            description,
            published: true
        })).toString();
        let response = await fetch(`https://graph.Facebook.com/v21.0/me/videos?${params}`, { method: 'POST' });
        response = await response.json();
        // log(response);
        if (response.id) return response.id;
        if (response.error) namedErrorCatching('videoUpload error', response.error);
        if (!response.id) namedErrorCatching('videoUpload error', response);
    }

    uploadPhoto = async function (url) {
        let access_token = this.page_accessToken, pageid = this.pageid;
        let params = (new URLSearchParams({
            published: false,
            url: url,
            access_token
        })).toString()
        let response = await fetch('https://graph.facebook.com/v21.0/' + pageid + '/photos?' + params, { method: 'POST' });
        response = await response.json();
        if (response.error) throw response.error
        if (!response.id) throw response
        return { media_fbid: response.id }
    }

    postWithImages = async function (images, caption) {
        let access_token = this.page_accessToken, pageid = this.pageid;

        let response = await fetch('https://graph.facebook.com/v21.0/' + pageid + '/feed', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                published: true,
                message: caption,
                attached_media: images.map(image => {
                    return { media_fbid: image.media_fbid }
                }),
                access_token
            })
        });
        response = await response.json();
        if (response.error) throw response.error
        if (!response.id) throw response
        return response.id;
    }

    getLinkedInstagramAccounts = async function () {
        let page_id = this.pageid, access_token = this.page_accessToken;
        let response = await fetch(`https://graph.facebook.com/v21.0/${page_id}?fields=instagram_business_account&access_token=${access_token}`);
        response = await response.json();

        if (response.error && response.error?.message) throw response.error.message;
        if (response.error) throw response.error;
        if (!response.instagram_business_account) throw 'No Instagram Account Linked';
        if (!response.instagram_business_account?.id) throw 'No Instagram Account Linked';

        return response.instagram_business_account.id;
    }
}



