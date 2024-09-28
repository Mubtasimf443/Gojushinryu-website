/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */
/* By Allah's Marcy I will gain success , Insha Allah*/

import { Router } from "express";
import { signUpFunction } from "../_lib/auth/signup.auth.js";
import {checkSignUpData_for_user} from '../_lib/auth/check.data.js'
import jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY } from "../_lib/env.js";
import { User } from "../_lib/models/user.js";
import { user_sign_up_success_admin_mail, user_sign_up_success_user_mail } from "../_lib/mail/user_auth.mail.js";
import { log } from "../_lib/smallUtils.js";
let authRouter = Router();



authRouter.post('/user/sign-up',checkSignUpData_for_user,signUpFunction);
authRouter.post('/user/sign-up-otp-varification',(req,res)=>{
    let code =req.body.code;
    let {vft}= req.cookies.vft;
    if (!vft ) return res.status(400).json({error:'Time out! please signup again '});
    if (!code ) return res.status(400).json({error:'code is not valid'});
    if (typeof code !== 'number' ) return res.status(400).json({error:'code is not valid'});
    jwt.verify(vft,JWT_SECRET_KEY,(err,data)=>{
        if (err) return res.status(400).json({error:'error,bad request'});
        if (data) {
            let {email} =data;
            if (!email) return res.status(400).json({error:'error,bad request'});
            User.findOne({email}).then(data=>{
                if (!data) return res.status(400).json({error:'Time out! please signup again '});
                data.isRegistered=true;
                data.pin=0;
                return data.save()
            })
            .then(async( data) => {
               if (data.isRegistered) {
                 user_sign_up_success_admin_mail().then(()=>{}).catch((e)=>{log(e)});
                 user_sign_up_success_user_mail({to:email}).then(()=>{}).catch((e)=>{log(e)});
            
                 jwt.sign({
                    email, 
                    key:'oidissa89t3d78dsheuiw87r723212093edhdjskdtSDTQWDHSUISFSUXGCYSAUFADWLFLSDDFEIFJ'
                    //KEY is long for making it hard to decode for the hacker
                 },JWT_SECRET_KEY,{}).then(  rft=> {
                    res.cookie('rft'/*rft --refreash token */,rft,{
                        httpOnly:true,
                        sameSite:true,
                        expires:new Date(Date.now()+(1000*60*60*24*31))
                    }).status(201).json({
                        success:true
                    })
                 })
               }
            })
            .catch(e => {
                console.log(e);  
                res.status(500).json({error:'Error '});
            })

        }
    })
});



export default authRouter;