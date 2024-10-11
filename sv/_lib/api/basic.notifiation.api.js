/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { User } from "../models/user.js";
import { log } from "../utils/smallUtils.js";


export async function removeNotificationFromDatabase(req,res) {
    try {
        log(req.body)
        let notificationId=req.body.notificationId;
        if(!notificationId) throw 'there is no notificationId'        
        if(typeof notificationId !=='number') throw ' notificationId not a number' //as it is more faster than NaN testing
        if(Number(notificationId).toString().toLowerCase()==='nan') throw ' notificationId not a number'
        let userId=req.user_info._id;
        let user=await User.findById(userId);
        if (!user) return res.sendStatus(400)
        let notifications=user.notification;
        notifications=notifications.filter(e => {
            if (e.id!== notificationId) return e
        })
        user.notification =notifications;
        await user.save().then(e => log(e));
        return res.sendStatus(200)
    } catch (error) {
       log({error}) 
       return res.sendStatus(400)
    }
}






