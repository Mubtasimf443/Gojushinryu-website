/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import jwt from "jsonwebtoken";
import { Footer, JWT_SECRET_KEY, LinksHbs, whiteHeader } from "../utils/env.js";
import { User } from "../models/user.js";
import { Alert, log, Success } from "../utils/smallUtils.js";
import { CourseEnrollments } from "../models/courseEnrollment.js";
import { Memberships } from "../models/Membership.js";
import { request, response } from "express";
import catchError, { namedErrorCatching } from "../utils/catchError.js";
import blackBeltNoticeMail from "../mail/User.notifications.email.js";
import { studentAccountApprovalEmail } from "../mail/user_auth.mail.js";



export const FindUser = async (req, res) => {
  try {
    let users = await User.find({}, 'name thumb admin_approved isBlackBelt id email phone country').where('isRegistered').equals(true).sort({ id: -1 });
    return res.status(200).json(users)
  } catch (e) {
    res.status(500).json({ error: 'Failed to Give you the User' })
  }
}
export async function StudentCornerPageRoute(req = request, res = response) {
  try {
    let { rft } = req.cookies;
    if (!rft) return res.redirect('/auth/sign-up');
    let { authError, serverError, email } = await new Promise(function (resolve, reject) {
      jwt.verify(rft, JWT_SECRET_KEY, function (error, data) {
        error && console.error(error);
        if (error) return resolve({ serverError: true });
        if (!data?.email) return resolve({ authError: true });
        return resolve({ email: data.email })
      });
    });
    if (authError) return res.redirect('/auth/sign-in');
    if (serverError) {
      res.clearCookie('rft', { httpOnly: true, sameSite: true }).redirect('/auth/sign-in');
      return;
    }
    if (email) {
      let user = await User.findOne().where('email').equals(email).where('isRegistered').equals(true);
      if (!user) {
          res.redirect('/auth/sign-up');
          return;
      }
      if (!user.admin_approved) {
        let style =(` 
          <style>
    :root {
      --bg-color: whitesmoke;
      --card-bg: #ffffff;
      --accent-color: #ffaa1c;
      --error-color: #d9534f;
      --text-color: #333;
      --font-family: 'Libre Franklin', sans-serif;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      background-color: var(--bg-color);
      font-family: var(--font-family);
     
     
      color: var(--text-color);
    }
    section{
       display: flex;
      align-items: center;
      justify-content: center;
       height: 100vh;
      padding: 20px;
      
    }
    .access-container {
      background-color: var(--card-bg);
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      padding: 40px;
      text-align: center;
      max-width: 500px;
      width: 100%;
    }
    
    .access-container h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--error-color);
      margin-bottom: 20px;
    }
    
    .access-container p {
      font-size: 1.2rem;
      margin-bottom: 20px;
    }
    
    .access-container .btn {
      display: inline-block;
      padding: 12px 25px;
      font-size: 1rem;
      color: var(--text-color);
      background: var(--accent-color);
      text-decoration: none;
      border-radius: 5px;
      font-weight: 600;
      transition: background 0.3s;
    }
    
    .access-container .btn:hover {
      background: #e69919;
    }
  </style>
        `);
        let html=(`
          <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Access Denied | Student Corner</title>
  <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;600;700&display=swap" rel="stylesheet">
  ${LinksHbs}
  ${style}

</head>
<body>
${whiteHeader}
  <section >
    
 
  <div class="access-container">
    <h1>Access Denied</h1>
    <p>Your access to the Student Corner is Not Approved by the site administrator.</p>
    <p>If you believe this is an error, please contact support.</p>
    <a href="/contact" class="btn">Contact Support</a>
  </div>
     </section>
     ${Footer}
</body>
</html>
        `);
        return res.status(402).send(html);
      }
      if (user === null) namedErrorCatching('Fake Details Error', "No User Exist from email of " + email);
      return res.render('student-corner', {
        bio: user.bio ? user.bio : 'I dream to become black belt in karate and Master Martial Arts',
        name: user.name ? user.name : 'name',
        age: user.age ? user.age : 0,
        gender: user.gender ? user.gender : 'male',
        district: user.district ? user.district : 'name',
        city: user.city ? user.city : '',
        country: user.country ? user.country : '',
        postcode: user.postCode ? user.postCode : 0,
        street: user.street ? user.street : '',
        thumb: user.thumb ? user.thumb : '/img/avatar.png',
        ID: user.id ?? 'error-in-id'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).render('500');
  }
}
export async function BaneUserFunction(req, res) {
  let { email } = req.body;
  if (!email) return Alert('Please Give The Correct User InfoCan not Bann User ', res);
  if (!email.includes('@') && !email.includes('.')) return Alert('Not Valid Email', res)
  User.findOneAndUpdate({ email }, {
    banned: true
  })
    .then(e => Success(res))
    .catch(e => {
      log(e);
      Alert('Server error', res)
    })
};
export async function RemoveFromBanedUserFunction(req, res) {
  let { email } = req.body;
  if (!email) return Alert('Please Give The Correct User InfoCan not Bann User ', res);
  if (!email.includes('@') && !email.includes('.')) return Alert('Not Valid Email', res)
  User.findOneAndUpdate({ email }, {
    banned: false
  })
    .then(e => Success(res))
    .catch(e => {
      log(e);
      Alert('Server error', res)
    })
};
export async function DeleteUserAccount(req = request, res = response) {
  try {
    let id = req.query.id;
    if (Number(id).toString() === 'NaN' || Number(id).toString() === '0') namedErrorCatching('p error', 'id is invalid');
    await User.findOneAndDelete({id});
    res.sendStatus(202);
    return;
  } catch (error) {
    catchError(res,error)
  }
};

export async function getUserData(req = request, res = response) {
  try {
    let id = req.user_info._id;
    let user = await User.findById(id);
    if (!user) return res.sendStatus(400);
    if (user) return res.json({
      user: {
        name: user.first_name + ' ' + user.last_name,
        email: user.email,
        thumb: user.thumb,
        id: user.id,
        _id: user._id,
        joining_data: user.joining_date,
        notification: user.notification
      }
    })
  } catch (e) {
    log(e)
    return res.sendStatus(400)
  }
}
export async function getUserMembershipJS(req = request, res = response) {
  try {
    let { memberShipArray } = req.user_info;
    if (!memberShipArray.length) return res.sendStatus(304);
    let data = [];
    for (let i = 0; i < memberShipArray.length; i++) {
      const { _id } = memberShipArray[i];
      let membership = await Memberships.findById(_id);
      if (!membership) throw 'error ,there is no membership'

      data.push({
        no: membership.id,
        date: membership.Date.toDateString(),
        name: membership.membership_company + " " + membership.membership_type + " membership",
        organization: membership.membership_company,
        type: membership.membership_type
      })
    };
    return res.status(200).json({
      data
    })
  } catch (error) {
    res.sendStatus(400)
    console.log({ error });
  }
}
export async function getUserEnrolledCourseApi(req = request, res = response) {
  try {
    return res.status(200).json(req.user_info.enrolled_course);
  } catch (error) {
    res.sendStatus(400)
    console.error({ error });

  }
}
export async function approveStudent(req = request, res = response) {
  try {
    let id = req.query.id;
    if (Number(id).toString() === 'NaN' || Number(id).toString() === '0') namedErrorCatching('p error', 'id is invalid');
    let user = await User.findOne().where('id').equals(id).where('isRegistered').equals(true);
    if (user) {
      user.admin_approved = true;
      await user.save();
      await studentAccountApprovalEmail({studentEmail :user.email  , studentName : user.last_name});
      return res.sendStatus(200)
    } else return res.sendStatus(204);

  } catch (error) {
    catchError(res, error)
  }
}
export async function AdminApproveUserAfterRegistration(req = request, res = response) {
  try {
    let style =(`
      <style>
    :root {
      --bg-color: whitesmoke;
      --card-bg: #ffffff;
      --accent-color: #ffaa1c;
      --text-color: #333;
      --font-family: 'Libre Franklin', sans-serif;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--font-family);
      background-color: var(--bg-color);
      color: var(--text-color);
     
    }
      main {
       display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      padding: 20px;
      }
    .approval-container {
      background-color: var(--card-bg);
      border-radius: 10px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      padding: 40px;
      text-align: center;
      max-width: 600px;
      width: 100%;
    }

    .approval-container .icon {
      font-size: 4rem;
      color: var(--accent-color);
      margin-bottom: 20px;
    }

    .approval-container h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--accent-color);
      margin-bottom: 20px;
    }

    .approval-container p {
      font-size: 1.2rem;
      margin-bottom: 30px;
      line-height: 1.5;
    }

    .approval-container .btn {
      display: inline-block;
      padding: 12px 25px;
      font-size: 1rem;
      color: var(--text-color);
      background: var(--accent-color);
      text-decoration: none;
      border-radius: 5px;
      font-weight: 600;
      transition: background 0.3s;
    }

    .approval-container .btn:hover {
      background: #e69919;
    }
  </style>
    `);
    let html =(`
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Pending Approval</title>
  <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;600;700&display=swap" rel="stylesheet">
  ${LinksHbs + style}
</head>
<body>
  ${whiteHeader}
  <main>
  <div class="approval-container">
    <div class="icon">⏳</div>
    <h1>Registration Successful!</h1>
    <p>Your student account has been registered. Please wait while the admin reviews and approves your account. You will be notified once your account is activated.</p>
    <a href="/home" class="btn">Return to Home</a>
  </div>
  </main>
  ${Footer}
</body>
</html>
    `);
    res.status(402).send(html)
  } catch (error) {
    catchError(res,error)
  }
}


async function getUserSocialMedia(req = request, res = response) {
  try {
    let social_media_details = req.user_info.social_media_details;
    let user = req.user_info;
    return res.status(200).json({
      facebook: user.social_media_details?.facebook?.hasDetails ? decodeURIComponent(user.social_media_details?.facebook?.account) : undefined,
      linkedin: user.social_media_details?.linkedin?.hasDetails ? decodeURIComponent(user.social_media_details?.linkedin?.account) : undefined,
      twitter: user.social_media_details?.twitter?.hasDetails ? decodeURIComponent(user.social_media_details?.twitter?.account) : undefined,
      instagram: user.social_media_details?.instagram?.hasDetails ? decodeURIComponent(user.social_media_details?.instagram?.account) : undefined,
    });
  } catch (error) {
    catchError(res, error)
  }
}

async function upDateSmFacebook(req = request, res = response) {
  try {
    let account = req.body.account;
    if (typeof account !== 'string') namedErrorCatching('parameter error', 'account show be a string');
    account = account.trim();
    let user = req.user_info;
    if (account.length === 0) {
      user.social_media_details.facebook.hasDetails = false;
      user.social_media_details.facebook.account = undefined;

      await user.save();
      return res.sendStatus(202)
    } else {
      user.social_media_details.facebook.hasDetails = true;
      user.social_media_details.facebook.account = encodeURIComponent(account);
      await user.save();
      return res.sendStatus(202)
    }
  } catch (error) {
    catchError(res, error)

  }
}


async function upDateSmLinkedin(req = request, res = response) {
  try {
    let account = req.body.account;
    if (typeof account !== 'string') namedErrorCatching('parameter error', 'account show be a string');
    account = account.trim();
    let user = req.user_info;
    if (account.length === 0) {
      user.social_media_details.linkedin.hasDetails = false;
      user.social_media_details.linkedin.account = undefined;

      await user.save();
      return res.sendStatus(202)
    } else {
      user.social_media_details.linkedin.hasDetails = true;
      user.social_media_details.linkedin.account = encodeURIComponent(account);
      await user.save();
      return res.sendStatus(202)
    }
  } catch (error) {
    catchError(res, error)

  }
}

async function upDateSmTwitter(req = request, res = response) {
  try {
    let account = req.body.account;
    if (typeof account !== 'string') namedErrorCatching('parameter error', 'account show be a string');
    account = account.trim();
    let user = req.user_info;
    if (account.length === 0) {
      user.social_media_details.twitter.hasDetails = false;
      user.social_media_details.twitter.account = undefined;

      await user.save();
      return res.sendStatus(202)
    } else {
      user.social_media_details.twitter.hasDetails = true;
      user.social_media_details.twitter.account = encodeURIComponent(account);
      await user.save();
      return res.sendStatus(202)
    }
  } catch (error) {
    catchError(res, error)

  }
}

async function upDateSmInstagram(req = request, res = response) {
  try {
    let account = req.body.account;
    if (typeof account !== 'string') namedErrorCatching('parameter error', 'account show be a string');
    account = account.trim();
    let user = req.user_info;
    if (account.length === 0) {
      user.social_media_details.instagram.hasDetails = false;
      user.social_media_details.instagram.account = undefined;
      await user.save();
      return res.sendStatus(202)
    } else {
      user.social_media_details.instagram.hasDetails = true;
      user.social_media_details.instagram.account = encodeURIComponent(account);
      await user.save();
      return res.sendStatus(202)
    }
  } catch (error) {
    catchError(res, error)
  }
}

export const userSocialMedia = {
  getUserSocialMedia,
  upDateSmFacebook,
  upDateSmInstagram,
  upDateSmLinkedin,
  upDateSmTwitter
}



export async function makeBlackBeltTotheStudent(req = request, res = response) {
  try {
    let id = req.query.id; id = Number(id);
    if (id.toString() === 'NaN') namedErrorCatching('parametar error', 'id is not a Number');
    let user = await User.findOne({ id });
    if (!user) res.sendStatus(401);
    user.isBlackBelt = true;
    await blackBeltNoticeMail(user.email, user.name);
    await user.save();
    res.sendStatus(202);
    return;
  } catch (error) {
    catchError(res, error);
  }
}


export async function findBlackBeltPageBb(req = request, res = response) {
  try {
    res.status(200).json({ blackBelts: (await User.find({}, 'social_media_details name bio thumb country').where('isBlackBelt').equals(true)) });
    return;
  } catch (error) {
    catchError(res, error)
  }
}

export function UserLogout(req, res) {
  try {
    if (req.cookies.rft) {
      res.clearCookie('rft', { sameSite: true, httpOnly: true });
      res.end();
      return;
    }
  } catch (error) {
    catchError(res, error)
  }
}
