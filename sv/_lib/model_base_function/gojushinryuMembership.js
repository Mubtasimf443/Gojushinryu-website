/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import { request, response } from "express";
import catchError, { namedErrorCatching } from "../utils/catchError.js";
import { repleCaracter, repleCrAll, validate,log } from "string-player";
import GojushinryuMembership from "../models/GojushinryuMembership.js";
import { sendMembershipAlreadySendRequestedEmail } from "../mail/sendMembershipAlreadySendRequestedEmail.mail.js";
import { BASE_URL, Footer, LinksHbs, noindex_meta_tags, whiteHeader } from "../utils/env.js";
import { User } from "../models/user.js";
import { gmembershipAprovedStudent } from "../mail/gmembershipAproved.mail.js";
import { GMembershipNotApprovedEmail, sendMembershipApplicationReceivedEmail, sendMembershipRequestNotificationToAdmin } from "../mail/gmembership.mail.js";


async function requestGojushinryuMembership(req=request, res=response) {
    try {
        let { fname, lname, email, phone, date_of_birth, country, city, district, postcode, doju_Name, instructor } = req.body;
        let { current_grade, violance_charge, permanent_disabillity, membership_expiring_date, previous_injury, membeship_array } = req.body;
        let { experience_level, has_violance_charge, has_permanent_injury, gender, is_previous_member, } = req.body;
       
        { //emty check
            if (validate.isEmty(fname)) namedErrorCatching('parameter error', 'fname is emty');
            if (validate.isEmty(lname)) namedErrorCatching('parameter error', 'lname is emty');
            if (!validate.isEmail(email)) namedErrorCatching('parameter error', 'email is not a email');
            if (validate.isEmty(phone)) namedErrorCatching('parameter error', 'phone is emty');
            if (validate.isEmty(date_of_birth)) namedErrorCatching('parameter error', 'date_of_birth is emty');
            if (validate.isEmty(country)) namedErrorCatching('parameter error', 'country is emty');
            if (validate.isEmty(city)) namedErrorCatching('parameter error', 'city is emty');
            if (validate.isEmty(district)) namedErrorCatching('parameter error', 'district is emty');
            if (validate.isEmty(postcode)) namedErrorCatching('parameter error', 'postcode is emty');
            if (validate.isEmty(doju_Name)) namedErrorCatching('parameter error', 'doju_Name is emty');
            if (validate.isEmty(instructor)) namedErrorCatching('parameter error', 'instructor is emty');
            if (validate.isEmty(current_grade)) namedErrorCatching('parameter error', 'current_grade is emty');
            if (validate.isEmty(gender)) namedErrorCatching('parameter error', 'instructor is emty');
            if (validate.isEmty(!Array.isArray(membeship_array))) namedErrorCatching('parameter error', 'membeship_array is not array');
        }
       
        { //Yes No gender experience_level Check
            if (gender !== 'Male' && gender !== 'Female') namedErrorCatching('parameter error', 'Gender is not correct');
            if (has_violance_charge !== 'Yes' && has_violance_charge !== 'No') namedErrorCatching('parameter error', 'Violance charge is not correct');
            if (has_permanent_injury !== 'Yes' && has_permanent_injury !== 'No') namedErrorCatching('parameter error', 'Violance charge is not correct');
            if (is_previous_member !== 'Yes' && is_previous_member !== 'No') namedErrorCatching('parameter error', 'Violance charge is not correct');
            if (experience_level !== 'Senior' && experience_level !== 'Junior') namedErrorCatching('parameter error', 'experience_level is not correct');
        }
        
    
        [fname, lname, postcode, doju_Name, instructor, country, city, district] = repleCrAll([fname, lname, postcode, doju_Name, instructor, country, city, district]);
        let userInfo = { fname, lname, postcode, email, phone, doju_Name, instructor, country, city, district, date_of_birth };
        userInfo = { ...userInfo, experience_level, has_violance_charge, has_permanent_injury, gender, is_previous_member, current_grade }
        
        {//conditional
            if (has_permanent_injury === 'Yes') userInfo.permanent_disabillity = repleCaracter(permanent_disabillity)
            if (has_violance_charge === 'Yes') userInfo.violance_charge = repleCaracter(violance_charge);
            if (is_previous_member === 'Yes') userInfo.membership_expiring_date = repleCaracter(membership_expiring_date);
        }

        if (membeship_array.length===0) namedErrorCatching('parameter error', `membeship_array.length===0`);
       
        for (let i = 0; i < membeship_array.length; i++) {
            let { company, membership } = membeship_array[i];
            if (membership !== 'Annual' && membership !== 'LifeTime') namedErrorCatching('parameter error', `membeship_array[${i}].membership is invalid`);
            if (company !== 'gojushinryu') namedErrorCatching('parameter error', `membeship_array[${i}].company is invalid`);
            membeship_array[i] = { company, membership };
        }

        let membershipDataBaseArray=[];
        let existingMemberships=[];
        
        for (let i = 0; i < membeship_array.length; i++) {
            
            let mb = await GojushinryuMembership.findOne()
                .where('membership_type').equals(membeship_array[i].membership)
                .where('user_id').equals(req.user_info?._id);
            
            if (mb === null) {
                let membership = new GojushinryuMembership({
                    ...userInfo,
                    membership_company: 'gojushinryu',
                    membership_type: membeship_array[i].membership,
                    membership_name: 'Gojushinryu International Martial Arts ' + membeship_array[i].membership + ' Membership',
                    membership_exp_date: Date.now() + (365 * 24 * 60 * 60 * 1000)
                });  
                membershipDataBaseArray.push(membership);
            } else existingMemberships.push(mb);
        }
        
        if (membershipDataBaseArray.length === 0) {
            existingMemberships.length !== 0 && sendMembershipAlreadySendRequestedEmail(req.user_info?.email, req.user_info?.name, existingMemberships[0].id)
            res.status(400).json({ error: 'You have already requested membership, please do not request again ' });
            return;
        }
        
        for (let i = 0; i < membershipDataBaseArray.length; i++) {
            req.user_info.memberShipArray = Array.isArray(req.user_info.memberShipArray) ? req.user_info.memberShipArray: (new Array());
            membershipDataBaseArray[i].user_id= req.user_info._id;
            membershipDataBaseArray[i]= await membershipDataBaseArray[i].save();
            await sendMembershipApplicationReceivedEmail(membershipDataBaseArray[i].email, membershipDataBaseArray[i].lname);
            await sendMembershipRequestNotificationToAdmin(membershipDataBaseArray[i].fname + ' ' + membershipDataBaseArray[i].lname, membershipDataBaseArray[i].email, membershipDataBaseArray[i].phone);
            req.user_info.memberShipArray.push({
                _id: membershipDataBaseArray[i]._id,
                id: membershipDataBaseArray[i].id,
                membership: membershipDataBaseArray[i].membership_type,
                Organization: membershipDataBaseArray[i].membership_company,
                name:membershipDataBaseArray[i].membership_name,
            });
        }
        
        await req.user_info.save();

        res.status(201).json({
            membership_ids: membershipDataBaseArray.map(el => el.id),
            requestDate: membershipDataBaseArray[0].id,
            student_name: req.user_info.name
        });



        return;
    } catch (error) {
        catchError(res,error)
    }
}

export default requestGojushinryuMembership;

export async function GojushinryuMembershipRequestSuccessPage(req=request,res=response) {
    try {
  
        let { student_name, membership_ids, requestDate } = req.query;
        if ( typeof membership_ids ==='string' && membership_ids?.trim()){
            membership_ids=[membership_ids];
        }
        
        if (!student_name || !Array.isArray(membership_ids) || !requestDate) {
            return res.render('massage_server', { title: 'No Allowed', body: 'You are not allowed to view this page as you have send Invalid info' });
        }
        const style = (`  <style>
        :root {
            --main-bg: whitesmoke;
            --card-bg: white;
            --accent-color: #ffaa1c;
            --text-color: black;
            --success-color: #4caf50;
            --font-family: 'Libre Franklin', sans-serif;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: var(--font-family);
            background: var(--main-bg);
            color: var(--text-color);

        }

      main{
         display: flex;
            justify-content: center;
            align-items: center;
          height: 100vh;
            padding: 20px;
      }
        .success-container {
            background: var(--card-bg);
            border-radius: 10px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            padding: 40px;
            text-align: center;
            max-width: 600px;
            width: 100%;
        }

        .success-container h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 20px;
            color: var(--success-color);
        }

        .success-container p {
            font-size: 1.2rem;
            margin-bottom: 30px;
        }

        .success-container .details {
            margin-bottom: 20px;
            padding: 20px;
            background: var(--main-bg);
            border-radius: 8px;
            text-align: left;
            font-size: 1rem;
        }

        .success-container .details div {
            margin-bottom: 10px;
        }

        .success-container .details div span {
            font-weight: 600;
        }

        .success-container .btn {
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

        .success-container .btn:hover {
            background: #e59919;
        }

        .success-container .success-icon {
            font-size: 4rem;
            color: var(--success-color);
            margin-bottom: 20px;
        }
        </style>`);
        const html = (`
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Membership Request Successful</title>
        <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;600;700&display=swap" rel="stylesheet">
        ${ LinksHbs + style + noindex_meta_tags}
        </head>
        <body>
        ${whiteHeader}
        <main>
        <div class="success-container">
        <div class="success-icon">✔</div>
        <h1>Request Sent Successfully!</h1>
        <p>Your request to join the GojushinRyu International Martial Arts Membership has been sent successfully. Our team will review your request and get back to you shortly.</p>

        <div class="details">
            <div><span>Member Name:</span>${student_name}</div>
            <div><span>Request ID:</span>${membership_ids.map(el => (`#${el}`)).join(',&nbsp;')}</div>
            <div><span>Submission Date:</span> ${new Date(Number(requestDate).toString() === 'NaN' ? requestDate : Number(requestDate)).toLocaleDateString()}</div>
        </div>

        <a href="/home" class="btn">Return to Home</a>
        <a href="/contact" class="btn" style="margin-left: 10px;">Contact Support</a>
    </div>
    </main>
    ${Footer}
</body>

</html>
        `);
        res.set('Cache-Control', 'no-cache');
        return res.status(200).send(html);
    } catch (error) {
        console.error(error);
        return res.send('Failed to Load Membership Request SuccessFully send Page')
    }
}

export async function findGojushinryuMembershipRequest(req=request,res=response) {
    try {
        let memberhsips=(await GojushinryuMembership.find());
        for (let i = 0; i < memberhsips.length; i++) (memberhsips[i].student_image = (await User.findById(memberhsips[i].user_id))?.thumb ?? (BASE_URL + '/img/avatar.png'));
        return res.status(200).json({ memberhsips });;
    } catch (error) {
        catchError(res,error)
    }
}

export async function userIdToImage(req=request,res=response) {
    try {
        let id=req.query.id;
        if (!id || id?.length !== 24 ) return res.sendStatus(204);
        id = repleCaracter(id);
        let student = (await User.findById( id ));
        if (student===null) return res.sendStatus(401);
        let image = student.thumb || (BASE_URL + '/img/avatar.png');
        if (image) return res.status(200).send(image);
        return res.sendStatus(204);
    } catch (error) {
        catchError(res,error);
        return;
    }
}


export async function admin_approveGojushinryuMembership(req = request, res = response) {
    try {
        let id = req.query.id; id = Number(id);
        if (id.toString() === 'NaN') namedErrorCatching('parameter error', 'id is not a number');
        let membership = await GojushinryuMembership.findOne({ id });
        if (!membership) namedErrorCatching('parameter error', 'There are no membership in the id of ' + id);
        if (membership.admin_approved===true) return res.sendStatus(402);
        membership.admin_approved = true; 
        await membership.save();
        await gmembershipAprovedStudent(membership.email, membership.lname);
        return res.sendStatus(202);
    } catch (error) {
        catchError(res, error);
    }
}


export async function cancelAndDeleteGojushinryuMembership(req = request, res = response) {
    try {
        let id = req.query.id; id = Number(id);
        if (id.toString() === 'NaN') namedErrorCatching('parameter error', 'id is not a number');
        let membership = await GojushinryuMembership.findOne({ id });
        if (!membership) namedErrorCatching('parameter error', 'There are no membership in the id of ' + id);
        membership=await GojushinryuMembership.findByIdAndDelete(membership._id);
        await GMembershipNotApprovedEmail(membership.email, membership.lname)
        return res.sendStatus(202);
    } catch (error) {
        catchError(res, error);
    }
}
