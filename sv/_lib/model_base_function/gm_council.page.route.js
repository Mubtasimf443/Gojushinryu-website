/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../utils/env.js";

export async function GMCornerPageRoute(req,res) {
    //using undefined ,A lot of things to know
    // if (req.cookies.gm_cat ===undefined) return res.render('login_gm_counchil') ;
    //grand master counchil access token
    // if (req.cookies.gm_cat !==undefined) {
    //    await jwt.verify(req.cookies.gm_cat,JWT_SECRET_KEY ,
    //     (err,data)  => {
    //         if(err) return res.clearCookie('gm_cat').status(200).render('login_gm_counchil');
    //         let {email} = data;
    //         if (!email) return res.clearCookie('gm_cat').status(200).render('login_gm_counchil');
            return res.render('grand-master-counchil')
    //    })
    // }
} 















