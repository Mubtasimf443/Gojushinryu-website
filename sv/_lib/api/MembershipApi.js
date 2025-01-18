/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { sendMembershipMails } from "../mail/membership.mail.js";
import { Memberships } from "../models/Membership.js";
import MembershipCoupons from "../models/membershipcoupon.js";
import { Settings } from "../models/settings.js";
import { User as Users } from "../models/user.js";
import { Footer, LinksHbs, noindex_meta_tags, T_PAYPAL_SECRET, whiteHeader } from "../utils/env.js";
import { createPaypalPayment } from "../utils/payment/create.order.paypal.js";
import { repleCaracter } from "../utils/replaceCr.js";
import { Alert, log } from "../utils/smallUtils.js";
import { MakePriceString } from "../utils/string.manipolation.js";


export async function MembershipApidataCheckMidleware(req, res, next) {
    let memberships = [
        {
            name: 'Goju shin Ryu Annual Membership',
            description: 'Goju shin Ryu Annual Membership',
            quantity: 1,
            price: 75,
            unit_amount: {
                currency_code: 'USD',
                value: '75.00'
            }
        },
        {
            name: 'Goju shin Ryu LifeTime Membership',
            description: 'Goju shin Ryu LifeTime Membership',
            quantity: 1,
            price: 250,
            unit_amount: {
                currency_code: 'USD',
                value: '250.00'
            }
        },
        {
            name: 'School of Traditional Martial Art Annual Membership',
            description: 'School of Traditional Martial Art Membership',
            quantity: 1,
            price: 75,
            unit_amount: {
                currency_code: 'USD',
                value: '75.00'
            }
        },
        {
            name: 'School of Traditional Martial Art LifeTime Membership',
            description: 'School of Traditional Martial Art LifeTime Membership',
            quantity: 1,
            price: 250,
            unit_amount: {
                currency_code: 'USD',
                value: '250.00'
            }
        },
    ];
    let {
        fname,
        lname,
        email,
        phone,
        date_of_birth,
        country,
        city,
        district,
        postcode,
        doju_Name,
        instructor,
        current_grade,
        violance_charge,
        permanent_disabillity,
        membership_expiring_date,
        previous_injury,
        gender,
        is_previous_member,
        experience_level,
        has_violance_charge,
        has_permanent_injury,
        membeship_array,
    } = req.body;



    try {
        let testArray = [
            fname,
            lname,
            email,
            phone,
            date_of_birth,
            country,
            city,
            district,
            postcode,
            gender,
            doju_Name,
            instructor,
            current_grade,
            membeship_array.length,
            previous_injury,
            is_previous_member,
            experience_level,
            has_violance_charge,

        ];
        let notFoundIndex = testArray.findIndex(el => !el)
        if (notFoundIndex !== -1) throw new Error("Please Complete the form");
        let userInfo = {};
        let paypalTotal = 0;
        let paypalItems = [];


        //checkLavel 1
        if (gender !== 'Male' && gender !== 'Female') throw 'Gender is not correct'
        if (has_violance_charge !== 'Yes' && has_violance_charge !== 'No') throw 'Violance charge is not correct'
        if (has_permanent_injury !== 'Yes' && has_permanent_injury !== 'No') throw 'Violance charge is not correct'
        if (is_previous_member !== 'Yes' && is_previous_member !== 'No') throw 'Violance charge is not correct'
        if (experience_level !== 'Senior' && experience_level !== 'Junior') throw 'experience_level is not correct'
        if (typeof postcode !== 'number') throw new Error("postcode not correct");
        if (typeof phone !== 'number') throw new Error("phone not correct");
        if (Number(phone).toString().toLowerCase() === 'nan') throw new Error("phone not correct");
        if (Number(postcode).toString().toLowerCase() === 'nan') throw new Error("postcode not correct");



        //array check
        for (let i = 0; i < membeship_array.length; i++) {
            let { company, membership } = membeship_array[0];
            if (!membership || !company) throw 'Server error ,line 77'
            if (typeof company !== 'string' || typeof membership !== 'string') throw 'Server error ,line 78'
            if (company !== 'gojushinryu' && company !== 'school_of_traditional_martial_art') throw 'Server error ,line 79'
            if (membership !== 'Annual' && membership !== 'LifeTime') throw 'Server error ,line 80'
            company = company === 'gojushinryu' ? 'Goju shin Ryu' : 'School of Traditional Martial Art';
            let membership_object = memberships.find(el => (el.name.includes(company) && el.name.includes(membership)));
            if (typeof membership_object !== 'object' || !membership_object) throw new Error("membership_object problem");
            paypalTotal += membership_object.price;
            membership_object.price = await MakePriceString(membership_object.price);
            paypalItems.push(membership_object);
            membeship_array.push({
                membership_company: company,
                membership_type: membership,
                membership_name: membership_object.name
            });
            membership = membeship_array.shift();
           
        }


        //info
        //string
        {
            userInfo.fname = await repleCaracter(fname);
            userInfo.lname = await repleCaracter(lname);
            userInfo.email = await repleCaracter(email);
            userInfo.date_of_birth = await repleCaracter(date_of_birth);
            userInfo.country = await repleCaracter(country);
            userInfo.city = await repleCaracter(city);
            userInfo.district = await repleCaracter(district);
            userInfo.doju_Name = await repleCaracter(doju_Name);
            userInfo.instructor = await repleCaracter(instructor);
            userInfo.current_grade = await repleCaracter(current_grade);
            userInfo.previous_injury = await repleCaracter(previous_injury);
        }


        //number
        userInfo.postcode = postcode;
        userInfo.phone = phone;


        //conditional
        if (has_permanent_injury === 'Yes') userInfo.permanent_disabillity = await repleCaracter(permanent_disabillity)
        if (has_violance_charge === 'Yes') userInfo.violance_charge = await repleCaracter(violance_charge);
        if (is_previous_member === 'Yes') userInfo.membership_expiring_date = await repleCaracter(membership_expiring_date);

        //object
        userInfo = { ...userInfo, gender, is_previous_member, experience_level, has_violance_charge, has_permanent_injury, membeship_array }


        //request

        req.purified_user_info = userInfo;
        req.paypalTotal =  paypalTotal.toFixed(2);
        req.paypalItems = paypalItems.map(({ name, description, unit_amount, quantity }) => ({ name,description, unit_amount, quantity }));

      
        return next();
    } catch (error) {
        log({ error });
        Alert(error, res)
    }

}


export async function paypalMembershipFunction(req, res) {
    try {
        let user_info = req.user_info;
        let paypalTotal = req.paypalTotal;
        let paypalItems = req.paypalItems;
        let purified_user_info = req.purified_user_info;
        let { membeship_array } = purified_user_info;
        let membershipDataBaseArray = [];

        for (let i = 0; i < membeship_array.length; i++) {
            let { membership_name, membership_type, membership_company } = membeship_array[i];
            let {
                fname,
                lname,
                email,
                phone,
                date_of_birth,
                country,
                city,
                district,
                postcode,
                doju_Name,
                instructor,
                current_grade,
                previous_injury,
                gender,
                is_previous_member,
                experience_level,
                has_violance_charge,
                has_permanent_injury,
            } = purified_user_info;
   
            let membership = new Memberships({
                user_id: user_info._id,
                fname,
                lname,
                email,
                phone,
                date_of_birth,
                country,
                city,
                district,
                postcode,
                doju_Name,
                instructor,
                current_grade,
                previous_injury,
                gender,
                is_previous_member,
                experience_level,
                has_violance_charge,
                has_permanent_injury,
                membership_name,
                membership_type,
                membership_company,
                membership_exp_date: membership_type === 'Annual' ? (new Date(Date.now() + 365 * 24 * 60 * 60 * 60 * 1000) ): undefined,
            });
            //conditional
            if (has_permanent_injury === 'Yes') membership.permanent_disabillity = purified_user_info.permanent_disabillity;
            if (has_violance_charge === 'Yes') membership.violance_charge = purified_user_info.violance_charge;
            if (is_previous_member === 'Yes') membership.previous_membership_expiring_date = purified_user_info.membership_expiring_date;

            let { membershipData, error } = await membership.save().then(e => ({ _id: e._id, id: e.id, membershipData: e })).catch(e => ({ error: e }));

            if (error) throw 'Can not create membership'
            if (membershipData) membershipDataBaseArray.push(membershipData)
        }

        //coupon
        if (typeof req.body.coupon  === 'string') { 
            let mCoupon=await MembershipCoupons.findOne().where('code').equals(req.body.coupon.trim().toUpperCase());
            if (mCoupon?.rate) {
                paypalTotal = 0;
                for (let i = 0; i < paypalItems.length; i++) {
                    let price = ~~paypalItems[i].unit_amount.value;
                    price = price - price * mCoupon?.rate;
                    paypalItems[i].unit_amount.value = price.toFixed(2);
                    paypalTotal += price;
                }
                paypalTotal = paypalTotal.toFixed(2);
            }
        }


        { //gst rate 
            let gst_rate = (await Settings.findOne({})).gst_rate / 100 ?? 0.05;
            paypalTotal = 0;
            for (let i = 0; i < paypalItems.length; i++) {
                paypalItems[i].unit_amount.value = (paypalItems[i].unit_amount.value * 1 + paypalItems[i].unit_amount.value * gst_rate).toFixed(2);
                paypalTotal += paypalItems[i].unit_amount.value * 1;
            }
            paypalTotal=paypalTotal.toFixed(2);
        }



        let paypalObject = {
            items: paypalItems,
            total: paypalTotal,
            productToatal: paypalTotal,
            shipping: 0,
            success_url: '/api/api_s/paypal-membership-success',
            cancell_url: '/api/api_s/paypal-membership-cancel'
        }
      
        let { error, success, paypal_id, link } = await createPaypalPayment(paypalObject);
        if (error) throw new Error("Paypal Error");
        if (success) {
            for (let i = 0; i < membershipDataBaseArray.length; i++) {
                let { _id } = membershipDataBaseArray[i];
                let membership = await Memberships.findById(_id)
                membership.paypal_token = paypal_id;
                await membership.save();
            }
        }
       
        return res.json({ success, link })
    } catch (e) {
        log(e);
        return Alert(e, res)
    }

}
export async function membershipSuccessPaypalApi(req, res) {
    try {
        let { token } = req.query;
        if (!token) return res.render('notAllowed');
        log({ token })
        function status(data) {
            if (!data) return false
            if (data.includes('{')) return false
            if (data.includes('}')) return false
            if (data.includes('*')) return false
            if (data.includes(':')) return false
            if (data.includes('[')) return false
            if (data.includes(']')) return false
            if (data.includes('(')) return false
            if (data.includes('(')) return false
            if (data.includes('$')) return false
            if (data.includes('>')) return false
            if (data.includes('<')) return false
            return true
        }
        status = status(token);
        if (!status) return res.render('notAllowed');

        let memberships = await Memberships.find({ paypal_token: token })
        //membership mail
      
        sendMembershipMails(memberships[0]);
        let user = await Users.findById(memberships[0].user_id);
        for (let i = 0; i < memberships.length; i++) {
            let { _id, id, user_id, membership_type, membership_company, membership_name } = memberships[i];
            await Memberships.findByIdAndUpdate(_id, { activated: true }).then(e => { })
            if (user) {
                if (user.memberShipArray.length ===0) {
                    user.memberShipArray = [{
                        membership: membership_type,
                        _id: _id,
                        id: id,
                        name: membership_name,
                        Organization: membership_company
                    }];
                    user.isMember = true;
                    await user.save();
                }
                else if (user.memberShipArray.length) {
                    user.memberShipArray.push({
                        membership: membership_type,
                        _id: _id,
                        id: id,
                        name: membership_name,
                        Organization: membership_company
                    });
                    user.isMember = true;
                    user.city = user.city ? user.city : memberships[i].city;
                    user.district = user.district ? user.district : memberships[i].district;
                    user.postCode = user.postCode ? user.postCode : memberships[i].postcode;
                    await user.save()
                }
            }
        }


        return res.send(membershipSuccessPage({ student_name: user.name, types: memberships.map(el => el.membership_type), ids: memberships.map(el => el.id) }));
    } catch (error) {
        log({ error })
    }
}
export async function membershipCancellPaypalApi(req, res) {
    try {
        let { token } = req.query
        function status(data) {
            if (!data) return false
            if (data.includes('{')) return false
            if (data.includes('}')) return false
            if (data.includes('*')) return false
            if (data.includes(':')) return false
            if (data.includes('[')) return false
            if (data.includes(']')) return false
            if (data.includes('(')) return false
            if (data.includes('(')) return false
            if (data.includes('$')) return false
            if (data.includes('>')) return false
            if (data.includes('<')) return false
            return true
        }
        status = status(token);
        if (!status) return res.redirect('notAllowed');

        let memberships = await Memberships.find({
            paypal_token: token
        });

        for (let i = 0; i < memberships.length; i++) {
            const el = memberships[i];
            await Memberships.findOneAndDelete({
                _id: el._id
            })
        }

        return res.redirect('/')
    } catch (error) {
        console.log({ error });
        return res.redirect('/')
    }
}


export function membershipSuccessPage({ student_name, types, ids } = { student_name: undefined, types: [], ids: [] }) {
    let style = (`  <style>
        :root {
            --main-bg: whitesmoke;
            --card-bg: white;
            --accent-color: #ffaa1c;
            --text-color: black;
            --success-color: #4caf50;
            --font-family: 'Libre Franklin', sans-serif;
        }

        main {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 40px 0px;
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
    let html = (`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Membership Enrollment Successful</title>
    <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;600;700&display=swap" rel="stylesheet">
    ${noindex_meta_tags}
    ${LinksHbs}
    ${style}
</head>

<body>
    ${whiteHeader}
    <main>

    <div class="success-container">
        <div class="success-icon">✔</div>
        <h1>Enrollment Successful!</h1>
        <p>Thank you for enrolling in our membership program. Your enrollment has been successfully processed.</p>

        <div class="details">
            <div><span>Member Name:</span> ${student_name}</div>
            <div><span>Membership Type:</span>${types.join(',&nbsp;')}</div>
            <div><span>Enrollment ID:</span> ${ids.map(el => '#' + el).join(',&nbsp;')}</div>
            <div><span>Enrollment Date:</span>${new Date().toDateString()}</div>
        </div>

        <a href="/accounts/student" class="btn">Go to Student Corner</a>
        <a href="/contact" class="btn" style="margin-left: 10px;">Contact Support</a>
    </div>
    </main>
    ${Footer}
</body>

</html>
    `);
    return html;
}