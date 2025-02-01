/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  */
/* Insha Allah,  Allah loves s enough for me */

import { request, response } from "express";
import { Memberships } from "../models/Membership.js";
import { repleCaracter } from "../utils/replaceCr.js";
import { log } from "../utils/smallUtils.js";
import catchError from "../utils/catchError.js";
import GojushinryuMembership from "../models/GojushinryuMembership.js";


export async function findMemberShipdata(req,res) {
    try {
        let {id} =req.body;
        id =await repleCaracter(id)
        let data= await Memberships.findById(id)
        if (!data) return res.sendStatus(304);
        return res.json({data})
    } catch (e) {
        log(e)
        return res.sendStatus(400);
    }
    
}


export async function findMembersOfMemberPage(req=request, res=response) {
    try {
        let stmaMembers = await Memberships.find({}, "_id id fname lname member_image membership_company_short country membership_company").where('isPaymentCompleted').equals(true).sort({id :-1});
        let gMembers = await GojushinryuMembership.find({}, "_id id fname lname member_image membership_company_short country membership_company").where('admin_approved').equals(true).sort({id :-1});
       
        let members=[];
        let hasStmaMember = stmaMembers.length !== 0, hasGujuMember = gMembers.length !== 0;
        if (!hasGujuMember&&!hasStmaMember) return res.sendStatus(204);
        if (!hasGujuMember) return res.status(200).json(stmaMembers);
        if (!hasStmaMember) return res.status(200).json(gMembers);
        if (stmaMembers.length === gMembers.length) {
            while (gMembers.length!==0) {
                members.push(stmaMembers.shift());
                members.push(gMembers.shift());
            }
            return res.status(200).json(members);
        } else {
            let mostMembers = gMembers.length > stmaMembers.length ? gMembers : stmaMembers;
            let minMembers = gMembers.length > stmaMembers.length ? stmaMembers : gMembers;
            while (0 !== minMembers.length) {
                members.push(mostMembers.shift());
                members.push(minMembers.shift());
                if (minMembers.length===0)  members=[...members , ...mostMembers];
            }
            return  res.status(200).json(members);
        }
    } catch (error) {
        catchError(res,error)
    }
}