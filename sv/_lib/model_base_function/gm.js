/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../utils/env.js";
import { GM } from "../models/GM.js";
import { Alert, log, Success } from "../utils/smallUtils.js";
import bcrypt from 'bcryptjs'
import { tobe, validate } from "string-player";
import { request, response } from "express";
import catchError, { namedErrorCatching } from "../utils/catchError.js";
import { UploadImgFile } from "../api/formidable.file.post.api.js";
import { Cloudinary } from "../Config/cloudinary.js";
import {  v4 as uuid } from "uuid";

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
    let isGmExistFromEmail = (await GM.findOne({ email: email.toLowerCase().trim() })) !== null;
    let isGmExistFromUsername = (await GM.findOne({ username: username.toLowerCase().trim() })) !== null;
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


export async function updateGmFromControlPanal(req = request, res = response) {
  try {
    let { name, email, organization, username, password } = req.body;
    [name, email, organization, username, password] = [name, email, organization, username, password].map(function (element) {
      return element?.trim()
    })
    if (!name || !tobe.minMax(name, 5, 200)) namedErrorCatching('parameter error', 'name is not correct');
    if (validate.isEmail(email) === false) namedErrorCatching('parameter error', 'email is not correct');
    if (!organization || !tobe.minMax(organization, 5, 200)) namedErrorCatching('parameter error', 'organization is not correct');
    if (!username || !tobe.minMax(username, 5, 200)) namedErrorCatching('parameter error', 'username is not correct');
    if (!password || !tobe.minMax(password, 5, 200)) namedErrorCatching('parameter error', 'password is not correct');

    let salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    let gm = await GM.findOne({ email })
    if (gm === null) throw 'No gm exist from this email :' + email;

    gm.name = name;
    gm.email = email;
    gm.organization = organization;
    gm.username = username;
    gm.password = password;

    await gm.save();
    return res.sendStatus(200)
  } catch (error) {
    catchError(res, error);
  }
}


export async function grandMasterImageChange(req = request, res = response) {
  try {
    let email = await getGmEmailFromCookies(req.cookies.gm_cat);
    let gm = await GM.findOne({ email })
    if (gm === null) throw 'No gm exist from this email :' + email;
    let [path, feilds] = await UploadImgFile(req, 'image');
    let url = (await Cloudinary.uploader.upload(path, { public_id: uuid(), resource_type:'image'})).url;
    gm.image = url;
    await gm.save();
    return res.status(200).send(url);
  } catch (error) {
    catchError(res, error);
  }
}

function getGmEmailFromCookies(cookie='') {
  return new Promise((resolve, reject) => {
    jwt.verify(cookie, JWT_SECRET_KEY,function(error , decoded) {
      if (error) return reject(error);
      if (decoded?.email ) return resolve(decoded?.email);
      else throw 'grand master cookie is not valid';
    })
  })
  
}
