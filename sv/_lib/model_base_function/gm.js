/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../utils/env.js";
import { GM } from "../models/GM.js";
import { Alert, log, Success } from "../utils/smallUtils.js";
import bcrypt from 'bcryptjs' 




export async function GMCornerPageRoute(req,res) {
  try {
    

  //  using undefined ,A lot of things to know
    if (req.cookies.gm_cat ===undefined) return res.render('login_gm_counchil') ;
    // grand master counchil access token
    if (req.cookies.gm_cat !==undefined) {
        await jwt.verify(req.cookies.gm_cat,JWT_SECRET_KEY ,
       async (err,data)  => {
            if(err) return res.clearCookie('gm_cat').status(200).render('login_gm_counchil');
            let {email} = data;
            if (!email) return res.clearCookie('gm_cat').status(200).render('login_gm_counchil');
            let gm =await GM.findOne({email});  
            let {name ,organization,username,image,id ,bio ,_id}=gm;
            if (!gm) return res.json({error:'Unknown error'})
            return res.render('grand-master-counchil' ,{name ,organization,username,image,id,bio ,_id})
       })
    }
  } catch (error) {
   console.log({error:'server error : '+error});
  }
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
  try {
    let {email} =req.gm_info;
    console.log({email});
    
    let {name,bio,organization, username,password} = req.body;
    let testArray = [name,  bio,organization, username,password];
    let FoundEmtyIndex =await testArray.findIndex(el => !el)
    if (FoundEmtyIndex > -1) {
      console.log({name,  bio,organization, username,password});
      
      return Alert('You Can not Use Emty Feild To Update',res)
    }

    let salt =await bcrypt.genSalt()
    password=await bcrypt.hash(password,salt)
    await GM.findOneAndUpdate({email}, {
      name,bio,organization, username,password
    })
   .then(data => res.json({success :true}))
   .catch(e => {
     Alert('failed to update data ', res )
   })
  } catch (error) {
    console.error({error});
  }
  };




export async function CreateGMApi(req,res) {

    let {name, organization, email, password,username} = req.body;
    let testArray = [name, organization, email, password,username];
    let FoundEmtyIndex = await testArray.findIndex(el => !el)
    if (FoundEmtyIndex > -1) return Alert('You Can not Use Emty Feild To Update', res);
    if (!email.includes('@') ||!email.includes('.')  ) return Alert('Email is not correct', res);

    try {
    let salt =await bcrypt.genSalt(12);
    password=await bcrypt.hash(password,salt)
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



