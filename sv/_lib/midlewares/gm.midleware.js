/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { GM } from "../models/GM.js";
import jwt from 'jsonwebtoken'
import { Alert, log } from "../utils/smallUtils.js";
import { JWT_SECRET_KEY } from "../utils/env.js";

export async function checkGM(req,res,next) {
    let {gm_cat} =req.cookies;
    if (!gm_cat) return Alert('You can not access this page , Please login')
    await jwt.verify(gm_cat,JWT_SECRET_KEY,async (err,data) => {
        if (err) {
            log(err)
            return res.sendStatus(400)
        }
        if (data ) {
           let {email} =data;
           if (!email) return res.clearCookie('gm_cat').status(401).json({error :'You can not access this feature'})
           let user= await GM.findOne({email}) ;
           if (!user) return Alert('You can not access this feature',res);
           if (user) { 
            req.gm_info = user;
            next();
        }
        }
    }) 
}