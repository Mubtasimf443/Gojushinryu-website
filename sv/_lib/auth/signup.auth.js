/*Insha Allah,  Allah is enough for me */ 


import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import {generatePin} from "../generatePin.js";


export const signUpFunction = async (req, res ) => {
  console.log('sign up started');
  
  let userCreatedSuccessFully = false ;
  let {firstname, lastname,  email,  phone ,password ,country } = req.body
  let chekedUser =await User.findOne({email})
  if (chekedUser) return res.json({error : 'You already have an account,  please sign in '})
  try {
    const salt =await bcrypt.genSalt(15)
    let newPassword = await bcrypt.hash('abs',  salt)
    let pin =await generatePin(999999)
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
      .then(data => {
        userCreatedSuccessFully = true
        res.status(201).json({success : true});
       console.log(
        'user created');
          })
      .catch(e => {
        res.status(500).json({error :'Server error,  please report to us '})
      })
      
      
  } catch (e) {
    console.log(e)
  } finally {
     if (!userCreatedSuccessFully) console.log('Failed to create the User')
     if (userCreatedSuccessFully) {
       console.log('user created successFully')
       
       setTimeout(async e => {
         let varifiedUserOrNot = await User.findOne({ email });
         if (!varifiedUserOrNot) return
         if (!varifiedUserOrNot.isRegistered) {
          User.findOneAndDelete(varifiedUserOrNot._id)
         }
       }, 60000)
 
     }
  }
}










