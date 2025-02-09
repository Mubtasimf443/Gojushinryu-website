/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import path, { resolve } from "path";
import { connectDB } from "./_lib/Config/ConnectDb.js";
import { Product } from "./_lib/models/Products.js";
import fs from 'fs'
import { fileURLToPath } from "url";
import { log } from "console";
import { createRequire } from "module";
import SocialMediaMail from "./_lib/mail/social.media.email.js";

// await SocialMediaMail.reports.images("My Training Session" , { 
//     facebook: true,
//     linkedin: false,
//     instagram: true,
//     tiktok: false,
//     youtube: true,
//     twitter: false
// });

// await SocialMediaMail.reports.videos("Karate Training Session", {
//     facebook: true,
//     linkedin: false,
//     instagram: true,
//     tiktok: true,
//     youtube: true,
//     twitter: false
//  });

await SocialMediaMail.reports.texts("Motivational Quote", {
   facebook: true,
   linkedin: true,
   twitter: false
});
process.exit()