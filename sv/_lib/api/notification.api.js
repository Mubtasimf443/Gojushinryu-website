/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { notifyMail } from "../mail/notification.mail.js";
import { User } from "../models/user.js";
import { repleCaracter } from "../utils/replaceCr.js";
import { Alert, log, Success } from "../utils/smallUtils.js";



export async function notificationApi(req,res) {

    let {title,massage}  =req.body;

    try {
    if (!title || !massage)  return Alert('title and massage is not defined',res)
    title =await repleCaracter(title);
    massage =await repleCaracter(massage);



    let array= await User.find({});


    for (let i = 0; i < array.length; i++) {
        let user = array[i];
        user.notification.push({
            title,
            massage,
            id :Date.now(),
            viewed:false
        })
        await user.save().then(e => log('//user saved'))
    }

    return Success(res)
    } catch (e) {
        log(e);
        Alert('Server error',res)
    }
    ;


 
   
  
}


export async function notificationMailApi(req,res) {

    let errorArray=[];
    let successArray=[];
    let {title,massage}  =req.body;
    
    if (!title || !massage)  return Alert('title and massage is not defined',res)
    title =await repleCaracter(title);
    massage =await repleCaracter(massage);


    try {

    let array= await User.find({});


    for (let i = 0; i < array.length; i++) {
        let {email} = array[i];
        let status=await notifyMail({to:email,title,massage});
        if (status) successArray.push(status)
        if (!status) errorArray.push(status)
    }


    return res.json({
        success:true,
        successRate:successArray.length,
        failior:errorArray.length
    })

    
    } catch (error) {
        return Alert('server error')
    }

}







