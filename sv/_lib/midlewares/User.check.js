/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import jwt from 'jsonwebtoken' ;
import { User } from '../models/user.js'
import { Alert, log } from '../utils/smallUtils.js';
import { JWT_SECRET_KEY } from '../utils/env.js';


 const userCheck = async (req,res,next) => {
    let {rft} =req.cookies;
    if (!rft) return Alert('You can not access this page , Please login')
    await jwt.verify(rft,JWT_SECRET_KEY,async (err,data) => {
        if (err) {
            log(err)
            return Alert('Access denied',res);
        }
        if (data ) {
           let {email} =data;
           if (!email) return res.clearCookie('rft').status(401).json({error :'You can not access this feature'})
           let user= await User.findOne({email}) ;
           if (!user) return Alert('You can not access this feature',res);
           if (user) { 
            req.user_email=email ;
            next()
        }
        }
    }) ;
}


export default userCheck
