/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/


import { ADMIN_EMAIL, FROM_EMAIL } from "../utils/env.js";
import { mailer } from "../utils/mailer.js";
import { log } from "../utils/smallUtils.js";
import { returnMailh2, returnMailParagraph } from "./components.js";





export async function notifyMail( {title,massage,to}) {
    try {
        await mailer.sendMail({
            from:FROM_EMAIL,
            to, 
            subject:title,
            html :`<div style="min-width:  fit-content;background-color:white;margin: 0px;padding: 35px 1em;row-gap: 17px;box-sizing: border-box;min-height:fit-content;">
             <h1>${title}</h1
             ><p>${massage}</p>
             </div>`
        })
        return true
    } catch (error) {
        console.log(error);
        return false
    }
}
