/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

import { request, response } from "express";
import catchError from "../error.handle.js";
import { Grand_Master_Group_Massages } from "../models/Grandmaster.group.massage.js";


export async function deleteOldGrandMasterChats(req=request , res= response){
    try {
        let today =new Date().getDate();
        if (today !== 3 && today !== 10 && today !== 17 && today !== 25) return res.status(200).json({ today });
        let gm_message_group = await Grand_Master_Group_Massages.findOne({});
        let deletedMessage=[];
        gm_message_group.massages =gm_message_group.massages.filter(function (element) {
            if (element.massage_time > Date.now() - 10 * 24 * 3600 * 1000) return element ; 
            else deletedMessage.push(element);
        });
        await gm_message_group.save();
        return res.status(200).json(deletedMessage);
    } catch (error) {
       catchError(res, error)
    }
}


