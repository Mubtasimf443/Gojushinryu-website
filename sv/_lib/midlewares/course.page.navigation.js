/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import Course from "../models/Course.js";
import { repleCaracter } from "../utils/replaceCr.js";
import { MakePriceString } from "../utils/string.manipolation.js";

export async function coursePageNavigation(req,res) {

   
    try {
        let linkname=req.params.name;
        linkname =await repleCaracter(linkname)
        let course =await Course.findOne({url:linkname});
        if (!course) return res.status(404).render('404')
    
   
    res.render('course',{
        seniorStartTime :course.seniorStartTime,
        seniorEndTime:course.seniorEndTime,
        juniorStartTime :course.juniorStartTime,
        juniorEndTime: course.juniorEndTime,
        metatitle:course.title.length >120? course.title.substring(0,120) :course.title,
        metadescription:course.title.description >250? course.title.substring(0,250) :course.description,
        title:course.title,
        description:course.description,
        course_id:course.id,
        thumb :course.thumb,
        images :course.images,
        price :course.price,
        dates :course.dates.join(','),
        
    })
    } catch (error) {
    log(error)
    }
}