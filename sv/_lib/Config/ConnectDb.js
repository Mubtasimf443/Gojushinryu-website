/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
Insha Allah,  By his marcy I will Gain Success 
*/

import mongoose from "mongoose";
import { log } from "../utils/smallUtils.js";
import { SDATABASE, TEST_DATABASE } from "../utils/env.js";


export const connectDB = async() => {
    try {
       await mongoose.connect(SDATABASE);
       console.log('db connected....');
    } catch (error) {
        log(error);
    }  
}
