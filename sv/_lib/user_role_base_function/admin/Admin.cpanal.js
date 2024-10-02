/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */
import { ADMIN_EMAIL, JWT_SECRET_KEY } from "../../env.js";
import { Admin } from "../../models/Admin.js";
import jwt from 'jsonwebtoken'
import {log} from '../../smallUtils.js'
import {generatePin} from '../../generatePin.js'
import { AdminAuthEmail } from "../../mail/Admin.mails.js";
import {randomBytes} from 'crypto'

export const addMinPageRoute= async (req,res) => {
    // return res.render('control-panal')

    try {
    let {cpat}=req.cookies;//c panal access token
    if (cpat === undefined) navigateToVarify(req,res)
    if (cpat !== undefined) return navigateToCpanal(req,res)
    } catch (error) {
    log(error)
    }   

}
export async function adminVaification(req,res) {
    let {otp }= req.body;
    if (!otp) return res.json({error:'otp in not defined' });
    if (typeof otp !== 'number') return res.json({error:'error ,Otp Has to Be a number' });
    if ( otp <-1 || otp > 1000000 ) return res.json({error:'error ,Otp is 6 digit' });
    await Admin.findOne({email : ADMIN_EMAIL})
    .then( async admin => {
        if (!admin) return res.json({error:'Server Error , Admin Not Found' });
        if (admin.Otp !== otp ) return res.json({error:'Otp do not match' });
        let key =await randomBytes(62).toString('hex');
        admin.Secret_Key=key;
        admin.save()
        .then(async () => {
           let cpat=await jwt.sign({key},JWT_SECRET_KEY,{});
           res.cookie('cpat',cpat,{
            expires : new Date(Date.now()+1000*60*60*24) ,
            sameSite :true,
            httpOnly :true
        }).status(200).json({
            success :true
        })
        })
        .catch(e=> {
            log(e)
            res.json({error:'error'})
        })
    })
    .catch(e => {
        console.log(e);
        res.json({error:'error' });
    })
}
async function navigateToVarify(req,res) { 
    log('navigateToVarify')
    Admin.findOne({email :ADMIN_EMAIL})
    .then(async admin => {
        let otp=await generatePin(1)
        admin.Otp=otp;
        admin.save() 
        .then(async sData => {
          let mailStatus = await AdminAuthEmail(otp);
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
async function navigateToCpanal(req,res) {
    log('navigateToCpanal');
    jwt.verify(req.cookies.cpat,JWT_SECRET_KEY,(err,data ) => {
        if (err) {
        res.clearCookie('cpat').status(200).render('notAllowed')
        return
        }
        if (data) {
            log('jwt')
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
