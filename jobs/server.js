/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/


import express from 'express'
import Main, { deleteImageUrlsAfter24Hour } from './jobs.js';
import { log } from 'string-player';
import { connectDB } from './controllars/ConnectDb.js';
import fetch from 'node-fetch';


const app =express();
await connectDB();


app.get('/keep-live', async (req, res) => {
    try {
        res.status(202).send('suceess fully updating');
        let startingTime=(new Date().toTimeString().substring(0,8));
        let a= await (async function (params) {
            let awaitingtimeout ;

            await new Promise((resolve, reject) => {
                let time = 1000 * 60 * 5;
                awaitingtimeout = setTimeout(() => {
                    clearInterval()
                    resolve(true);
                }, time);
            });
            clearTimeout(awaitingtimeout);
            return ('ending is '+ (new Date().toTimeString().substring(0,8)));
        })();
        
        log(`starting is ${startingTime} and`+ a);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "server error" })
    }
})


app.get('/main',async function (req,res) {
    try {
        res.status(200).send('success fully tokens are being updated Alhamdulillah');
        log('event triger on ' + (new Date().getHours()  < 13? new Date().getHours()+ ' AM':(new Date().getHours()-12)+' PM'  ));
        await Main();
    } catch (error) {
        console.error(error);
        res.status(500).json({error :"server error"})
    }
});


app.get('/loop', function (req,res) {
   for (let i = 0; i < 1000; i++) {
       fetch('http://localhost:3000/keep-live').catch(e => console.error(e));
   }
   res.send('looping......')
});

app.get('/delete-image-url-after-24-hours', deleteImageUrlsAfter24Hour);

app.listen(3000 ,e => log('thank you Allah') )