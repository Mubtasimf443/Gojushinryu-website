/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
Insha Allah,  By his marcy I will Gain Success 
*/

import mongoose from "mongoose";
import { log } from "../utils/smallUtils.js";
import { SDATABASE } from "../utils/env.js";


export const connectDB = async() => {
    try {
       await mongoose.connect(SDATABASE);
       console.log('db connect');
    } catch (error) {
        log(error)
    }  
}
