/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { connectDB } from "./controllars/ConnectDb.js";
import Mails from "./controllars/mails/social_media_mail.js";
import Settings from "./controllars/settings.js";



await connectDB();
let settings = await Settings.findOne({});
let d = Date.now() - 8.05 * 3600 *1000;
// settings.noticeData.social_media.not_connected.mails.youtube.dateNum=d;
// settings.noticeData.social_media.not_connected.mails.facebook.dateNum=d;
// settings.noticeData.social_media.not_connected.mails.instagram.dateNum=d;
// settings.noticeData.social_media.not_connected.mails.linkedin.dateNum=d;
// settings.noticeData.social_media.not_connected.mails.tiktok.dateNum=d;
// settings.noticeData.social_media.not_connected.mails.x_twitter.dateNum=d;
// await settings.save();
await Mails.notConnected.youtube();
await Mails.notConnected.facebook();
await Mails.notConnected.Instagram();
await Mails.notConnected.X_Twitter();
await Mails.notConnected.LinkedIn();
await Mails.notConnected.titkok();
process.exit()