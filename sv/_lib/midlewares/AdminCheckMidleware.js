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
import { request, response } from 'express';

export default async function AdminCheckMidleware(req = request, res = response, next) {
    try {
        let { email } = await new Promise(function (resolve, reject) {
            jwt.verify(req.cookies.cpat, JWT_SECRET_KEY, async (err, data) => {
                if (error) {
                    console.error(error)
                    reject(error)
                }
                if (data) {
                    if (!data.email) throw 'email is undefined';
                    resolve({ email: data.email })
                }
            });
        });
        let admin = await Admin.findOne({ email: email });
        if (!admin) return Alert('You can not access this feature', res);
        if (admin) next();

    } catch (error) {
        console.error(error);
        return res.sendStatus(401);
    }
}




