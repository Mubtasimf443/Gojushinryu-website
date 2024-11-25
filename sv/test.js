import { log } from "string-player";
import { Events } from "./_lib/models/Event.js";
import {connectDB} from './_lib/Config/ConnectDb.js'
/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

await connectDB()
Events.find({})
.then(async function (events) {
    log('events loaded');
    log(events);
    for (let i = 0; i < events.length; i++) {
        const element = events[i];
        element.participatingCountry=Math.floor(Math.random()*50);
        element.participatingAtletes=Math.floor(Math.random()*150);
        element.organizerCountry='Canada'
        await element.save().then(data=> log('data is saved '));
    }
})