/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ 
Insha Allah,  Allah is enough for me
*/

import formidable from "formidable";
import { Alert, log } from "../utils/smallUtils.js";
import path from 'path'
import { fileURLToPath } from 'url'
import { UploadImageToCloudinary } from "../Config/cloudinary.js";
import Awaiter, { waidTillFileLoad } from "awaiter.js";
import mergesort from "../utils/algorithms.js";
import CountryRepresentatives from "../models/countryRepresentative.js";
import { request, response } from "express";
import catchError from "../utils/catchError.js";
import { repleCaracter } from "string-player";
import Mails from "../mail/country-representatives.mail.js";
import { UploadImgFile } from "../api/formidable.file.post.api.js";
import { Settings } from "../models/settings.js";
import { BASE_URL, Footer, LinksHbs, noindex_meta_tags, PAYPAL_CLIENT_ID, PAYPAL_MODE, PAYPAL_SECRET, T_PAYPAL_CLIENT_ID, T_PAYPAL_SECRET, whiteHeader } from "../utils/env.js";
import PaypalPayment from "../utils/payment/PaypalPayment.js";
import StripePay from "../utils/payment/stripe.js";

//var
const __filename = fileURLToPath(import.meta.url);
let dirname = path.dirname(__filename);


export async function countryRepresentativeFormSubmitedPage(req = request, res = response) {
    try {
        let style=(`
            <style>
    :root {
      --main-bg: whitesmoke;
      --card-bg: #ffffff;
      --accent-color: #ffaa1c;
      --text-color: #333;
      --font-family: 'Libre Franklin', sans-serif;
      --shadow: rgba(0, 0, 0, 0.1);
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
      box-shadow: 0 8px 16px var(--shadow);
      padding: 40px;
      text-align: center;
      max-width: 600px;
      width: 100%;
    }
    
    .success-container .icon {
      font-size: 4rem;
      color: var(--accent-color);
      margin-bottom: 20px;
    }
    
    .success-container h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--accent-color);
      margin-bottom: 20px;
    }
    
    .success-container p {
      font-size: 1.2rem;
      margin-bottom: 30px;
      line-height: 1.5;
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
  <title>Application Submitted Successfully</title>
  <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;600;700&display=swap" rel="stylesheet">
  ${noindex_meta_tags + LinksHbs + style}
</head>
<body>
    ${whiteHeader}
    <main>
        <div class="success-container">
            <div class="icon">✔</div>
            <h1>Application Submitted!</h1>
            <p>Thank you for applying to become a Country Representative. Your application has been successfully submitted and is under review by our team. You will be contacted if further information is needed or once your application is approved.</p>
            <a href="/home" class="btn">Return to Home</a>
          </div>
    </main>
    ${Footer}
</body>
</html>
        `);
        res.type('html');
        return res.send(html);
    } catch (error) {
        console.error(error);
        try {
            res.render('500');
        } catch (error) {   console.error(error); }
    }
}


export async function uploadCountryRepresentativeApi(req = request, res = response) {
    try {
        let [filePath, feilds] = await UploadImgFile(req, 'image')
            .catch((error) => {
                console.error(error);
                throw 'Failed , Because we are unable to upload Image';
            });
        if (!feilds.name) throw 'title is not define ';
        if (!feilds.email) throw 'email is not define ';
        if (!feilds.description) throw 'description is not define ';
        if (!feilds.country) throw 'country is not define ';
        if (!feilds.phone) throw 'phone is not define ';
        if (!feilds.dob) throw 'dateOfBirth is not define ';
        let name = repleCaracter(feilds.name[0].trim());
        let phone = repleCaracter(feilds.phone[0].trim());
        let email = repleCaracter(feilds.email[0].trim());
        let country = repleCaracter(feilds.country[0].trim());
        let dateOfBirth = repleCaracter(feilds.dob[0].trim());
        let description = repleCaracter(feilds.description[0].trim());
        if (!name) throw 'title is not define ';
        if (!email) throw 'email is not define ';
        if (!description) throw 'description is not define ';
        if (!country) throw 'country is not define ';
        if (!phone) throw 'phone is not define ';
        if (!dateOfBirth) throw 'dateOfBirth is not define ';
        let thumbUrl = await UploadImageToCloudinary(filePath).then(({ image, error }) => {
            if (error) throw 'Failed to Upload Image because of the failure of a service';
            if (image) return image.url
        });
        let countryRepresentative = new CountryRepresentatives({ name, email, dateOfBirth, country, phone, description, thumbUrl });

        await countryRepresentative.save()
        await Mails.ApplicationReceived1({ recipientEmail: email, applicantName: name });
        await Mails.ApplicationReceived2({ applicantEmail: email, applicantName: name, applicantPhone: phone })

        return res.sendStatus(201);
    } catch (error) {
        catchError(res, error);
    }
}

export async function getCountryRepresentatives(req, res) {
    try {
        let data = await CountryRepresentatives.find({});
        data = data.filter(function (element) {
            if (element.approved_by_admin === true) {
                return element
            }
        });

        data = data.map(el => {
            let { name, id, description, email, thumbUrl, country } = el;
            return {
                name,
                description,
                email,
                thumbUrl,
                country,
                id,
                shortDescription: el.description.length < 120 ? el.description : el.description.substring(0, 120)
            }
        });
        res.status(200).json({ data });
        return;
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}


export async function getCountryRepresentativesForAdmin(req, res) {
    try {
        let data = await CountryRepresentatives.find({}, 'approved_by_admin name description email thumbUrl country id shortDescription payment_data');
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500)
    }
}


export async function allowRepresentative(req, res) {
    try {
        let { id } = req.body;
        id = Number(id);
        if (id.toString() === 'NaN') return res.sendStatus(400);
        let representative = await CountryRepresentatives.findOne({ id });
        if (!representative) return res.sendStatus(400);
        const isApprovedInToday = new Date().getDate() === new Date(representative.last_admin_approved).getDate();
        if (representative.last_admin_approved === undefined) isApprovedInToday = true;
        representative.approved_by_admin = true;
        representative.last_admin_approved=Date.now();
        await representative.save();
        if (!isApprovedInToday) {
            await Mails.CountryRepApprovalEmail({
                applicantName :representative.name,
                recipientEmail : representative.email,
                countryRepPage: BASE_URL + '/our-country-representatives'
            });
        }
        return res.sendStatus(200)
    } catch (error) {
        console.error(error);
        return res.sendStatus(500)
    }
}



export async function disAllowRepresentative(req, res) {
    try {
        let { id } = req.body;
        id = Number(id);
        if (id.toString() === 'NaN' || id === 0) return res.sendStatus(400);
        let representative = await CountryRepresentatives.findOne({ id });
        if (!representative) return res.sendStatus(400);
        representative.approved_by_admin = false;
        await representative.save();
        return res.sendStatus(200)
    } catch (error) {
        console.error(error);
        return res.sendStatus(500)
    }
}


async function requestPayment(req = request, res = response) {
    try {
        let id = req.query.id;
        id = Number(id);
        if (id.toString() === 'NaN' || id === 0) throw 'id is not valid';
        let fees = req.query.fees;
        fees = Number(fees);
        if (fees.toString() === 'NaN' || fees === 0) throw 'fees is not valid';
        let cr = await CountryRepresentatives.findOne().where('id').equals(id);
        if (cr === null) throw 'No Country representatives exist from the id of ' + id;
        if (cr.payment_data.paymentRequestInfo.isPaymentRuquested === true) return res.sendStatus(402);
        let gstRate = (await Settings.findOne({})).gst_rate || 5;
        cr.payment_data.paymentRequestInfo.isPaymentRuquested = true;
        cr.payment_data.paymentRequestInfo.paymentRequestedDate = new Date();
        cr.payment_data.paymentRequestInfo.paymentRequestedDateNum = Date.now();
        cr.payment_data.paymentAmount = fees;
        cr.payment_data.paymentGST = fees / 100 * gstRate;
        cr.payment_data.paymentTotal = cr.payment_data.paymentAmount + cr.payment_data.paymentGST;
        await cr.save();
        await Mails.paymentRequest({
            paypal_link: BASE_URL + '/api/api_s/country-representative/fees/paypal?id=' + id,
            stripe_link: BASE_URL + '/api/api_s/country-representative/fees/stripe?id=' + id,
            email: cr.email,
            fees: cr.payment_data.paymentAmount.toFixed(2),
            gst: cr.payment_data.paymentGST.toFixed(2),
            total: cr.payment_data.paymentTotal.toFixed(2)
        });
        return res.sendStatus(200);
    } catch (error) {
        catchError(res, error);
    }
}


async function paypalPayment(req = request, res = response) {
    try {
        let id = req.query.id;
        id = Number(id);
        if (id.toString() === 'NaN' || id === 0) throw 'id is not valid';
        let cr = await CountryRepresentatives.findOne().where('id').equals(id);
        if (cr === null) throw 'No Country representatives exist from the id of ' + id;
        if (cr.payment_data.paymentRequestInfo.isPaymentRuquested === false) return res.sendStatus(402);
        let paypal = new PaypalPayment({
            client_id: PAYPAL_CLIENT_ID,
            client_secret: PAYPAL_SECRET,
            mode: PAYPAL_MODE,
            success_url: BASE_URL + '/api/api_s/country-representative/fees/paypal/success',
            cancel_url: BASE_URL + '/api/api_s/country-representative/fees/paypal/cancel'
        });
        let { link, token } = await paypal.checkOutWithShipping({
            shipping: cr.payment_data.paymentGST,
            items: [{
                name: 'Gojushinryu Country Representative Fees',
                quantity: 1,
                unit_amount: {
                    currency_code: 'USD',
                    value: cr.payment_data.paymentAmount.toFixed(2)
                }
            }]
        });
        if (!link || !token) throw 'server error';
        cr.payment_data.paypal_session = token;
        cr.payment_data.payment_method = 'paypal';
        await cr.save();
        res.redirect(link);
        return;
    } catch (error) {
        try {
            console.error(error);
            res.render('500');
        } catch (error) { console.error(error) }
    }
}
async function stripePayment(req = request, res = response) {
    try {
        let id = req.query.id;
        id = Number(id);
        if (id.toString() === 'NaN' || id === 0) throw 'id is not valid';
        let cr = await CountryRepresentatives.findOne().where('id').equals(id);
        if (cr === null) throw 'No Country representatives exist from the id of ' + id;
        if (cr.payment_data.paymentRequestInfo.isPaymentRuquested === false) return res.sendStatus(402);
        let Str = new StripePay({
            success_url: BASE_URL + '/api/api_s/country-representative/fees/stripe/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: BASE_URL + '/api/api_s/country-representative/fees/stripe/cancel?session_id={CHECKOUT_SESSION_ID}',
        });
        let checkoutData = await Str.checkOut({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Gojushinryu Country Representative Fees'
                        },
                        unit_amount: cr.payment_data.paymentAmount * 100
                    },
                    quantity: 1
                }
            ],
            shipping_amount: cr.payment_data.paymentGST * 100,
        });

        if (checkoutData.id && checkoutData.url) {
            cr.payment_data.payment_method = 'stripe';
            cr.payment_data.stripe_session = checkoutData.id;
            await cr.save();
            return res.redirect(checkoutData.url);
        } else {
            throw 'Stripe Payment failed';
        }
    } catch (error) {
        try {
            console.error(error);
            res.render('500');
        } catch (error) { console.error(error) }
    }
}
async function paypalPaySuccess(req = request, res = response) {
    try {
        let token = req.query.token;
        if (!token) throw 'Token is not valid';
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
        if (status(token) === false) return res.render('500');
        let cr = await CountryRepresentatives.findOne().where('payment_data.paypal_session').equals(token);
        if (cr === null) throw 'There is no cr under id '+token
        if (cr?.payment_data?.isPaymentCompleted === true) {
            return PaymentSuccessPage(res);
        }
        cr.payment_data.isPaymentCompleted =true;
        cr.payment_data.paymentDate =new Date();
        cr.payment_data.paymentDateNum = Date.now();
        cr.payment_data.payment_id=Date.now();
        await cr.save();
        await Mails.sendCountryRepPaymentConfirmationEmail({
            recipientEmail :cr.email , 
            applicantName : cr.name ,
            paymentId: '#' + cr.payment_data.payment_id
        });
        await Mails.sendAdminCountryRepPaymentEmail({
            applicantName :  cr.name ,
            paymentId : '#' + cr.payment_data.payment_id
        });

        return PaymentSuccessPage(res);
    } catch (error) {
        try {
            console.error(error);
            res.render('500');
        } catch (error) { console.error(error) }
    }
}
async function paypalPayCancel(req = request, res = response) {
    try {
        let token = req.query.token;
        if (!token) throw 'Token is not valid';
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
        if (status(token) === false) return res.render('500');
        let cr = await CountryRepresentatives.findOne().where('payment_data.paypal_session').equals(token);
        if (cr === null) return res.render('500');
        if (cr?.payment_data?.isPaymentCompleted === true) {
            return PaymentSuccessPage(res);
        }
        cr.payment_data.paypal_session=undefined;
        cr.payment_data.payment_method=undefined;
        await cr.save();
        return PaymentCancelPage(res);
    } catch (error) {
        try {
            console.error(error);
            res.render('500');
        } catch (error) { console.error(error) }
    }
}
async function stripePaySuccess(req = request, res = response) {
    try {
        let id =req.query.session_id ;
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
        if (!status(id)) return res.render('500');
        let cr = await CountryRepresentatives.findOne({}).where('payment_data.stripe_session').equals(id);
        if (cr === null) throw 'No Country representatives exist from the id of ' + id;
        if (cr?.payment_data?.isPaymentCompleted === true) {
            return PaymentSuccessPage(res);
        }
        cr.payment_data.isPaymentCompleted =true;
        cr.payment_data.paymentDate =new Date();
        cr.payment_data.paymentDateNum = Date.now();
        cr.payment_data.payment_id=Date.now();
        await cr.save();
        await Mails.sendCountryRepPaymentConfirmationEmail({
            recipientEmail: cr.email,
            applicantName: cr.name,
            paymentId: '#' + cr.payment_data.payment_id
        });
        await Mails.sendAdminCountryRepPaymentEmail({
            applicantName: cr.name,
            paymentId: '#' + cr.payment_data.payment_id
        });
        return PaymentSuccessPage(res);
    } catch (error) {
        try {
            console.error(error);
            res.render('500');
        } catch (error) { console.error(error) }
    }
}


async function stripePayCancel(req = request, res = response) {
    try {
        let id =req.query.session_id ;
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
        if (!status(id)) return res.render('500');
        let cr = await CountryRepresentatives.findOne({}).where('payment_data.stripe_session').equals(id);
        if (cr === null) throw 'No Country representatives exist from the id of ' + id;
        if (cr?.payment_data?.isPaymentCompleted === true) {
            return PaymentSuccessPage(res);
        }
        cr.payment_data.payment_method =undefined;
        cr.payment_data.stripe_session =undefined;
        await cr.save();
        return PaymentCancelPage(res);
    } catch (error) {
        try {
            console.error(error);
            res.render('500');
        } catch (error) { console.error(error) }
    }
}

function PaymentSuccessPage(res = response) {
    let style = (` 
        <style>
        :root {
            --main-bg: whitesmoke;
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
            background: var(--main-bg);
            color: var(--text-color);

        }

        main {
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

        .success-container .icon {
            font-size: 4rem;
            color: var(--accent-color);
            margin-bottom: 20px;
        }

        .success-container h1 {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--accent-color);
            margin-bottom: 20px;
        }

        .success-container p {
            font-size: 1.2rem;
            margin-bottom: 30px;
            line-height: 1.5;
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
            background: #e69919;
        }
    </style>
    `);
    let html = (`
        <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Successful | GojushinRyu</title>
    <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;600;700&display=swap"
        rel="stylesheet">
   ${noindex_meta_tags + LinksHbs + style}

</head>

<body>
    ${whiteHeader}
    <main>
        <div class="success-container">
            <div class="icon">✔</div>
            <h1>Payment Successful!</h1>
            <p>Thank you for your payment. Your transaction has been successfully processed.</p>
            <a href="/our-country-representatives" class="btn">Go to Representatives</a>
        </div>
    </main>
    ${Footer}
</body>

</html>

    `);
    res.type('html');
    res.status(200).send(html);
    return;
}

function PaymentCancelPage(res = response) {
    let style =(` 
        <style>
        :root {
            --main-bg: whitesmoke;
            --card-bg: #ffffff;
            --accent-color: #ffaa1c;
            --text-color: #333;
            --font-family: 'Libre Franklin', sans-serif;
            --error-color: #d9534f;
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

        main {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            padding: 20px;
        }

        .cancel-container {
            background: var(--card-bg);
            border-radius: 10px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            padding: 40px;
            text-align: center;
            max-width: 600px;
            width: 100%;
        }

        .cancel-container .icon {
            font-size: 4rem;
            color: var(--error-color);
            margin-bottom: 20px;
        }

        .cancel-container h1 {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--error-color);
            margin-bottom: 20px;
        }

        .cancel-container p {
            font-size: 1.2rem;
            margin-bottom: 30px;
            line-height: 1.5;
        }

        .cancel-container .btn {
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

        .cancel-container .btn:hover {
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
    <title>Payment Cancelled | GojushinRyu</title>
    <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;600;700&display=swap"
        rel="stylesheet">
    ${noindex_meta_tags + LinksHbs + style }
</head>

<body>
 ${whiteHeader}

    <main>
        <div class="cancel-container">
            <div class="icon">✖</div>
            <h1>Payment Cancelled</h1>
            <p>Your payment was cancelled. If this was unintentional, please try again or contact support for
                assistance.</p>
            <a class="returnBack btn">Return Back</a>
        </div>
    </main>
    ${Footer}
    <script>
        document.querySelector('.returnBack').addEventListener('click', function (event) {
            event.preventDefault();
            window.location.replace('/home')
        });
    </script>
</body>

</html>
    `);
    res.type('html');
    res.status(200).send(html);
    return;
}

let crPaymentApis = {
    requestPayment,
    paypalPayment,
    paypalPaySuccess,
    paypalPayCancel,
    stripePayment,
    stripePaySuccess,
    stripePayCancel,
    countryRepresentativeFormSubmitedPage
};

export default crPaymentApis;