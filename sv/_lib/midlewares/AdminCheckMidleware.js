/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import jwt from 'jsonwebtoken' ;
import { Admin } from '../models/Admin.js'
import { log } from '../utils/smallUtils.js';
import { JWT_SECRET_KEY } from '../utils/env.js';
import { validate } from 'string-player';
import catchError, { namedErrorCatching } from '../utils/catchError.js';

const AdminCheckMidleware = async (req, res, next) => {
    try {
        let { cpat } = req.cookies;
        if (validate.isUndefined(cpat)) namedErrorCatching('auth error', 'we can not recognise you as you do no have cookie')
        jwt.verify(cpat, JWT_SECRET_KEY, async (err, data) => {
            try {
                if (err) {
                    log(err)
                    return Alert('Access denied', res);
                }
                if (data) {
                    let { key } = data;
                    if (!key) return res.clearCookie('cpat').status(401).json({ error: 'You can not access this feature' })
                    let admin = await Admin.findOne({ Secret_Key: key });
                    if (!admin) return Alert('You can not access this feature', res);
                    if (admin) next();
                }
            } catch (error) {
                return catchError(res,error);
            }
        })
    } catch (error) {
        console.error(error);
        return res.sendStatus(401);
    }

}

export default AdminCheckMidleware
