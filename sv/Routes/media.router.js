/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */
/* By Allah's Marcy I will gain success , Insha Allah*/

import { Router } from "express";
import YouTubeRouter from "../_lib/media/router.js/youtube.router.js";
import tiktokRouter from "../_lib/media/router.js/tiktok.router.js";
import { Settings } from "../_lib/models/settings.js";
import { log } from "string-player";
import { uploadVideoToMultimediaApi } from "../_lib/api/post.video.media.js";
// import twitterRouter from "../_lib/media/router.js/twitter.js";
import linkedinRouter from "../_lib/media/router.js/linkedin.js";
import fb_media_router from "../_lib/media/router.js/facebook.router.js";
import instagramRouter from '../_lib/media/router.js/instagram.router.js'
import morgan from "morgan";
import { uploadImagesToMultimediaApi } from "../_lib/api/post.image.media.js";
import { APP_AUTH_TOKEN } from "../_lib/utils/env.js";
import postFeed from "../_lib/api/post.feed.js";

let mediaRouter =Router();

mediaRouter.post('/upload-video', uploadVideoToMultimediaApi);
mediaRouter.post('/upload-images',uploadImagesToMultimediaApi );
mediaRouter.post('/upload/text',postFeed );

mediaRouter.use(morgan('dev'));
mediaRouter.get('/status', mediaStatus);


mediaRouter.use('/youtube', YouTubeRouter);
mediaRouter.use('/tiktok',tiktokRouter);
mediaRouter.use('/linkedin', linkedinRouter);
// mediaRouter.use('/twitter',twitterRouter)
mediaRouter.use('/facebook',fb_media_router );
mediaRouter.use('/instagram',instagramRouter);


export default mediaRouter


async function mediaStatus(req,res) {
    try {
        let settings=await Settings.findOne({});
        if (!settings) throw 'error , there is not settings'
        let { tiktok_access_token_status , youtube_access_token_status , linkedin_access_token_status, fb_access_token_status}=settings;
        return res.status(200).json({
            tiktok: tiktok_access_token_status ?? false,
            youtube: youtube_access_token_status ?? false,
            linkedin: linkedin_access_token_status ?? false,
            facebook: fb_access_token_status ?? false
        })
    } catch (error) {
        log({error});
        res.sendStatus(400)
    }
}