/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  */
/* Insha Allah,  Allah loves s enough for me */

import { Memberships } from "../models/Membership.js";
import { repleCaracter } from "../utils/replaceCr.js";
import { log } from "../utils/smallUtils.js";


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



