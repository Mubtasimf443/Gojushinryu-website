/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
Insha Allah,  By his marcy I will Gain Success 
*/

import mongoose from "mongoose";
import { log } from "../utils/smallUtils.js";
import { SDATABASE, TEST_DATABASE } from "../utils/env.js";


export async function connectDB() {
    await mongoose.connect(SDATABASE).catch(error => console.error(error));  
}
