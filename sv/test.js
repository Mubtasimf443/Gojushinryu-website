/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { config } from "dotenv";
import fs from 'fs'
import path, { dirname as d, resolve } from "path";
import { fileURLToPath as f } from "url";
const __d=d(f(import.meta.url));
process.env={};
config({path :resolve(__d, './d.env')});

console.log(process.env);
