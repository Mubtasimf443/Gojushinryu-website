/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../utils/env.js";
import { User } from "../models/user.js";


export async function StudentCornerPageRoute(req,res) {
  
    let {rft} = req.cookies;
    if (!rft) return res.redirect('/auth/sign-in');
    jwt.verify(rft,JWT_SECRET_KEY,async (error,data)=>{
        if (error) return res.clearCookie('rft');
        if (data) {
            let {email }=data;
            if (!email) return res.render('notAllowed');
            User.findOne({email})
            .then(user => {                
                if (!user) return res.render('massage_server', {title :'Account ot found',body :'Account Not Found ,You can Login again to avoid this problem'})       
                return res.render('student-corner',{
                    bio : user.bio ?  user.bio :'I dream to become black belt in karate and Master Martial Arts',
                    name :user.name? user.name :'name',
                    age :user.age ? user.age :0,
                    gender :user.gender ?user.gender :'male',
                    district:user.district ? user.district :'name',
                    city:user.city? user.city :'',
                    country:user.country? user.country :'',
                    postcode:user.postCode? user.postCode :0,
                    street:user.street? user.street :'',
                    thumb :user.thumb?user.thumb:'/img/avatar.png'
                })      
            })
            .catch(e => {
                if (e) return res.render('massage_server', {title :'Server Error',body :'Please Contact us inform About the error'})
            })
        }
    })
}