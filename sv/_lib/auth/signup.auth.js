/*Insha Allah,  Allah is enough for me */


import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.js';
import { generatePin } from "../utils/generatePin.js";
import { course_purchase_user_email } from '../mail/Course.mail.js';
import { user_varification_user_mail } from '../mail/user_auth.mail.js';
import { log } from '../utils/smallUtils.js';
import { JWT_SECRET_KEY } from '../utils/env.js';
import { request, response } from 'express';
import catchError, { namedErrorCatching } from '../utils/catchError.js';
import { bugFromAnErron } from '../model_base_function/Bugs.js';
import { isnota, repleCrAll, tobe, validate } from 'string-player';


export async function signUpFunction(req = request, res = response) {
  try {
    let userCreatedSuccessFully = false;
    let { firstname, lastname, email, phone, password, country } = req.body;
    {
      if (validate.isEmty(firstname)) namedErrorCatching('parameter error', 'firstname is emty');
      if (validate.isEmty(lastname)) namedErrorCatching('parameter error', 'lastname is emty');
      if (validate.isEmty(email)) namedErrorCatching('parameter error', 'email is emty');
      if (validate.isEmty(password)) namedErrorCatching('parameter error', 'password is emty');
      if (validate.isEmty(country)) namedErrorCatching('parameter error', 'country is emty');
      if (isnota.num(phone)) namedErrorCatching('parameter error', 'phone is not a number');
      if (validate.isNaN(phone)) namedErrorCatching('parameter error', 'phone is not a number');
      if (!validate.isEmail(email)) namedErrorCatching('parameter error', 'email is not a email');
      if (!tobe.max(firstname, 50,true)) namedErrorCatching('parameter error', 'firstname is not correct');
      if (!tobe.max(lastname, 50,true)) namedErrorCatching('parameter error', 'lastname is not correct');
      if (!tobe.max(email, 100,true)) namedErrorCatching('parameter error', 'email is not correct');
      if (!tobe.max(country, 50,true)) namedErrorCatching('parameter error', 'country is not correct');
      if (!tobe.max(password, 100,true)) namedErrorCatching('parameter error', 'email is not correct');
      [firstname, lastname, country] = repleCrAll([firstname, lastname, country]);
    }
    let chekedUser = await User.findOne({ email });
    if (chekedUser && chekedUser?.isRegistered === true) return res.json({ error: 'You already have an account,  please sign in ' });
    (chekedUser && chekedUser.isRegistered === false) && (await User.findByIdAndDelete(chekedUser._id).catch(error => console.error(error)));
    const salt = await bcrypt.genSalt(12)
    let newPassword = await bcrypt.hash(password, salt)
    let pin = await generatePin(9999999)
    let data = await User.create({
      id: Date.now(),
      name: firstname + ' ' + lastname,
      first_name: firstname,
      last_name: lastname,
      pin,
      email,
      password: newPassword,
      phone,
      isRegistered: false,
      country
    });

    let isMailSend = await user_varification_user_mail({ to: data.email, otp: pin, user: data.name });
    if (isMailSend === false) {
      await User.findOneAndDelete({ email });
      res.status(400).json({ error: 'Please Give a Valid Email' });
      return;
    }
    let token = await jwt.sign({ email }, JWT_SECRET_KEY, {});
    res.cookie('vft', token, { expires: (new Date(Date.now() + 1000 * 64)), httpOnly: true }).status(201).json({ success: true });

  } catch (error) {
    catchError(res, error);
  } finally {
    let SignUpTimeOut = setTimeout(async function () {
      try {
        let user = await User.findOne({ email });
        if (user === null) return clearTimeout(SignUpTimeOut);
        if (user.isRegistered === false) await User.findOneAndDelete({ email });
      } catch (error) {
        bugFromAnErron(error, 'Auth-delete-user-after-200s-error');
      } finally { clearTimeout(SignUpTimeOut) }
    }, 200000)
  }
}


