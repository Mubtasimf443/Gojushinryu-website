/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { fileURLToPath } from "url";
import { waidTillFileLoad } from "./index.js";
import path, { dirname, resolve } from 'path'
import { log } from "console";
let __dirname=dirname(fileURLToPath(import.meta.url))
log(
await waidTillFileLoad({
    filePath:resolve(__dirname, './readme.md'),
   
    maxWaitTime:8000,
})


)