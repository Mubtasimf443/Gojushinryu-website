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
import mongoose from "mongoose";
import Saminars from "./_lib/models/Saminar.js";
const require=createRequire(import.meta.url);
await connectDB();
await Saminars.create(require('./s.json'))

process.exit()