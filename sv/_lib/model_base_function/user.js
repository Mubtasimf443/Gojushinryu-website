/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../utils/env.js";
import { User } from "../models/user.js";
import { Alert, log, Success } from "../utils/smallUtils.js";



export const FindUser =async (req,res) => {
  try {
    let user = await User.find({});
    res.json({
      success:true,
      User:user 
    })
  } catch (e) {
    res.status(500).json({error :'Failed to Give you the User'})
  } 
}


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


export async function BaneUserFunction (req,res) {
    let {email}= req.body;
    if (!email) return Alert('Please Give The Correct User InfoCan not Bann User ',res );
    if (!email.includes('@') &&! email.includes('.')) return Alert('Not Valid Email', res)
    User.findOneAndUpdate({email}, {
      banned : true
    })
    .then(e=>Success(res))
    .catch(e => {
      log(e);
      Alert('Server error',res)
    })
  };

export  async function RemoveFromBanedUserFunction (req,res) {
    let {email}= req.body;
    if (!email) return Alert('Please Give The Correct User InfoCan not Bann User ',res );
    if (!email.includes('@') &&! email.includes('.')) return Alert('Not Valid Email', res)
    User.findOneAndUpdate({email}, {
      banned : false
    })
    .then(e=>Success(res))
    .catch(e => {
      log(e);
      Alert('Server error',res)
    })
  };

export  async function DeleteUserAccount(req,res) {
    let {email}= req.body;
    if (!email) return Alert('Please Give The Correct User InfoCan not Bann User ',res );
    if (!email.includes('@') &&! email.includes('.')) return Alert('Not Valid Email', res)
    User.findOneAndDelete({email})
    .then(e=>Success(res))
    .catch(e => {
      log(e);
      Alert('Server error' ,res)
    })
};

export async function FindMember(req,res) {
  try {
    const Member =await User.find({isMember:true})
    res.json({
      success:true,
      Member
    })
  } catch (error) {
    console.log(error);
    
    res.status(500).json({error :'Server error'})

  }

}