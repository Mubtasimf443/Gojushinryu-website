/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { log } from "string-player";
import { connectDB } from "./controllars/ConnectDb.js";
import { namedErrorCatching } from "./controllars/error.handle.js";
import request from "./controllars/fetch.js";
import Settings from "./controllars/settings.js";
import { setSettings, setSettingsAsArray } from "./controllars/settings.util.js";




Main();
async function Main() {
    try {
        await connectDB();
        await setSettingsAsArray({
            keys :["last_modification_date", "last_modification_date_as_date", "last_modification_date_as_Number", "last_modification_date_as_Day", 'last_modification_date_as_Hour', 'last_modification_date_as_minute'],
            values :[new Date().getDate(),new Date() , Date.now(),new Date().getDay(),new Date().getHours(), new Date().getMinutes()]
        })
    } catch (error) {
        console.error(error);
    }
}

