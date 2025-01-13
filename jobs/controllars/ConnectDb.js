/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
Insha Allah,  By his marcy I will Gain Success 
*/

import mongoose from "mongoose";
import { log } from "string-player";
import { DATABASE, TEST_DATABASE } from "../env.js";



export const connectDB = async() => {
    try {
       await mongoose.connect(TEST_DATABASE);
       console.log('db connect....');
    } catch (error) {
        log(error)
    }  
}
