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


await mongoose.connect(SDATABASE);

let array =await User.find();
for (let index = 0; index < array.length; index++) {
    const user = array[index];
    if (user.id ===undefined) {
        await Awaiter(1000);
        user.id=Date.now();
        await user.save();
        log('user id given')
    }
}
throw new Error("Err");

