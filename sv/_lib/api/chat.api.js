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
        student_id=await repleCaracter(student_id)
        let user =await User.findById(student_id)
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
        let {not_seen_massage,seen_massage,id}=req.user_info;//midleware
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


export async function getStudentMassageStatusAndNewMassaseForAdmin(req,res) {
    try {
        let admin=await Admin.findOne({email:ADMIN_EMAIL});
        let {student_massages} =admin;
        let data=student_massages.filter(el =>{
            if (el.not_seen_massage.length !==0) {
                return {
                    student_id: el.student_id,
                    massages :el.not_seen_massage
                }
            }
        })
        student_massages=student_massages.map(el => {
            if (!el.not_seen_massage.length) return
            let seen_massage=el.seen_massage;
            for (let i = 0; i < el.not_seen_massage.length; i++) {
                seen_massage.push(el.not_seen_massage[i])
            }
            return {
                    student_id: el.student_id,
                    not_seen_massage :[],
                    seen_massage
            }
        })

        admin.student_massages=student_massages;
        await admin.save()
        return res.json({data})
    } catch (error) {
        log({error})
        res.sendStatus(400)
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