/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  InshaAllah  */
import bcrypt from 'bcryptjs'
import { User } from "../models/user.js";
import { log } from '../utils/smallUtils.js';
import { response } from 'express';
import jwt from 'jsonwebtoken'
import {generatePin} from '../utils/generatePin.js'
import { JWT_SECRET_KEY } from '../utils/env.js';
import { GM } from '../models/GM.js';


export const loginApiFunc =async (req, res) => {
 // log('sign in started')
  if (req.cookies.rft) return res.json({error:'You have Login Before'})
  let {password,  email } = req.body ; 
  if (!password) return res.json({error:'password is not define'})
  if (!email) return res.json({error:'email is not  define'})
  if (email.trim().length < 5 || email.trim().length > 36) return res.json({error:'email is not valid'});
  if (password.trim().length < 4 || password.trim().length > 25) return res.json({error:'email is not valid'});
  if (!email.toString().includes('@')) return res.json({error:'email is not valid'})
  if (!email.toString().includes('.')) return res.json({error:'email is not valid'})
  if (email.toString().includes('"')) return res.json({error:'email is not valid'})
  if (email.toString().includes("'")) return res.json({error:'email is not valid'})
  if (email.toString().includes('{')) return res.json({error:'email is not valid'})
  if (email.toString().includes('}')) return res.json({error:'email is not valid'})
  if (password.toString().includes('"')) return res.json({error:'password is not valid'})
  if (password.toString().includes("'")) return res.json({error:'password is not valid'})
  if (password.toString().includes('{')) return res.json({error:'password is not valid'})
  if (password.toString().includes('}')) return res.json({error:'password is not valid'})
 // console.log('email + pass are valid');
  
  try {
    let user = await User.findOne({email})
    if (!user) return res.json({error : 'not user info match ,Please Create an account'});
    //console.log('user is found');
    
    let passwordMatch = await bcrypt.compareSync(password,user.password)/* password ===user.password*///testing the password
    if (!passwordMatch) return res.json({error : 'password not match ,Please Create a give the correct'});
  log('passwordMatch : '+passwordMatch);
    let rft=await jwt.sign({
     email,
     pin: generatePin(67896),
     key :'oeoihdojkcsuw3t7uwsudjkckncksjuefglhd.clseiy48y39efjdion dcbakgwiqfiwilaso;aowiry38t48tfjdbdbv dsffuoee7'
     //pin and key is only used to make cookie big enoughf without using a large data 
     //and big cookie can make hacker more confuse
    },  JWT_SECRET_KEY, {});
    // log('cookie done')
    return  res.cookie('rft',
      rft,
      {sameSite : true,  expires : new Date( Date.now() + (1000*60 *60 *24 *30))})
    .status(200)
    .json({success :true})
  } catch (e) {
   log(e);
   try {
    res.status(500).json({error:'Server error , Please inform us '})
   } catch (error) {
    console.log(error);
    
   }
  }
}


export const GMLoginApiFunc =async (req, res) => {
  // log('sign in started')
   if (req.cookies.rft) return res.json({error:'You have Login Before'})
   let {password,  email } = req.body ; 
   if (!password) return res.json({error:'password is not define'})
   if (!email) return res.json({error:'email is not  define'})
   if (email.trim().length < 5 || email.trim().length > 36) return res.json({error:'email is not valid'});
   if (password.trim().length < 4 || password.trim().length > 25) return res.json({error:'email is not valid'});
   if (!email.toString().includes('@')) return res.json({error:'email is not valid'})
   if (!email.toString().includes('.')) return res.json({error:'email is not valid'})
   if (email.toString().includes('"')) return res.json({error:'email is not valid'})
   if (email.toString().includes("'")) return res.json({error:'email is not valid'})
   if (email.toString().includes('{')) return res.json({error:'email is not valid'})
   if (email.toString().includes('}')) return res.json({error:'email is not valid'})
   if (password.toString().includes('"')) return res.json({error:'password is not valid'})
   if (password.toString().includes("'")) return res.json({error:'password is not valid'})
   if (password.toString().includes('{')) return res.json({error:'password is not valid'})
   if (password.toString().includes('}')) return res.json({error:'password is not valid'})
  // console.log('email + pass are valid');
   
   try {
     let user = await GM.findOne({email})
     if (!user) return res.json({error : 'not user info match ,Please Create an account'});
     //console.log('user is found');
     let passwordMatch = await bcrypt.compareSync(password,user.password)/* password ===user.password*///testing the password
     if (!passwordMatch) return res.json({error : 'password not match ,Please Create a give the correct'});
     log('passwordMatch : '+passwordMatch);
     let rft=await jwt.sign({
      email,
      pin: generatePin(67896),
      key :'oeoihdojkcsuw3t7uwsudjkckncksjuefglhd.clseiy48y39efjdion dcbakgwiqfiwilaso;aowiry38t48tfjdbdbv dsffuoee7'
      //pin and key is only used to make cookie big enoughf without using a large data 
      //and big cookie can make hacker more confuse
     },  JWT_SECRET_KEY, {});
     // log('cookie done')
     return  res.cookie('gm_cat',
       rft,
       {sameSite : true,  expires : new Date( Date.now() + (1000*60 *60 *24 *30))})
     .status(200)
     .json({success :true})
   } catch (e) {
    log(e);
    try {
     res.status(500).json({error:'Server error , Please inform us '})
    } catch (error) {
     console.log(error);
     
    }
   }
 }