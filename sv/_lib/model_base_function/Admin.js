/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ 
Insha Allah,  Allah is enough for me
*/


import { ADMIN_EMAIL, JWT_SECRET_KEY } from "../utils/env.js";
import { Admin } from "../models/Admin.js";
import jwt from 'jsonwebtoken'
import { log } from '../utils/smallUtils.js'
import { generatePin } from '../utils/generatePin.js'
import { AdminAuthEmail } from "../mail/Admin.mails.js";
import { randomBytes } from 'crypto'
import { Settings } from "../models/settings.js";
import { bugFromAnErron } from "./Bugs.js";

export const addMinPageRoute = async (req, res) => {
    try {
        let { cpat } = req.cookies;//c panal access token
        if (cpat === undefined) return navigateToVarify(req, res)
        if (cpat !== undefined) return navigateToCpanal(req, res)
    } catch (error) {
        log(error)
    }

}
export async function adminVaification(req, res) {
    let { otp } = req.body;
    if (!otp) return res.json({ error: 'otp in not defined' });
    if (typeof otp !== 'number') return res.json({ error: 'error ,Otp Has to Be a number' });
    if (otp < -1 || otp > 1000000) return res.json({ error: 'error ,Otp is 6 digit' });    
    await Admin.findOne({ email: ADMIN_EMAIL })
        .then(async admin => {
            if (!admin) return res.json({ error: 'Server Error , Admin Not Found' });
            if (admin.Otp !== otp) return res.json({ error: 'Otp do not match' });
            let key = await randomBytes(62).toString('hex');
            admin.Secret_Key = key;
            admin.save()
                .then(async () => {
                    let cpat = await jwt.sign({ key }, JWT_SECRET_KEY, {});
                    res.cookie('cpat', cpat, {
                        expires: new Date(Date.now() + 1000 * 60 * 60 * 72),
                        sameSite: true,
                        httpOnly: true
                    }).status(200).json({
                        success: true
                    })
                })
                .catch(e => {
                    log(e)
                    res.json({ error: 'error' })
                })
        })
        .catch(e => {
            console.log(e);
            res.json({ error: 'error' });
        })
}
async function navigateToVarify(req, res) {
    try {
        let admin = await Admin.findOne({ email: ADMIN_EMAIL });
        let otp =await generatePin(1);
        console.log(otp);
        admin.Otp = otp;
        admin = await admin.save();
        let mailStatus = await AdminAuthEmail(otp);
        if (mailStatus) return res.render('cpanal_varification')
    } catch (error) {
        await bugFromAnErron(error,'admin navigate to verify error');
        res.render('notAllowed')
    }
}
async function navigateToCpanal(req, res) {
    // log('navigateToCpanal');
    jwt.verify(req.cookies.cpat, JWT_SECRET_KEY, (err, data) => {
        if (err) {
            res.clearCookie('cpat').status(200).render('notAllowed');
            return
        }
        if (data) {
            // log('jwt')
            let { key } = data;
            if (!key) return res.render('notAllowed')
            Admin.findOne({ email: ADMIN_EMAIL })
                .then(async admin => {
                    let settings = await Settings.findOne({});
                    
                    return res.render('control-panal', {
                        date_of_womens_defence_class: settings.date_of_womens_defence_class.date ?? '',
                        date_of_regular_class: settings.date_of_regular_class.date ?? '',
                        date_of_online_class: settings.date_of_online_class.date ?? '',
                        fees_of_reqular_class:settings.fees_of_reqular_class,
                        fees_of_Bhangra_fitness:settings.fees_of_Bhangra_fitness,
                        home_video_url: settings.home_video_url ?? '',
                        gst_rate :settings.gst_rate,
                        global_gst_rate : settings.gst_rate
                    })
                })
                .catch(e => {
                    console.log(e);
                })
        }
    })
}


