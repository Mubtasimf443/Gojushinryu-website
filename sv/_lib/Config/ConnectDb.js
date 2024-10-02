/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
Insha Allah,  By his marcy I will Gain Success 
*/

import dotenv from "dotenv";
import mongoose from "mongoose";
import { log } from "../utils/smallUtils.js";
import { DATABASE, SDATABASE } from "../utils/env.js";

dotenv.config();


export const connectDB = async() => {
    mongoose.connect(SDATABASE)
    .then(e => log('Db connected'))
    .catch(e => log(e))
}
