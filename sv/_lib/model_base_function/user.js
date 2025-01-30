/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../utils/env.js";
import { User } from "../models/user.js";
import { Alert, log, Success } from "../utils/smallUtils.js";
import { CourseEnrollments } from "../models/courseEnrollment.js";
import { Memberships } from "../models/Membership.js";
import { request, response } from "express";
import catchError, { namedErrorCatching } from "../utils/catchError.js";
import blackBeltNoticeMail from "../mail/User.notifications.email.js";



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
    if (!rft) return res.redirect('/auth/sign-up');
    jwt.verify(rft,JWT_SECRET_KEY,async (error,data)=>{
        if (error) return res.clearCookie('rft');
        if (data) {
            let {email }=data;
            if (!email) return res.redirect('/auth/sign-in');
            User.findOne({email})
            .then(user => {                
                if (!user) return res.clearCookie('rft').status(401).redirect('/auth/sign-in')      
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
                    thumb :user.thumb?user.thumb:'/img/avatar.png',
                    ID :user.id?? 'error-in-id'
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
    const Member =await User.find({isMember:true});
    
    res.json({
      success:true,
      Member 
    })
  } catch (error) {
    console.log(error);
    
    res.status(500).json({error :'Server error'})

  }

}
export async function getUserData(req,res) {
  try {
    let id =req.user_info._id;
    let user =await User.findById(id);
    if (!user) return res.sendStatus(400);
    if (user) return res.json({
      user:{
        name :user.first_name+' '+user.last_name,
        email :user.email,
        thumb :user.thumb,
        id :user.id,
        _id :user._id,
        joining_data:user.joining_date,
        notification:user.notification
      }
    })
  } catch (e) {
    log(e)
    return res.sendStatus(400)
  }
}
export async function getUserMembershipJS(req,res) {
  try {
    let {memberShipArray}=req.user_info;
    if (!memberShipArray.length) return res.sendStatus(304);
    let data=[];
    for (let i = 0; i < memberShipArray.length; i++) {
      const {_id} = memberShipArray[i];
      let membership=await Memberships.findById(_id)   ;
      if (!membership) throw 'error ,there is no membership'
      
      data.push({
        no :membership.id,
        date:membership.Date.toDateString(),
        name :membership.membership_company+" "+membership.membership_type+" membership",
        organization :membership.membership_company,
        type :membership.membership_type
      })  
    };
    return res.status(200).json({
      data
    })
  } catch (error) {
    res.sendStatus(400)
    console.log({error});   
  }
}
export async function getUserEnrolledCourseApi(req,res) {
  try {
    return res.status(200).json(req.user_info.enrolled_course);
  } catch (error) {
    res.sendStatus(400)
    console.error({error});
    
  }
}



async function getUserSocialMedia(req = request, res = response) {
  try {
    let social_media_details=req.user_info.social_media_details;
    let user=req.user_info;
    return res.status(200).json({
      facebook : user.social_media_details?.facebook?.hasDetails ? decodeURIComponent(user.social_media_details?.facebook?.account) : undefined,
      linkedin:user.social_media_details?.linkedin?.hasDetails ? decodeURIComponent(user.social_media_details?.linkedin?.account) : undefined,
      twitter:user.social_media_details?.twitter?.hasDetails ? decodeURIComponent(user.social_media_details?.twitter?.account) : undefined,
      instagram:user.social_media_details?.instagram?.hasDetails ? decodeURIComponent(user.social_media_details?.instagram?.account) : undefined,
    });
  } catch (error) {
    catchError(res, error)
  }
}

async function upDateSmFacebook(req = request, res = response) {
  try {
    let account = req.body.account;
    if (typeof account !== 'string') namedErrorCatching('parameter error', 'account show be a string');
    account=account.trim();
    let user=req.user_info;
    if (account.length===0) {
      user.social_media_details.facebook.hasDetails=false;
      user.social_media_details.facebook.account=undefined;

      await user.save();
      return res.sendStatus(202)
    } else {
      user.social_media_details.facebook.hasDetails=true;
      user.social_media_details.facebook.account=encodeURIComponent(account);
      await user.save();
      return res.sendStatus(202)
    }
  } catch (error) {
    catchError(res, error)

  }
}


async function upDateSmLinkedin(req = request, res = response) {
  try {
    let account = req.body.account;
    if (typeof account !== 'string') namedErrorCatching('parameter error', 'account show be a string');
    account=account.trim();
    let user=req.user_info;
    if (account.length===0) {
      user.social_media_details.linkedin.hasDetails=false;
      user.social_media_details.linkedin.account=undefined;

      await user.save();
      return res.sendStatus(202)
    } else {
      user.social_media_details.linkedin.hasDetails=true;
      user.social_media_details.linkedin.account=encodeURIComponent(account);
      await user.save();
      return res.sendStatus(202)
    }
  } catch (error) {
    catchError(res, error)

  }
}

 async function upDateSmTwitter(req = request, res = response) {
  try {
    let account = req.body.account;
    if (typeof account !== 'string') namedErrorCatching('parameter error', 'account show be a string');
    account=account.trim();
    let user=req.user_info;
    if (account.length===0) {
      user.social_media_details.twitter.hasDetails=false;
      user.social_media_details.twitter.account=undefined;

      await user.save();
      return res.sendStatus(202)
    } else {
      user.social_media_details.twitter.hasDetails=true;
      user.social_media_details.twitter.account=encodeURIComponent(account);
      await user.save();
      return res.sendStatus(202)
    }
  } catch (error) {
    catchError(res, error)

  }
}

 async function upDateSmInstagram(req = request, res = response) {
  try {
    let account = req.body.account;
    if (typeof account !== 'string') namedErrorCatching('parameter error', 'account show be a string');
    account=account.trim();
    let user=req.user_info;
    if (account.length===0) {
      user.social_media_details.instagram.hasDetails=false;
      user.social_media_details.instagram.account=undefined;
      await user.save();
      return res.sendStatus(202)
    } else {
      user.social_media_details.instagram.hasDetails=true;
      user.social_media_details.instagram.account=encodeURIComponent(account);
      await user.save();
      return res.sendStatus(202)
    }
  } catch (error) {
    catchError(res, error)
  }
}

export const userSocialMedia = {
  getUserSocialMedia,
  upDateSmFacebook,
  upDateSmInstagram,
  upDateSmLinkedin,
  upDateSmTwitter
}

export async function findMemberPageMember(req = request, res = response) {
  try {
    res.status(200).json({ members: (await User.find({},'social_media_details name bio thumb country').where('isMember').equals(true)) });
    return;
  } catch (error) {
    catchError(res, error)
  }
}

export async function makeBlackBeltTotheStudent(req = request, res = response) {
  try {
    let id = req.query.id; id = Number(id);
    if (id.toString() === 'NaN') namedErrorCatching('parametar error', 'id is not a Number');
    let user = await User.findOne({ id });
    if (!user) res.sendStatus(401);
    user.isBlackBelt = true;
    await blackBeltNoticeMail(user.email, user.name);
    await user.save();
    res.sendStatus(202);
    return;
  } catch (error) {
    catchError(res, error);
  }
}


export async function findBlackBeltPageBb(req = request, res = response) {
  try {
    res.status(200).json({ blackBelts: (await User.find({}, 'social_media_details name bio thumb country').where('isBlackBelt').equals(true)) });
    return;
  } catch (error) {
    catchError(res, error)
  }
}

export function UserLogout(req,res) {
  try {
      if (req.cookies.rft) {
          res.clearCookie('rft', { sameSite: true, httpOnly: true });
          res.end();
          return;
      }
  } catch (error) {
      catchError(res,error)
  }
}
