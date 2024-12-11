/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah
By Allah's Marcy I will gain success , Insha Allah
*/

import { Router } from "express";
import { redirectionURLFunction, testVideoUpload, tiktokCallback, videoUploadTiktok } from "../tiktok.js";
import morgan from "morgan";


const TikTokRouter =Router();

TikTokRouter.get('/callback',tiktokCallback)
TikTokRouter.get('/get-code', (req, res) => res.redirect(redirectionURLFunction()))
TikTokRouter.get('/refresh', () => {})
TikTokRouter.post('/video-upload',morgan('dev'), videoUploadTiktok);
TikTokRouter.get('/test-video-uplaod', testVideoUpload)
export default TikTokRouter;