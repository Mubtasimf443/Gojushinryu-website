/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/


import express from 'express'
import Main, { deleteImageUrlsAfter24Hour,  } from './jobs.js';
import { log } from 'string-player';
import { connectDB } from './controllars/ConnectDb.js';
import fetch from 'node-fetch';
import morgan from 'morgan';
import { notifyAboutNotPaidStudents, requestCourseEnrollMentPayment } from './controllars/model_base_function/course.enrolment.js';
import { deleteSpamOrders } from './controllars/model_base_function/order.js';
import { deleteOldGrandMasterChats } from './controllars/api/deleteOldGrandMasterMessage.js';

/* git add .; git commit -m 'course enrollment setup by buyer requirement done ' ; git push origin main */
const app =express();
await connectDB();
app.use(morgan('dev'));

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

app.get('/delete-image-url-after-24-hours', deleteImageUrlsAfter24Hour);
app.get('/monthly-payment-request',requestCourseEnrollMentPayment);
app.get('/notify-about-no-paid-students',notifyAboutNotPaidStudents);
app.delete('/delete-all-spam-orders', deleteSpamOrders)
app.route('/delete/old/gm-chats').delete(deleteOldGrandMasterChats);
app.listen(3000 ,e => log('thank you Allah') );