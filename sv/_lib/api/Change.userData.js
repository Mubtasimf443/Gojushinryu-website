/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { UploadImageToCloudinary } from "../Config/cloudinary.js";
import { JWT_SECRET_KEY } from "../utils/env.js";
import { ImageUrl } from "../models/imageUrl.js";
import { User } from "../models/user.js";
import { log, Success } from "../utils/smallUtils.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import catchError, { namedErrorCatching } from "../utils/catchError.js";
import { bugFromAnErron } from "../model_base_function/Bugs.js";
import { isnota, tobe } from "string-player";
import { request, response } from "express";

let genSaltSync=bcrypt.genSaltSync;
//varible
let simbolError ='you can not use < , > , * , $ , { , } , [ , ] , (, )';


export async function ChangeuserData(req,res) {
    let {rft} =req.cookies;
    let varified=false;//is user varified
    let email =false;
    await jwt.verify(rft,JWT_SECRET_KEY,async (err,data) => {
        if (err) return
        try {
            email =data.email;
            if (!email) return
            if (email) {
            await  User.findOne({email})
                .then(e => varified =true)
                .catch(e => log(e))
            }
        } catch (error) {
            console.log(e);          
        }    
    })
    function alert(params) {
        return res.json({error :params})
    }
    if (!varified ||!email) return alert('You Do not Have the access to Change Data');
  let {
    name,age,bio,gender,District,city,country,postcode,street,ImageUrlForChangeMaking,needsToUpdataProfileImage
  } =req.body;
  if (!name )  return alert('name is not define');
  if (!age)  return alert('age is not define');
  if (!bio)  return alert('bio is not define');
  if (!gender)  return alert('gender is not define');
  if (!country)  return alert('counrty is not define');
  if (!District)  return alert('district is not define');
  if (!city)  return alert('city is not define');
  if (!street)  return alert('street is not define');
  if (!postcode?.trim())  return alert('postcode is not define');
  if (typeof age !== 'number') return alert('age Should Be a number');
  if (name.length >30)  return alert('name is to big');
  if (bio.length >120)  return alert('bio is to big');
  if (country.length >40)  return alert('country is to big');
  if (District.length >38)  return alert('district is to big');
  if (city.length >30)  return alert('city is to big');
  if (street.length >45)  return alert('street is to big');
  if (name.length <6)  return alert('name is to short');
  if (bio.length <60)  return alert(' bio is to short ,less than 60 charecters');
  if (country.length <3)  return alert('country is to short');
  if (District.length <4)  return alert('district is to short');
  if (city.length <4)  return alert('city is to short');
  if (street.length <8)  return alert('street is to short');
  if (gender.toLowerCase() !== 'male' && gender.toLowerCase() !== 'female')  return alert('male and female should be use in gender');
  if (name.includes('<'))  return alert(simbolError);
  if (bio.includes('<'))  return alert(simbolError);
  if (country.includes('<'))  return alert(simbolError);
  if (District.includes('<'))  return alert(simbolError);
  if (city.includes('<'))  return alert(simbolError);
  if (street.includes('<'))  return alert(simbolError);
  if (name.includes('>'))  return alert(simbolError);
  if (bio.includes('>'))  return alert(simbolError);
  if (country.includes('>'))  return alert(simbolError);
  if (District.includes('>'))  return alert(simbolError);
  if (city.includes('>'))  return alert(simbolError);
  if (street.includes('>'))  return alert(simbolError);
  if (name.includes('*'))  return alert(simbolError);
  if (bio.includes('*'))  return alert(simbolError);
  if (country.includes('*'))  return alert(simbolError);
  if (District.includes('*'))  return alert(simbolError);
  if (city.includes('*'))  return alert(simbolError);
  if (street.includes('*'))  return alert(simbolError);
  if (name.includes('{'))  return alert(simbolError);
  if (bio.includes('{'))  return alert(simbolError);
  if (country.includes('{'))  return alert(simbolError);
  if (District.includes('{'))  return alert(simbolError);
  if (city.includes('{'))  return alert(simbolError);
  if (street.includes('{'))  return alert(simbolError);
  if (name.includes('('))  return alert(simbolError);
  if (bio.includes('('))  return alert(simbolError);
  if (country.includes('('))  return alert(simbolError);
  if (District.includes('('))  return alert(simbolError);
  if (city.includes('('))  return alert(simbolError);
  if (street.includes('('))  return alert(simbolError);
  if (name.includes('['))  return alert(simbolError);
  if (bio.includes('['))  return alert(simbolError);
  if (country.includes('['))  return alert(simbolError);
  if (District.includes('['))  return alert(simbolError);
  if (city.includes('['))  return alert(simbolError);
  if (street.includes('['))  return alert(simbolError);
   if (typeof needsToUpdataProfileImage !== 'boolean') return alert('You are restricted for making Change')
    
   if (needsToUpdataProfileImage) {
    if (typeof ImageUrlForChangeMaking !== 'string') return alert('You are restricted form making Change');
    if (ImageUrlForChangeMaking.includes('['))  return alert(simbolError);
    if (ImageUrlForChangeMaking.includes(']'))  return alert(simbolError);
    if (ImageUrlForChangeMaking.includes('*'))  return alert(simbolError);
    if (ImageUrlForChangeMaking.includes('}'))  return alert(simbolError);
    if (ImageUrlForChangeMaking.includes('['))  return alert(simbolError);
    if (ImageUrlForChangeMaking.includes('('))  return alert(simbolError);
    if (ImageUrlForChangeMaking.includes(')'))  return alert(simbolError);
    if (ImageUrlForChangeMaking.includes('{'))  return alert(simbolError);
    if (ImageUrlForChangeMaking.includes('@'))  return alert(simbolError);
    if (ImageUrlForChangeMaking.includes('$'))  return alert(simbolError);
    if (!ImageUrlForChangeMaking.includes('.jpg'))  return alert(simbolError);//our provided url contains .jpg
    if (!ImageUrlForChangeMaking.includes('http'))  return alert(simbolError);
    if (!ImageUrlForChangeMaking.includes('/temp/') && !ImageUrlForChangeMaking.includes('/img/') )  return alert(simbolError);
   
    
    let image =undefined;
    let err =undefined;
    await ImageUrl.findOne({url :ImageUrlForChangeMaking})
    .then( data => { 
        data ? image = data.urlpath : err =true;
    })
    .catch(e => {
        console.log(e);
        err =e;
    })
    if (err) return alert('You can Not change The account') ;
    let cloudinaryData = await UploadImageToCloudinary(image);
    if (cloudinaryData.error) return alert('Sorry Failed to change') ;
    if (cloudinaryData.image) 
    await  User.findOneAndUpdate({email},{
        name,age,bio,gender,district :District,city,country,postCode:postcode,street ,thumb:cloudinaryData.image.url
        })
        .then(e => {
            return Success(res)
        })
        .catch(e => alert('Failed To change')  )
    }
   if (!needsToUpdataProfileImage) {
    User.findOneAndUpdate({email},{
        name,gender,age,bio,district :District,city,country,postCode:postcode,street 
        })
    .then(e => Success(res))
    .catch(e => { log(e);alert('Failed To change')} )
   }
  
}


export async function changeUserPasswordAPI(req=request,res=response) {
    try {
        let user=req.user_info;
        let password=req.body.password;
        if (!password || isnota.string(password)) namedErrorCatching('p error', 'password emty or not string');
        if (!tobe.minMax(password, 6 , 100))  namedErrorCatching('p error', 'password wrong in size');
        let salt= genSaltSync(12);
        password = bcrypt.hashSync(password, salt);
        user.password=password;
        await user.save().then(e => log('password updated'));
       
        return res.status(202).json({ success: true })
    } catch (error) {
        catchError(res, error);
    }
}