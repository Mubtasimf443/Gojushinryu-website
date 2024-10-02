/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import { generatePin } from "../utils/generatePin.js";
import { forget_Password_Otp_Mail } from "../mail/user_auth.mail.js";
import { User } from "../models/user.js";
import { log } from "../utils/smallUtils.js";
import bcrypt from 'bcryptjs';


export const forgetPasswordOtpApi = async (req,res) => {
    //log('started')

    let {email }=req.body;
    if (!email.toString().includes('@')) return res.json({error:'email is not valid'})
    if (!email.toString().includes('.')) return res.json({error:'email is not valid'})
    if (email.toString().includes('"')) return res.json({error:'email is not valid'})
    if (email.toString().includes("'")) return res.json({error:'email is not valid'})
    if (email.toString().includes('{')) return res.json({error:'email is not valid'})
    if (email.toString().includes('}')) return res.json({error:'email is not valid'})
    //log('validation success')
    try {
    
    let user= await User.findOne({email}); 
    //log('user found')
    if (!user) return res.json({error:'No user exist using this email,Please change the mail or sign up'})
    let otp =await generatePin(1);
    let emailstatus= await forget_Password_Otp_Mail(email,otp);
    if (!emailstatus) return res.json({error:'email is not valid'})
    user.resetingThePassword=true;
    user.resetingThePasswordOTP=otp;
    await user.save() 
    .then(
        user => {
            //log('pin added')
            res.status(200).json({success:true})
           // log('success')
            setTimeout(() => {
                user.resetingThePassword=false;
                user.resetingThePasswordOTP=0;
               // log('deleted')
                user.save()
                .then(() => {})
                .catch(e => log(e))
            }, 100000);
        }
    )
    .catch(e => log(e))
  } catch (error) {
    log(error) 
  }
}
export async function forgetPasswordResetPassApi(req,res) {
    let {email,password ,otp}=req.body;
    if (!email.toString().includes('@')) return res.json({error:'email is not valid'})
    if (!email.toString().includes('.')) return res.json({error:'email is not valid'})
    if (email.toString().includes('"')) return res.json({error:'email is not valid'})
    if (email.toString().includes("'")) return res.json({error:'email is not valid'})
    if (email.toString().includes('{')) return res.json({error:'email is not valid'})
    if (email.toString().includes('}')) return res.json({error:'email is not valid'})
    if (password.toString().trim().length < 5 || password.toString().trim().length >25 )  return res.json({error:'password Should min 5 and max 25 character long'})
    if (password.toString().includes('"')) return res.json({error:'password is not valid'})
    if (password.toString().includes("'")) return res.json({error:'password is not valid'})
    if (password.toString().includes('{')) return res.json({error:'password is not valid'})
    if (password.toString().includes('}')) return res.json({error:'password is not valid'})
    if (typeof otp !== 'number') return res.json({error:'otp is not valid'})
    try {
        let user =await User.findOne({email});
        if (!user) return res.json({error:'email is not valid'})
        if (!user.resetingThePassword) return res.json({error:'Time Finished,Must give the otp in 60s'})
        if (!user.resetingThePasswordOTP) return res.json({error:'Time Finished,Must give the otp in 60s'})
        if (otp !== user.resetingThePasswordOTP) return res.json({error:'Otp did not match'})
        let bSalt=await bcrypt.genSalt(14)
        password =await bcrypt.hash(password,bSalt);
        user.password =password;
        user.resetingThePassword=true;
        user.resetingThePasswordOTP=0;
        await user.save()
        .then(user => {
            res.status(200).json({success :true})
        })
    } catch (e) {
        console.log(e);
        return res.json({error:'server error'})
    }
}