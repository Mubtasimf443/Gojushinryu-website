/*Insha Allah,  Allah is enough for me */ 


import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import {generatePin} from "../generatePin.js";
import { course_purchase_user_email } from '../mail/Course.mail.js';
import { user_varification_user_mail } from '../mail/user_auth.mail.js';
import { log } from '../smallUtils.js';
import { JWT_SECRET_KEY } from '../env.js';


export const signUpFunction = async (req, res ) => {
 // console.log('sign up started');
  
  let userCreatedSuccessFully = false ;
  let {firstname, lastname,  email,  phone ,password ,country } = req.body
  let chekedUser =await User.findOne({email})
  if (chekedUser) return res.json({error : 'You already have an account,  please sign in '})
  try {
    const salt =await bcrypt.genSalt(12)
    let newPassword = await bcrypt.hash(password,  salt)
    let pin =await generatePin(9999999)
    await User.create({
      first_name:firstname,
       last_name:lastname,
       pin, 
       email,
       password:newPassword,
       phone,
       isRegistered:false  ,
       country
    })
    .then(async data => {
     await  user_varification_user_mail({to:email,otp:pin})
    .then(async boolean=>{
        if (boolean) { 
          userCreatedSuccessFully=true;
          try {
            let token=await jwt.sign({
              email,
              key:'wyieiwuxhk xsudywsxaslkaoedhxx ,mx avwqer62739728405482p9210936389290'//just making harder to hack
             },JWT_SECRET_KEY,{});
             res
             .cookie('vft',token,{
              expires: new Date(Date.now() + 1000*64// *60*24*30
            ),
              httpOnly:true
             })
             .status(201)
             .json({
              success:true
             });
          } catch (error) {
            console.log(error);
           return  res.status(500).json({error :'Server error,  please report to us '})

          }
        }
        if (!boolean) {
           User.findOneAndDelete({email}).then(async e => {
          //  console.log('email deleted');
            
           }) 
          }
       })    
          })
    .catch(e => {
      console.log(e);  
      return  res.status(500).json({error :'Server error,  please report to us '})
      }) 
  } catch (e) {
    console.log(e);
    return res.status(500).json({error:'server error'})
  } finally {
     if (!userCreatedSuccessFully) console.log('Failed to create the User')
     if (userCreatedSuccessFully) {
     //  console.log('user created successFully')
       
       setTimeout(async e => {
         let varifiedUserOrNot = await User.findOne({ email });
       //  console.log(varifiedUserOrNot);
         
         if (!varifiedUserOrNot) return
         if (!varifiedUserOrNot.isRegistered) {
          User.findOneAndDelete({email}).then(e =>{
           console.log('deleted after 60s');
            
          })
         }
       }, 64000)
 //     log('finished')
 
     }
  }
}

