/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { request, response } from "express";
import { Settings } from "../models/settings.js";
import { repleCaracter } from "../utils/replaceCr.js";
import catchError, { namedErrorCatching } from "../utils/catchError.js";



export async function changeSettingsAPI(req=request, res=response) {
    try {
        let {
            date_of_womens_defence_class,
            date_of_regular_class,
            date_of_online_class,
            home_video_url,
            fees_of_reqular_class,
            fees_of_Bhangra_fitness,
            gst_rate
        } = req.body;
      
        [ fees_of_Bhangra_fitness,fees_of_reqular_class , gst_rate]=[Number(fees_of_Bhangra_fitness) ,Number(fees_of_reqular_class) ,Number(gst_rate)];

        if ( !home_video_url || typeof home_video_url !== 'string')  namedErrorCatching('parameter error', 'home_video_url is not correct');
        if (testDate(date_of_online_class) === false) namedErrorCatching('parameter error', 'date_of_online_class is not correct');
        if (testDate(date_of_regular_class) === false) namedErrorCatching('parameter error', 'date_of_regular_class is not correct');
        if (testDate(date_of_womens_defence_class) === false)namedErrorCatching('parameter error', 'date_of_womens_defence_class is not correct');
       
        if (fees_of_Bhangra_fitness.toString()==='NaN' ) return alert('fees_of_Bhangra_fitness should be a number');
        if (fees_of_reqular_class.toString()==='NaN' ) return alert('fees_of_reqular_class should be a number');
        if (gst_rate.toString()==='NaN' ) return alert('gst_rate should be a number');
        if (gst_rate > 75 || gst_rate < 1) return alert('gst rate should be bigger than 0 and greated than 75');


        await Settings.findOneAndUpdate({}, {
            date_of_womens_defence_class: { date: date_of_womens_defence_class },
            date_of_online_class: { date: date_of_online_class },
            date_of_regular_class: { date: date_of_regular_class },
            home_video_url,
            gst_rate,
            fees_of_Bhangra_fitness,
            fees_of_reqular_class
        });

        return res.sendStatus(200);
    } catch (error) {
        catchError(res ,error);
    }
}

function testDate(date = '') {
    if (date === '') return false;
    let array = date.split(',');
    for (let i = 0; i < array.length; i++) {
        const el = array[i];
        if (Number(el).toString() === 'NaN') return false;
        if (Number(el) < 0 || Number(el) > 6) return false;
    }
    return array;
}
