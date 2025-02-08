/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { v4 as uuid} from "uuid";
import MonthlyCourseEnrollmentFeesMails from "./_lib/mail/course.monthlyFeesMail.js";

await MonthlyCourseEnrollmentFeesMails.confirmation.student({
    email : 'mubtasimf443@gmail.com',
    student_name :'Mubtasim',
    course_name:'Regular Martial Arts Class',
    course_fees :(100).toFixed(2),
    gst : (10).toFixed(2),
    total :(110).toFixed(2),
    payment_id : uuid()
});
await MonthlyCourseEnrollmentFeesMails.confirmation.notifyAdmin({
    student_name :'Mubtasim',
    course_name:'Regular Martial Arts Class',
    course_fees :(100).toFixed(2),
    gst : (10).toFixed(2),
    total :(110).toFixed(2),
    payment_id : uuid()
});