/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah
By Allah's Marcy I will gain success , Insha Allah
*/

import { query, Router } from "express";
import { LINKEDIN_KEY,LINKEDIN_SECRET,LINKEDIN_REDIRECT_URI, LINKEDIN_PERSON_URN } from "../../utils/env.js";
import {createRequire} from 'module'
import { log } from "string-player";
import { Settings } from "../../models/settings.js";
import { existsSync, fstat, readFileSync } from "fs";
import { settingsAsArray } from "../../model_base_function/Settings.js";
import catchError, { namedErrorCatching } from "../../utils/catchError.js";
import Linkedin from "../Linkedin.js";
import path, { dirname } from "path";
const require=createRequire(import.meta.url);
const axios = require('axios');

import { fileURLToPath } from "url";

const __dirname=dirname(fileURLToPath(import.meta.url));
const linkedinRouter=Router();

linkedinRouter.post('/uplaod/images',uploadImages);
linkedinRouter.post('/upload/video',async function (req,res) {
    try {
        let 
        title = (typeof req.body.title === 'string' ? req.body.title : ''),
        video = (typeof req.body.video === 'string' ? req.body.video : ''),
        [accessToken,accessTokenStatus, organization] =await settingsAsArray(["linkedin_access_token", "linkedin_access_token_status","linkedin_organization"]),
        linkedin=new Linkedin({});
        if (!accessTokenStatus || !accessToken || !organization) return res.sendStatus(401);
        if (!title) namedErrorCatching('perameter-error', 'title is emty');
        if (!video) namedErrorCatching('perameter-error', 'video is emty');
        video = path.resolve(__dirname, `../../../temp/video/${video}`);
        if (!existsSync(video)) namedErrorCatching('perameter-error', "video does not exist");
        let {asset,uploadUrl}=await linkedin.page.initVideo({
            accessToken,
            organization_urn:organization
        });
        await linkedin.page.uploadVideo(uploadUrl,readFileSync(video),accessToken);
        let id =await linkedin.page.finishVideoUpload(asset,accessToken,organization,title);
        return res.sendStatus(201);
    } catch (error) {
        catchError(res,error);
    }
} );
linkedinRouter.post('/upload/feed', )


export default linkedinRouter

async function uploadImages(req,res) {
    try {
        let 
            images = (req.body.images instanceof Array ? req.body.images : []),
            title = (typeof req.body.title === 'string' ? req.body.title : ''),
            [accessToken,accessTokenStatus, organization] =await settingsAsArray(["linkedin_access_token", "linkedin_access_token_status","linkedin_organization"]);
        if (!accessTokenStatus || !accessToken || !organization) return res.sendStatus(401);
        if (images.length === 0) namedErrorCatching('perameter-error', 'images is a emty array');
        if (!title) namedErrorCatching('perameter-error', 'title is emty');
        let linkedin=new Linkedin({});
        let mediaData=await linkedin.page.initAndUploadMultipleImages({
            accessToken ,
            organization,
            images,
            title
        });
        await linkedin.page.postWithMedia(accessToken,organization,mediaData,title);
        return res.sendStatus(201);
    } catch (error) {
        catchError(res,error)
    }
}