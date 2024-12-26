/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { log } from "string-player";
import { connectDB } from "./controllars/ConnectDb.js";
import { namedErrorCatching } from "./controllars/error.handle.js";
import request from "./controllars/fetch.js";
import Settings from "./controllars/settings.js";
import { setSettings } from "./controllars/settings.util.js";




Main();
async function Main() {
    try {
        await connectDB();
        setSettings(last_modification_date , Date.now()).then(E => log('last_modification_date updated'));
    } catch (error) {
        console.error(error);
    }
}

