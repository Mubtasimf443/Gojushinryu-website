/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

import { log } from "string-player";
import { ADMIN_EMAIL, FROM_EMAIL } from "../utils/env.js";
import { mailer } from "../utils/mailer.js";



export async function representativeJoiningMail(options) {
    try {
       let {to,name,country}=options;
       await mailer.sendMail({
          from:FROM_EMAIL,
          to:to,
          subject :"Notification",
          html :`
          <h3>
          Hello , 
          Thanks for applying to The School of Traditional Martial Arts for becoming a country representative for ${country} , the admin will review your request
          <br>
          Thank's For Appllying <br>
          ${name}
          </h3>
          ` 
       });
       return true
    } catch (error) {
       console.error(error);
       return false
    }
 }
 
 export  async function representativeJoiningAllertEmailForAdmin() {
    
    try {
       await mailer.sendMail({
          from:FROM_EMAIL,
          to:ADMIN_EMAIL,
          subject :"Notification",
          html :`
          <h3>
           A new User has requested to become a country representattive , please review and approve 
          </h3>
          ` 
       });
       return true
    } catch (error) {
       console.error(error);
       return false
    }
 }