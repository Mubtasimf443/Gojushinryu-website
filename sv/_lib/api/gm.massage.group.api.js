/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/
import { Admin } from "../models/Admin.js";
import { Grand_Master_Group_Massages } from "../models/Grandmaster.group.massage.js";
import { GRAND_MASTER_GROUP_MASSAGE_ID, JWT_SECRET_KEY } from "../utils/env.js";
import { repleCaracter } from "../utils/replaceCr.js";
import { log } from "../utils/smallUtils.js";
import jwt from 'jsonwebtoken'
 

export async function checkNewGmGroupMassage(req,res) {
    try {
        let {lastMassageId}=req.body;
        if (!lastMassageId) throw 'lastMassageId is undefined'
        if (typeof lastMassageId !=='number') throw 'lastMassageId : '+lastMassageId+' not is Number'
        if (Number(lastMassageId).toString().toLowerCase()==='nan') throw 'lastMassageId : '+lastMassageId+' not is Number'
        let massage=await Grand_Master_Group_Massages.findOne({id :GRAND_MASTER_GROUP_MASSAGE_ID})
        if (!massage) throw 'DataBase is hack ,Please solve it'
        let massages= massage.massages;
        if (massages.length===0) return res.sendStatus(200)
        let lastMassage=massages[massages.length -1] ;
        if (lastMassageId === lastMassage.massage_time) return res.status(200).json({has_massage:false})
        
        if (lastMassageId!==lastMassage.massage_time) {
            let newMassages= massages.filter(el => {
                if (el.massage_time > lastMassageId) return el
            });
            res.status(200).json({
                has_massage:true,
                massages:newMassages
            })
        };

        

    } catch (error) {
        console.log({error:'server error : '+error});
        return res.sendStatus(400);
    }
}
export async function getGmGroupMassage(req,res) {
    try {
        let massageGroup=await Grand_Master_Group_Massages.findOne({id :GRAND_MASTER_GROUP_MASSAGE_ID});
        if (!massageGroup) throw 'server is hacked'
        let massages =massageGroup.massages;
        if (massages.length <50) return res.status(200).json({massages})
        let sendIngMassageArray =[];
        let startingIndex=massages.length-1;
        let endIndex=massages.length-51;
        for (let i = startingIndex; i > endIndex; i--) sendIngMassageArray.push(massages[i])
        return res.status(200).json({massages:sendIngMassageArray})
    } catch (error) {
        console.log({error:'server error : '+error});
        return res.sendStatus(400);
    }
}
export async function addGmMassageApi(req,res) {
    try {
        let {name,massage}=req.body;
        console.log({name,massage});
        if (!name) throw 'name is undefined'
        if (!massage) throw 'massage is undefined'
        if (typeof name!=='string' || typeof massage !=='string' ) throw 'name or massage not is a string'
        name =await repleCaracter(name);
        massage=await repleCaracter(massage)
        let massageGroup=await Grand_Master_Group_Massages.findOne({id :GRAND_MASTER_GROUP_MASSAGE_ID});
        if (!massageGroup) throw 'server is hacked'
        massageGroup.massages.push({
            massager_name:name,
            massage :massage,
            massage_time:Date.now()
        });
        await massageGroup.save();
        return res.sendStatus(200)
    } catch (error) {
        console.error({error:'server error : '+error});
        return res.sendStatus(400);
    }
}
export async function grand_Master_Group_Massages_Midleware(req,res,next) {
    try {
        let {gm_cat,cpat}=req.cookies;
        if (!gm_cat && !cpat) throw 'Requester don not have access to grandmaster massage'
        if (cpat) {
            jwt.verify(cpat,JWT_SECRET_KEY,(err,data) => {
                if (err) throw err
                if (data) {
                    return next()
                }
            })
        }
        if (gm_cat) {
            jwt.verify(gm_cat,JWT_SECRET_KEY,(err,data) => {
                if (err) throw err
                if (data) {
                   return next()
                }
            })
        }
    } catch (error) {
        console.error({error:'server error : '+error});
        return res.sendStatus(400)
    }
}