/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../utils/env.js";
import { User } from "../models/user.js";
import { Alert, log, Success } from "../utils/smallUtils.js";
import { CourseEnrollments } from "../models/courseEnrollment.js";
import { Memberships } from "../models/Membership.js";



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
    let {enrolled_course}=req.user_info;
    if (!enrolled_course.length) return res.sendStatus(304);
    let data=[];
    for (let i = 0; i < enrolled_course.length; i++) {
      const {courseEnrollMentID} = enrolled_course[i];
      let courseEnrollment=await CourseEnrollments.findById(courseEnrollMentID);
      if (!courseEnrollment) throw 'courseEnrollments'
      let {id,course_id,course_price}=courseEnrollment;
      let name =(id => {
        if (id===1) return 'Regular Martial Art classes'
        if (id===2) return 'Online Martial Art classes'
        if (id===3) return 'International Martial Art Seminars'
        if (id===4) return 'Join Our Women Self Defence classes'
        if (id===5) return 'Bhangar Fitness Class for all ages'
      })(course_id)
      data.push({
        id,
        price :course_price,
        date:courseEnrollment.Date.toDateString(),
        name
      })
    }
    return res.status(200).json({data})
  } catch (error) {
    res.sendStatus(400)
    console.error({error});
    
  }
}