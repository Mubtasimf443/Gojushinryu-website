/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import path, { resolve } from "path";
import request, { GET, POST } from "../utils/fetch.js";
import fs from 'fs'
import { fileURLToPath } from "url";
import { log } from "string-player";
import catchError, { namedErrorCatching } from "../utils/catchError.js";
import fetch from "node-fetch";
const __dirname =path.dirname(fileURLToPath(import.meta.url));
export default  class Linkedin {
    constructor({key ,secret,redirect_uri}) {
        this.key=key;
        this.secret=secret;
        this.redirect_uri=redirect_uri;
    }
    getUserURN=async function getUserURN(access_token) {
        try {
            let response = await request.get('https://api.linkedin.com/v2/me', {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                }
            });
            if (!response.id ||!response.vanityName || response.error ) throw (!response.id ? response : response.error)
            return ({
                urn: `urn:li:person:${response.vanityName}`,
                id :response.id
            })
        } catch (error) {
            console.log(error);
            throw 'user urn gaining error'
        }
    }
    exchangeAccessToken=async function (accessToken,refreshToken) {
        
    }
    page={
        initVideo:async function ({accessToken, organization_urn}) {
            let response = await request.post(
                'https://api.linkedin.com/v2/assets?action=registerUpload',
                {
                    registerUploadRequest: {
                        owner: organization_urn,
                        recipes: ['urn:li:digitalmediaRecipe:feedshare-video'],
                        serviceRelationships: [
                            {
                                relationshipType: 'OWNER',
                                identifier: 'urn:li:userGeneratedContent',
                            },
                        ],
                        supportedUploadMechanism: ['SYNCHRONOUS_UPLOAD'],
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

           
            if (response.error || !response.value || !response.value?.asset) {
                log(response)
                if (response.error) log(response.error)
                throw (response.error ? response.error : response)
            }

            let 
            asset=response.value.asset ,uploadUrl= response.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;
            return {
                uploadUrl ,
                asset
            }
        },
        uploadVideo: async function (url, buffer, accessToken) {
            log('upload...')
            let isUploaded = await fetch(url, {
                body: buffer,
                headers: {
                    'Content-Type': 'application/octet-stream',
                    Authorization: `Bearer ${accessToken}`,
                },
                method: 'PUT'
            })
            .then(response => {
                let isUploaded=(response.status < 300);
                if (!isUploaded ) throw 'failded to upload the video'
            });
        },
        finishVideoUpload:async function (asset,accessToken,organization,title,visibility="PUBLIC" ) {
            log('finish...')
            let response = await request.post(
                'https://api.linkedin.com/v2/ugcPosts',
                {
                    author: organization, // Your organization URN
                    lifecycleState: 'PUBLISHED',
                    specificContent: {
                        "com.linkedin.ugc.ShareContent": {
                            shareCommentary: {
                                text: title
                            },
                            shareMediaCategory: "VIDEO",
                            media: [
                                {
                                    status: "READY",
                                    description: {
                                        text:  title
                                    },
                                    media:asset, // Video asset URN
                                    title: {
                                        text:title
                                    }
                                }
                            ]
                        }
                    },
                    visibility: {
                        "com.linkedin.ugc.MemberNetworkVisibility": visibility
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (!response.id) {
                throw response
            }
            return response.id
        },
        postVideo:async function (accessToken,organization,buffer,title,visibility="PUBLIC") {
            if (!accessToken) throw 'accessToken is undefined'
            if (!organization) throw 'organization is undefined'
            if (!buffer) throw 'buffer is undefined'
            if (!title) throw 'title is undefined'
            let {asset,uploadUrl}=await this.initVideo(accessToken,organization);
            await this.uploadVideo(uploadUrl,buffer,accessToken);
            let id=await this.finishVideoUpload(asset,accessToken,organization,title,visibility);
            // log(id)
            return id
        },
        initImage:async function (accessToken,organization) {
            let response = await request.post(
                'https://api.linkedin.com/v2/assets?action=registerUpload',
                {
                    registerUploadRequest: {
                        owner: organization, // Replace with your organization URN
                        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
                        serviceRelationships: [
                            {
                                relationshipType: 'OWNER',
                                identifier: 'urn:li:userGeneratedContent',
                            },
                        ],
                        supportedUploadMechanism: ['SYNCHRONOUS_UPLOAD'],
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            if (response.error || !response.value || !response.value?.asset ) {
                throw (response.error ? response.error : response);
            }
            
            let 
            uploadUrl=response.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl,
            asset=response.value.asset;

            return {
                asset,
                uploadUrl
            }
    
        },
        uploadImage: async function (uploadUrl ,buff, accessToken) {
            await fetch(uploadUrl, {
                method: 'PUT',
                body: buff,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/octet-stream',
                }
            })
                .then(
                    function (response) {
                        if (response.status > 299 || response.status < 200) {
                            throw 'failed to upload video ... and response code is ' + response.status
                        }
                    }
                )
        },
        finishSignleImagesUpload:async function ({accessToken,title,asset,organization,visibility}) {
            let response = await request.post(
                'https://api.linkedin.com/v2/ugcPosts',
                {
                    author: organization, // Your organization URN
                    lifecycleState: 'PUBLISHED',
                    specificContent: {
                        "com.linkedin.ugc.ShareContent": {
                            shareCommentary: {
                                text: title
                            },
                            shareMediaCategory: "IMAGE",
                            media: [
                                {
                                    status: "READY",
                                    description: {
                                        text:title
                                    },
                                    media: asset, // Image asset URN
                                    title: {
                                        text: title
                                    }
                                }
                            ]
                        }
                    },
                    visibility: {
                        "com.linkedin.ugc.MemberNetworkVisibility": visibility ?? "PUBLIC"
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (!response.id || response.error) {
                throw (response.error ?? response );
            }
            return response.id ;
        },
        initAndUploadMultipleImages:async function ({accessToken,images,organization,title}) {
            let mediaData=[];
            for (let i = 0; i < images.length && i <= 5; i++) {
                let img=path.resolve(__dirname, `../../temp/images/${images[i]}`);
                let exist=fs.existsSync(img);
                if (!exist) namedErrorCatching('imageinit error' , `image does not exits and path is ${img}`);
                let buff=fs.readFileSync(img);
                let {asset,uploadUrl}=await this.initImage(accessToken,organization);
                await this.uploadImage(uploadUrl,buff,accessToken);
                mediaData.push({
                    status: "READY",
                    description: {
                        text: title
                    },
                    media: asset, 
                    title: {
                        text: title
                    }
                })
            }
            return mediaData
        },
        postWithMedia:async function (accessToken, organization, media,title ,visibility) {
            let response = await request.post(
                'https://api.linkedin.com/v2/ugcPosts',
                {
                    author: organization, // Your organization URN
                    lifecycleState: 'PUBLISHED',
                    specificContent: {
                        "com.linkedin.ugc.ShareContent": {
                            shareCommentary: {
                                text: title
                            },
                            shareMediaCategory: "IMAGE",
                            media: media
                        }
                    },
                    visibility: {
                        "com.linkedin.ugc.MemberNetworkVisibility": visibility ?? "PUBLIC"
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            )
            if (!response.id || response.error) {
                namedErrorCatching('failed to post media with images' ,response.error ?? response );
            }
            return response.id ;
        },
        uploadTEXT:async function ({accessToken,organization,text,visibility}) {
            let response = await request.post(
                'https://api.linkedin.com/v2/ugcPosts',
                {
                    author: organization, // Your organization URN
                    lifecycleState: 'PUBLISHED',
                    specificContent: {
                        "com.linkedin.ugc.ShareContent": {
                            shareCommentary: {
                                text: text
                            },
                            "shareMediaCategory": "NONE"
                        }
                    },
                    visibility: {
                        "com.linkedin.ugc.MemberNetworkVisibility": visibility ?? "PUBLIC"
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.id) return response.id;
            if (!response.id && response.error) throw response.error;
            throw response;
            
        }
    }
}