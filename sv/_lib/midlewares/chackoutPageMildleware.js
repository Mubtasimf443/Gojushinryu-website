/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/


import jwt from 'jsonwebtoken' ;
import { User } from '../models/user.js'
import {  log } from '../utils/smallUtils.js';
import { JWT_SECRET_KEY } from '../utils/env.js';

export const checkoutPageMidleware = async (req, res, next) => {
    try {
        let { rft } = req.cookies;
        if (!rft) return res.redirect('/auth/sign-up?forwardto=checkout_page');
        await jwt.verify(rft, JWT_SECRET_KEY, async (err, data) => {
            if (err) {
                log(err)
                return res.redirect('/auth/login?forwardto=checkout_page');
            }
            if (data) {
                let { email } = data;
                if (!email) return res.clearCookie('rft').status(401).json({ error: 'You can not access this feature' })
                let user = await User.findOne({ email });
                if (!user) return res.redirect('/auth/sign-in');
                if (user) {
                    let { first_name, last_name, email, phone, country, district, city, street, postCode } = user;
                    res.render('checkout', {
                        name: first_name + last_name,
                        first_name,
                        last_name,
                        email,
                        phone,
                        country,
                        district: district ?? '',
                        city: city ?? '',
                        street: street ?? "",
                        postcode: postCode ?? ''
                    })
                }
            }
        });
    } catch (error) {
        console.error({ error });

    }
}