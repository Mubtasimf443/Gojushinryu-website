/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { connect } from "mongoose";
import { SDATABASE } from "./_lib/utils/env.js";
import Assets from "./_lib/models/Assets.js";
import Awaiter from "awaiter.js";


await connect(SDATABASE);


let ass=await Assets.find().where('type').equals('video')
for (let i = 0; i < ass.length; i++) {
    const element = ass[i];
    await Awaiter(100);
    element.id=Date.now();
    await element.save();
}



setTimeout(() => {
    throw new Error("error");

}, 10000);