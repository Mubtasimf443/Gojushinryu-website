/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { Admin } from "../models/Admin.js";
import { ADMIN_EMAIL } from "../utils/env.js";
import { repleCaracter } from "../utils/replaceCr.js";
import { log } from "../utils/smallUtils.js";
import {User} from '../models/user.js'
import { response } from "express";



export async function sendMassageToAdminFromUser(req,res) {
    try {
        let {thumb, first_name , last_name, _id,id} =req.user_info;
        let {massage}=req.body;
        log({massage})
        if (!massage) return res.sendStatus(400)
        massage=await repleCaracter(massage)
        let admin=await Admin.findOne({email:ADMIN_EMAIL});
        if (!admin) return res.sendStatus(500);
        let stMassages= admin.student_massages;
        let checkMassageExistents= stMassages.findIndex(el =>{ 
           // log({el:el.student_id,_id})
            
            console.log(el.student_ID === id);
            if (el.student_ID === id) return el
            return false
            
            });
      
       
        if (checkMassageExistents !== -1) {
            stMassages= stMassages.map(el => {
                if (el.student_ID ===id) {
                    el.not_seen_massage.push({
                        name :first_name+" "+last_name,
                        massage:massage,
                        data_as_number:Date.now()
                    })
                    return el
                }
                return el
            })
           // console.log(stMassages);
           log(1)

            admin.student_massages =stMassages;
            await admin.save().then(e =>log('success'));
            return res.sendStatus(200)
        }
        if (checkMassageExistents ===-1 ) {
            admin.student_massages.push({
                student_ID:id,
                student_id:_id,
                student_image:thumb,
                seen_massage:[],
                not_seen_massage:[{
                    name :first_name+" "+last_name,
                    massage:massage,
                    data_as_number:Date.now()
                }]
            })
            await admin.save()
            console.log(2);
           
            return res.sendStatus(200)
        }
    } catch (error) {
        log('error');
        return res.sendStatus(400)
    }
}


export async function sendMassageToUserFromAdmin(req,res) {
    try {
        let {massage,student_id}=req.body;
        if (!massage||!student_id) throw `the user  id is ${student_id} and massage is ${massage} `
        massage=await repleCaracter(massage)
        //student_id=await repleCaracter(student_id)
        if (typeof student_id !== 'number' || Number(student_id).toString().toLowerCase()==='nan') throw 'error:student is is not a number '+student_id
        let user =await User.findOne({id:student_id})
        if (!user) throw 'their is not user //'+user
        user.not_seen_massage.push({
            massage:massage,    
        })
        await user.save();
        return res.sendStatus(200)
    } catch (error) {
        log({error})
        return res.sendStatus(400)
    }
}


export async function getAdminMassageStatusAndNewMassaseForUser(req,res) {
    try {
        let {
            not_seen_massage,
            seen_massage,
            id
        }=req.user_info;//midleware
       // console.log({not_seen_massage});
        
        if (!not_seen_massage.length) {   
            return res.status(200).json({
            has_massage:false
            }) 
        }
        let massages =not_seen_massage;

        for (let i = 0; i < not_seen_massage.length; i++) {
            seen_massage.push( not_seen_massage[i])
        }

        await User.findOneAndUpdate({id},{seen_massage,not_seen_massage:[]})

        return res.status(200).json({
            has_massage:true,
            massages
        })


    } catch (error) {
        log({error});
        return res.sendStatus(400)
    }
}



export async function getAdminMassageWhatIsSeen(req,res) {
    try {
        let {  seen_massage  }=req.user_info;//midleware
        return res.status(200).json({seen_massage})
    } catch (error) {
        console.error({error});
        
        return res.sendStatus(400)
    }
}





export async function getUserMassageListForAdmin(req,res) {
    try {
        let admin =await Admin.findOne({email:ADMIN_EMAIL})
        if (!admin ) return res.sendStatus(500)
        if (!admin.student_massages.length) return res.sendStatus(304)
        return res.status(200).json({userMassageList:admin.student_massages })
     } catch(e){
        console.log(e);       
        return res.sendStatus(500)
    }
}




export async function checkUserHasSendMassageOrNotTotheAdmin(req,res) {
    try {
        
        
        let {id}=req.body;
        if (typeof id !== 'number') throw 'error , id is not correct'
        let admin=await Admin.findOne({email:ADMIN_EMAIL});
        //we will check is their is massage or not
        let student_massages= admin.student_massages;
        let index= student_massages.findIndex(el => el.student_ID===id)
        if(index ===-1) throw 'their is no user ,thanks'
        let {seen_massage,not_seen_massage} =student_massages[index];
        if (!not_seen_massage.length) return res.status(200).json({error:'no data'}); //As their is no not seen massage
        for (let i = 0; i < not_seen_massage.length; i++) {
            seen_massage.push( not_seen_massage[i]);
        }//before sending we want update the massage to not seen form seen
       
       
        student_massages=student_massages.map((el,i)=> {
            if (i !== index) return el
            return {
                student_ID:el.student_ID,
                student_id:el.student_id,
                student_image:el.student_image,
                seen_massage:seen_massage,//seen massage has added massage
                not_seen_massage:[]//removed massage
            }
        })

        admin.student_massages=student_massages;
        await admin.save()
        console.log({not_seen_massage});console.log('//checkUserHasSendMassageOrNotTotheAdmin.js');
        
        
        return res.status(200).json({massages:not_seen_massage})
    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
   
    
}


