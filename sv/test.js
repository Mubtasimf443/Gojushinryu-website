/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import Tiktok from 'lib-tiktok-api'
import { Settings } from './_lib/models/settings.js';
import { connectDB } from './_lib/Config/ConnectDb.js';
import { ImageUrl } from './_lib/models/imageUrl.js';
import { log } from 'string-player';
import mongoose from 'mongoose';
import { DATABASE, SDATABASE } from './_lib/utils/env.js';
import { User } from './_lib/models/user.js';
import Awaiter from 'awaiter.js';
import { settingsAsString } from './_lib/model_base_function/Settings.js';


await mongoose.connect(SDATABASE);

async function name(params) {
    
    console.log({gst_rate});
    throw new Error("error");
    
}

name()