/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
Insha Allah,  By his marcy I will Gain Success 
*/

import dotenv from "dotenv";
import mongoose from "mongoose";
import { log } from "../smallUtils.js";
import { DATABASE } from "./env.js";

dotenv.config();


export const connectDB = async() => {
    mongoose.connect(DATABASE)
    .then(e => log('Db connected'))
    .catch(e => log(e))
}
