/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../utils/env.js";
import { GM } from "../models/GM.js";
import { Alert, log, Success } from "../utils/smallUtils.js";





export async function GMCornerPageRoute(req,res) {
    //using undefined ,A lot of things to know
    // if (req.cookies.gm_cat ===undefined) return res.render('login_gm_counchil') ;
    //grand master counchil access token
    // if (req.cookies.gm_cat !==undefined) {
    //    await jwt.verify(req.cookies.gm_cat,JWT_SECRET_KEY ,
    //     (err,data)  => {
    //         if(err) return res.clearCookie('gm_cat').status(200).render('login_gm_counchil');
    //         let {email} = data;
    //         if (!email) return res.clearCookie('gm_cat').status(200).render('login_gm_counchil');
            return res.render('grand-master-counchil')
    //    })
    // }
} 




export async function FindGMApi(req,res) {   
    let GmArray = GM.find({})
   .then(data => res.json({success : true, gm: data}))
   .catch(e=> {
      console.log(e);
      res.status(500).json({
        error : 'Server Error,Can not find Gm'
      })
    })
  };




export async function UpdateGmDataAPI(req, res) {
    let {name,  bio, first_name,  last_name, email, phone, id,  password} = req.body;
    let testArray = [name,  bio, first_name,  last_name, email, phone,  id,  password];
    
    let FoundEmtyIndex =await testArray.findIndex(el => !el)
    if (FoundEmtyIndex > -1) return Alert('You Can not Use Emty Feild To Update',res);
    await GM.findOneAndUpdate({email}, {
      name,  bio, first_name,  last_name, email, phone, id,  password
      
    })
   .then(data => res.json({success :true}))
   .catch(e => {
     Alert('failed to update data ', res )
   })
    
  };




export async function CreateGMApi(req,res) {

    let {name, organization, email, password,username} = req.body;
    let testArray = [name, organization, email, password,username];
    let FoundEmtyIndex = await testArray.findIndex(el => !el)
    if (FoundEmtyIndex > -1) return Alert('You Can not Use Emty Feild To Update', res);
    if (!email.includes('@') ||!email.includes('.')  ) return Alert('Email is not correct', res);

    try {
    let gm =await GM.findOne({email});
    if (gm) return Alert('A Grand master Account Exist Form this email',res)
     gm =await GM.findOne({username});
    if (gm) return Alert('A Grand master Account Exist Form this username',res)
    } catch (error) {
      log(e)
      return Alert('Server error',res)
    }
    GM.create({
      name, organization, email, password,username
    })
   .then(e => res.status(201).json({
     success : true
   }))
    .catch(e => {
    res.json({ error: 'Failed To Create Grand Master Account' })
    })
 
};




export async function DeleteGMAccount(req, res) {
    let {id}=req.body;
    if (Number(id).toString().toLowerCase() ==='nan') return Alert('Server error')
    GM.findOneAndDelete({
      id
    })
   .then(data => {
       Success(res)
     }
    )
   .catch(e => {
     console.log(e);
     Alert('Error, Failed To Delete Account, Does It exist? ',res)
   })
  };