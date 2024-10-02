/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import jwt from 'jsonwebtoken' ;
import { Admin } from '../models/Admin.js'
import { log } from '../smallUtils.js';
import { JWT_SECRET_KEY } from '../env.js';

const AdminCheckMidleware = async (req,res,next) => {
    let {cpat} =req.cookies;
    await jwt.verify(cpat,JWT_SECRET_KEY,async (err,data) => {
        if (err) {
            log(err)
            return Alert('Access denied',res);
        }
        if (data ) {
           let {key} =data;
           if (!key) return res.clearCookie('cpat').status(401).json({error :'You can not access this feature'})
           let admin= await Admin.findOne({Secret_Key:key}) ;
           if (!admin) return Alert('You can not access this feature',res);
           if (admin) next()
        }
    }) ;
}

export default AdminCheckMidleware
