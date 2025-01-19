/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { settingsAsString } from "../model_base_function/Settings.js";
import { Settings } from "../models/settings.js";

export async function MembershipPageNavigation(req, res) {
    try {
        let { name, first_name, last_name, email, phone, country, district, city, postCode } = req.user_info;
        let global_gst_rate = await settingsAsString('gst_rate') ?? 5;
        if (req.params.org === 'school-of-traditional-martial-arts') {
            return res.render('MembershipFrom', {
                name: name,
                first_name,
                last_name,
                email,
                phone,
                country,
                district: district ? district : '',
                city: city ? city : '',
                postcode: typeof postCode === 'number' ? postCode : 1000,
                global_gst_rate
            });
        }
        else if (req.params.org === 'goju-shin-ryu') {
            return res.render('membership_gojushinryu',{ 
                name: name,
                first_name,
                last_name,
                email,
                phone,
                country,
                district: district ? district : '',
                city: city ? city : '',
                postcode: typeof postCode === 'number' ? postCode : 1000,
                global_gst_rate
            })
        } else return res.redirect('/membership-application/school-of-traditional-martial-arts');
        
    } catch (error) {
        console.log({ error });
    }
}