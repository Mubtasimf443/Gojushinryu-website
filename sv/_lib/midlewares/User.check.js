/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import jwt from 'jsonwebtoken';
import { User } from '../models/user.js'
import { log } from '../utils/smallUtils.js';
import { JWT_SECRET_KEY } from '../utils/env.js';

function Alert(params, res, not_a_user) {
    return res.status(400).json({ error: params, notAUser: not_a_user ? not_a_user : true })
}

const userCheck = async (req, res, next) => {
    try {
        let { rft } = req.cookies;
        if (!rft) return Alert('You can not access this page , Please login', res)
        await jwt.verify(rft, JWT_SECRET_KEY, async (err, data) => {
            if (err) {
                log(err)
                return Alert('Access denied', res);
            }
            if (data) {
                let { email } = data;
                if (!email) return res.clearCookie('rft').status(401).json({ error: 'You can not access this feature' })
                let user = await User.findOne({ email });
                if (!user) return Alert('You can not access this feature', res);
                if (user) {
                    req.user_info = user;
                    next()
                }
            }
        });
    } catch (error) {
        console.log({ error });
    }
}



export const userCheckAndNavigation = async (req, res, next) => {
    try {
        let { rft } = req.cookies;
        if (!rft) {
            if ( req.url === `/membership-application/school-of-traditional-martial-arts`) return res.redirect('/auth/sign-up?forwardto=membership_page');
            if (req.url === "/membership-application/goju-shin-ryu" ) return res.redirect('/auth/sign-up?forwardto=membership_page&membership_type=gojushinryu');
            else return res.redirect('/auth/sign-up');
        }
        await jwt.verify(rft, JWT_SECRET_KEY, async (err, data) => {
            if (err) {
                log(err)
                if (req.url === `/membership-application/school-of-traditional-martial-arts`) return res.redirect('/auth/login?forwardto=membership_page');
                if (req.url === "/membership-application/goju-shin-ryu") return res.redirect('/auth/login?forwardto=membership_page&membership_type=gojushinryu');
                return res.redirect('/auth/sign-in')
            }
            if (data) {
                let { email } = data;
                if (!email) return res.clearCookie('rft').status(401).json({ error: 'You can not access this feature' })
                let user = await User.findOne({ email });
                if (!user) return res.redirect('/auth/sign-in')
                if (user) {
                    req.user_info = user;
                    next()
                }
            }
        });
    } catch (error) {
        console.log({ error });
    }

}

export default userCheck
