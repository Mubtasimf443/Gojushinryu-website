/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/


import { ADMIN_EMAIL, FROM_EMAIL,ORGANIZATION_NAME } from "../utils/env.js";
import { mailer } from "../utils/mailer.js";
import { log } from "../utils/smallUtils.js";
import { returnMailh2, returnMailParagraph } from "./components.js";





export async function notifyMail( {title,massage,to}) {
    try {
        await mailer.sendMail({
            from:FROM_EMAIL,
            to, 
            subject:'Notification : '+title,
            html : ` <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                       <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                          <h2 style="color: #ffaa1c; text-align: center;">${title}</h2>
                          <p>
                          Dear Student,<br><br>
                          ${massage}
                          
                          <br><br>Thank you.
                          </p>
                          <p>Best regards,<br>The ${ORGANIZATION_NAME} Team</p>
                       </div>
                    </div>
                `
        })
        return true
    } catch (error) {
        console.log(error);
        return false
    }
}
