/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../utils/env.js";
import { GM } from "../models/GM.js";
import { Alert, log, Success } from "../utils/smallUtils.js";
import bcrypt from 'bcryptjs'
import { validate } from "string-player";




export async function GMCornerPageRoute(req, res) {
  try {


    //  using undefined ,A lot of things to know
    if (req.cookies.gm_cat === undefined) return res.render('login_gm_counchil');
    // grand master counchil access token
    if (req.cookies.gm_cat !== undefined) {
      await jwt.verify(req.cookies.gm_cat, JWT_SECRET_KEY,
        async (err, data) => {
          if (err) return res.clearCookie('gm_cat').status(200).render('login_gm_counchil');
          let { email } = data;
          if (!email) return res.clearCookie('gm_cat').status(200).render('login_gm_counchil');
          let gm = await GM.findOne({ email });
          let { name, organization, username, image, id, bio, _id } = gm;
          if (!gm) return res.json({ error: 'Unknown error' })
          return res.render('grand-master-counchil', { name, organization, username, image, id, bio, _id })
        })
    }
  } catch (error) {
    console.log({ error: 'server error : ' + error });
  }
}




export async function FindGMApi(req, res) {
  let GmArray = GM.find({})
    .then(data => res.json({ success: true, gm: data }))
    .catch(e => {
      console.log(e);
      res.status(500).json({
        error: 'Server Error,Can not find Gm'
      })
    })
};




export async function UpdateGmDataAPI(req, res) {
  try {
    let { email } = req.gm_info;
    console.log({ email });

    let { name, bio, organization, username, password } = req.body;
    let testArray = [name, bio, organization, username, password];
    let FoundEmtyIndex = await testArray.findIndex(el => !el)
    if (FoundEmtyIndex > -1) {
      console.log({ name, bio, organization, username, password });

      return Alert('You Can not Use Emty Feild To Update', res)
    }

    let salt = await bcrypt.genSalt()
    password = await bcrypt.hash(password, salt)
    await GM.findOneAndUpdate({ email }, {
      name, bio, organization, username, password
    })
      .then(data => res.json({ success: true }))
      .catch(e => {
        Alert('failed to update data ', res)
      })
  } catch (error) {
    console.error({ error });
  }
};




export async function CreateGMApi(req, res) {
  try {
    let { name, organization, email, password, username } = req.body;
    let testArray = [name, organization, email, password, username];
    let FoundEmtyIndex = await testArray.findIndex(el => !el);
    if (FoundEmtyIndex > -1) return Alert('You Can not Use Emty Feild To Update', res);
    if (!validate.isEmail(email)) return Alert('Email is NOT Valid', res);
    let salt = await bcrypt.genSalt(8);
    password = await bcrypt.hash(password, salt);
    let isGmExistFromEmail = (await GM.findOne({ email: email.toLowerCase().trim() })) !== null ;
    let isGmExistFromUsername = (await GM.findOne({ username: username.toLowerCase().trim() })) !== null  ;
    if (isGmExistFromEmail) return Alert('A Grand master Account Exist Form this email', res);
    if (isGmExistFromUsername) return Alert('A Grand master Account Exist Form this Username', res);
    await GM.create({ name, organization, email, password, username });
    return res.status(201).json({ success: true })
  } catch (error) {
    console.error(error);
    return Alert('Server error', res)
  }
}




export async function DeleteGMAccount(req, res) {
  try {
    let { id } = req.body;
    if (Number(id).toString().toLowerCase() === 'nan' || Number(id) === 0) return Alert('gm id is not correct')
    await GM.findOneAndDelete().where('id').equals(id)
    Success(res);
    return;
  } catch (error) {
    console.error(error);

  }
};



