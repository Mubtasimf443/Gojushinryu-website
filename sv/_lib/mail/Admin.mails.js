/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/
import { ADMIN_EMAIL, FROM_EMAIL } from "../utils/env.js";
import { mailer } from "../utils/mailer.js";

export async function AdminAuthEmail(otp) {
    try {
        mailer.sendMail({
            subject:'Cpanal Otp',
            from:FROM_EMAIL,
            to :ADMIN_EMAIL,
            text :'Your Otp is '+ otp,
        })
        return true
    } catch (error) {
        return false
    }
    
}