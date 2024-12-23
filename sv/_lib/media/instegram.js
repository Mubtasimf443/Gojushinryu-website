/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import fetch from "node-fetch";
import Awaiter from "awaiter.js";
import catchError, { namedErrorCatching } from "../utils/catchError.js";


export default class Instagram {
    constructor({ accessToken, id }) {
        if (!accessToken) throw 'Access Token is Required';
        this.accessToken = accessToken;
        this.ig_id = id;
    }
    uploadSingleImage = async function ({ image_url, caption }) {
        let ig_id = this.ig_id, access_token = this.accessToken;
        let params = (new URLSearchParams({
            access_token,
            image_url,
            caption
        })).toString();
        let response = await fetch(`https://graph.facebook.com/v21.0/${ig_id}/media?${params}`, { method: 'POST' });
        response = await response.json();
        if (response.error) namedErrorCatching('init post error', response.error);
        if (!response.id) namedErrorCatching('init post error', response);
        params = new URLSearchParams({
            creation_id: response.id,
            access_token
        }).toString();
        response = await fetch(`https://graph.facebook.com/v21.0/${ig_id}/media_publish?${params}`, { method: 'POST' });
        response = await response.json();
        if (response.error) namedErrorCatching('init post error', response.error);
        if (!response.id) namedErrorCatching('init post error', response);
        return response.id
    }
    uploadCaruselImage = async function (image_url) {
        let ig_id = this.ig_id, access_token = this.accessToken;
        let params = new URLSearchParams({
            is_carousel_item: true,
            image_url ,
            access_token
        })
        let response = await fetch(`https://graph.facebook.com/v21.0/${ig_id}/media?${params.toString()}`, { method: 'POST' });
        response = await response.json();
        if (response.error) throw response.error
        if (!response.id) namedErrorCatching('init post error', response);
        return response.id
    }
    initCarusel = async function (carousel_contents, caption) {
        let access_token = this.accessToken, ig_id = this.ig_id ;
        let params = new URLSearchParams({
            caption,
            media_type: "CAROUSEL",
            children: carousel_contents,
            access_token: access_token
        });
        let response =await fetch(`https://graph.facebook.com/v21.0/${ig_id}/media?${params.toString()}`,{
            method :'POST'
        });
        response=await response.json();
        if (response.id) return response.id;
        if (response.error) namedErrorCatching('init post error', response.error);
        throw response;
    }
    publishCarusel = async function (creation_id) {
        let access_token = this.accessToken, ig_id = this.ig_id;
        let params = new URLSearchParams({
            creation_id: creation_id,
            access_token,
        });
        let response = await fetch(`https://graph.facebook.com/v21.0/${ig_id}/media_publish?${params.toString()}`, { method: 'POST' });
        response = await response.json();
        if (response.id) return response.id;
        if (response.error) namedErrorCatching('init post error', response.error);
        throw response;
    }
    uploadSingleImage = async function ({image_url, caption}) {
        let access_token = this.accessToken, ig_id = this.ig_id;
        let params = new URLSearchParams({
            image_url,
            caption,
            access_token,
        });
        params=params.toString();

        let response = await fetch(`https://graph.facebook.com/v21.0/${ig_id}/media?${params}`, { method: 'POST' });

        response = await response.json().then(data => data).catch(function () {
            return {
                error: "not a json response"
            }
        });

        if (response.id) return response.id;

        if (response.error) throw response.error
        throw response;

    }

    createCarusel = async function ({images,caption}) {
        let access_token = this.accessToken, ig_id = this.ig_id, carousel_contents=new Array();
        for (let i = 0; i < images.length; i++) {
            let id=await this.uploadCaruselImage(images[i]);
            carousel_contents.push(id);
        }
        let creation_id=await this.initCarusel(carousel_contents,caption);
        let post_id=await this.publishCarusel(creation_id);
        return post_id;
    }

    publishCreation=async function (creation_id) {
        let access_token = this.accessToken, ig_id = this.ig_id;
        let params = new URLSearchParams({
            creation_id: creation_id,
            access_token,
        });
        let response = await fetch(`https://graph.facebook.com/v21.0/${ig_id}/media_publish?${params.toString()}`, { method: 'POST' });
        response = await response.json();
        if (response.id) return response.id;
        if (response.error) namedErrorCatching('init post error', response.error);
        throw response;
    }

    uploadReel=async function ({video_url,caption}) {
        let access_token = this.accessToken, ig_id = this.ig_id;
        let params = (new URLSearchParams({
            video_url,
            caption,
            media_type: 'REELS',
            access_token
        })).toString();
        let response = await fetch(`https://graph.facebook.com/v21.0/${ig_id}/media?${params}`, { method: 'POST' }); 
        response = await response.json();
        if (response.id) return response.id;
        if (response.error) namedErrorCatching('upload reals error', response.error);
        throw response;
    }


    checkFinishUploadOrNot = async function (creation_id,limit) {
        limit = limit || 50;
        let access_token = this.accessToken, ig_id = this.ig_id;
        let params = (new URLSearchParams({
            fields: 'status_code',
            access_token,
        })).toString();
        async function check(params) {
            let response = await fetch(`https://graph.facebook.com/v21.0/${creation_id}?${params}`);
            response = await response.json();
            if (response.error) throw response.error;
            if (response.status_code === 'FINISHED') return true;
            if (response.status_code !== 'FINISHED') return false;
        }
        for (let i = 0; i <= limit; i++) {
            let status = await check(params);
            if (status) i+=limit;
            if (i===limit) throw 'Upload Failed';
            await Awaiter(3000);
        }
        return ;
    }


}


