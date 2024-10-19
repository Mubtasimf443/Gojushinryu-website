/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { Settings } from "../models/settings.js";
import { repleCaracter } from "../utils/replaceCr.js";



export async function changeSettingsAPI(req,res) {
    try {
        let {
            date_of_womens_defence_class,
            date_of_regular_class,
            date_of_online_class,
            home_video_url
        }=req.body;
        date_of_womens_defence_class=await repleCaracter(date_of_womens_defence_class)
        date_of_regular_class=await repleCaracter(date_of_regular_class)
        date_of_online_class=await repleCaracter(date_of_online_class)
        await Settings.findOneAndUpdate({}, {
            date_of_womens_defence_class:{date:date_of_womens_defence_class},
            date_of_online_class:{date:date_of_online_class},
            date_of_regular_class:{date:date_of_regular_class},
            home_video_url
        });
        return res.sendStatus(200)
    } catch (error) {
        console.log({
            error
        });  
        return res.sendStatus(400)   
    }
}