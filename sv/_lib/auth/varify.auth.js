/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */
import jwt from 'jsonwebtoken'
import { ADMIN_EMAIL, JWT_SECRET_KEY } from '../utils/env.js'
import { User } from "../models/user.js";
import { user_sign_up_success_admin_mail, user_sign_up_success_user_mail } from "../mail/user_auth.mail.js";
import { log } from "../utils/smallUtils.js";
import { Admin } from '../models/Admin.js';
import catchError from '../utils/catchError.js';


export async function user_varification_api(req,res) {
    try {
        let code = req.body.code;
        let vft = req.cookies.vft;
        if (!vft) return res.status(400).json({ error: 'Time out! please signup again ' });
        if (!code) return res.status(400).json({ error: 'code is not valid' });
        if (typeof code !== 'number') return res.status(400).json({ error: 'code is not valid' });
        let email =await new Promise(function(resolve, reject) {
            jwt.verify(vft,JWT_SECRET_KEY,function(error, decoded) {
                if (error) return reject(error);
                if (!decoded?.email) return reject(new Error('VFT cookie does not have a email'));
                return resolve(decoded.email);
            });
        })
        let user = await User.findOne().where('email').equals(email);
        if (!user) return res.status(400).json({error:'Time out! please signup again '});
        if (user.pin === 0) return res.status(400).json({error:'You already have account,Please sign In'});
        if (user.pin !== code) return res.status(400).json({error:'Otp is not correct'});
        user.isRegistered=true;
        user.pin=0;
        user.not_seen_massage = [{ massage: 'Thank You for Joining Our Website', name: 'Sensei Varun Jettly', data_as_number: Date.now() }];
        await user.save();
        user_sign_up_success_admin_mail().then(() => { }).catch((e) => { log(e) });
        user_sign_up_success_user_mail({ to: email }).then(() => { }).catch((e) => console.error(e));
        let admin = await Admin.findOne({}).where('email').equals(ADMIN_EMAIL);
        console.log(admin);
        
        if (admin) {
            admin.student_massages.push({
                student_id :user._id,
                student_ID :user.id,
                student_image :user.thumb,
                seen_massage: [],
                not_seen_massage: [{ name: `${user.first_name} ${user.last_name}`, massage: "I am Happy to Join www.Gojushinryu.com", date_as_number: Date.now() }]
            });
            await admin.save();
        }
        let token = await jwt.sign({ email }, JWT_SECRET_KEY, {});
        res.cookie('rft', token, { httpOnly: true, sameSite: true, expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 31)) }).status(201).json({ success: true });
    } catch (error) {
        console.error(error);
        catchError(res,error);
    }
}




