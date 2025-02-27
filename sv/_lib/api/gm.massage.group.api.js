/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/
import { makePushNotification } from "../Config/webPush.js";
import { Admin } from "../models/Admin.js";
import { GM } from "../models/GM.js";
import { Grand_Master_Group_Massages } from "../models/Grandmaster.group.massage.js";
import { GRAND_MASTER_GROUP_MASSAGE_ID, JWT_SECRET_KEY } from "../utils/env.js";
import { repleCaracter } from "../utils/replaceCr.js";
import jwt from 'jsonwebtoken';

export async function checkNewGmGroupMassage(req,res) {
    try {
        let { lastMassageId } = req.query;
        if (isNaN(lastMassageId)) throw 'lastMassageId : '+lastMassageId+' not is Number';
        lastMassageId = Number(lastMassageId);
        let massage=await Grand_Master_Group_Massages.findOne({id :GRAND_MASTER_GROUP_MASSAGE_ID});
        if (!massage) throw 'DataBase is hack ,Please solve it';
        let massages= massage.massages;
        if (massages.length===0) return res.sendStatus(200);
        let lastMassage=massages[massages.length -1] ;
        if (lastMassageId === lastMassage.massage_time) return res.status(200).json({has_massage:false});
        
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
        return res.status(200).json(massages)
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
        sendGrandMastersMessageNotice(massage)
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

async function sendGrandMastersMessageNotice(body) {
    try {
        let gms= await GM.find({}, 'service_worker_subscription').where('service_worker_subscription.endpoint').ne(null);
        gms = gms.map(element => element.service_worker_subscription);
        for (let i = 0; i < gms.length; i++) {
            const element = gms[i];
            try {
                await makePushNotification(element ,{ title :'new Grand Master Message' , body})
            } catch (error) {
                console.error(error);
            }
        }
    } catch (error) {
     console.error(error);
    }
   
}