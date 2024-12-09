/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import morgan from "morgan"


export const morganMidleWare=(req,res,next) => {
    let dev= morgan('dev')
    return dev(req,res,next)
}