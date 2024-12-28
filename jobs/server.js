/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/


import express from 'express'
import Main from './jobs.js';
import { log } from 'string-player';
import { connectDB } from './controllars/ConnectDb.js';


const app =express();
await connectDB();

app.get('/main',async function (req,res) {
    try {
        res.status(200).send('success fully tokens are being updated Alhamdulillah');
        log('event triger on ' + (new Date().getHours()  < 13? new Date().getHours()+ ' AM':(new Date().getHours()-12)+' PM'  ));
        await Main();
    } catch (error) {
        console.error(error);
    }
});



app.listen(3000 ,e => log('thank you Allah') )