/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */
import { ADMIN_EMAIL, JWT_SECRET_KEY } from "../env.js";
import { Admin } from "../models/Admin.js";
import jwt from 'jsonwebtoken'
import {log} from '../smallUtils.js'
import {generatePin} from '../generatePin.js'
import { AdminAuthEmail } from "../mail/Admin.mails.js";

export const addMinPageRoute= async (req,res) => {
    let {cpat}=req.cookies;//c panal access token
    if (cpat === undefined) {
        Admin.findOne({email :ADMIN_EMAIL})
        .then(async admin => {
            let opt=await generatePin(1)
            admin.Otp=otp;
            admin.save() 
            .then(async sData => {
              let mailStatus=await  AdminAuthEmail(otp);
              if (mailStatus) return res.render('cpanal_varification')
            })
            .catch(e => {
                log(e);
                try {
                    res.render('notAllowed')
                } catch (error) {
                    log(e)
                }
            })
        })
        .catch(e =>{
            log(e);
            try {
                res.render('notAllowed')
            } catch (error) {
                log(e)
            }
        } )
    }
    if (cpat !== undefined) {
        jwt.verify(cpat,JWT_SECRET_KEY,(err,data ) => {
            if (err) {
            res.clearCookie('cpat');
            res.render('notAllowed')
            return
            }
            if (data) {
                let {key} =data;
                if (!key) return res.render('notAllowed')
                Admin.findOne({email:ADMIN_EMAIL}) 
            .then(admin=>{
                if (key !==admin.Secret_Key) return res.render('notAllowed')
                return res.render('control-panal')
            })
            .catch(e => {
                console.log(e);               
            })
            }
        })
    }
}

export async function adminVaification(req,res) {
    let {otp }= req.body;
    if (!otp) return res.json({error:'otp in not defined' });
    if (typeof otp=== 'number') return res.json({error:'error' });
    if ( otp <-1 || otp > 1000000 ) return res.json({error:'error' });
    
}