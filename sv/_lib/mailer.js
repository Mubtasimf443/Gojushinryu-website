/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/



import nodemailer from 'nodemailer'
import { log } from './smallUtils.js'
import { MAIL_HOST, MAIL_PORT, MAIL_USER ,MAIL_PASS} from './env.js'



export const mailer =  nodemailer.createTransport({
    host :MAIL_HOST,
    port :MAIL_PORT,
    secure :true,//if port is 465 then true
    auth:{
        user :MAIL_USER,
        pass :MAIL_PASS
    }
})
