/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { request, response } from "express";
import catchError, { namedErrorCatching } from "../utils/catchError.js";
import fs, { truncate } from 'fs'
import path, { resolve } from "path";
import { fileURLToPath } from "url";
import { CourseEnrollments } from "../models/courseEnrollment.js";
import { validate } from "string-player";
import { Settings } from "../models/settings.js";
import PaypalPayment from "../utils/payment/PaypalPayment.js";
import { BASE_URL, T_PAYPAL_CLIENT_ID, T_PAYPAL_SECRET } from "../utils/env.js";
import StripePay from "../utils/payment/stripe.js";
let __dirname =path.dirname(fileURLToPath(import.meta.url));



export async function MonthlyFeesRequestPage(req=request, res=response) {
    try {
        let id=req.query.id;
        id=Number(id);
        if (id.toString().toLowerCase()=== 'nan') namedErrorCatching('parameter error', 'id is not a number');
        let enrollment = await CourseEnrollments.findOne({ id });
        if (validate.isNull(enrollment)) throw ('there is no such enrollment in  this id :' + id);
        let id2 = (new Date().getMonth() < 9 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + "-" + new Date().getFullYear();
        let existIndex = enrollment.paymentsData.findIndex(function name(element) {
            if (element.id === id2) return element;
        });
        // if (existIndex === -1) {
        //     return res.status(400).send('Before 1 of month , requesting is not allowed');
        // }
        // if (enrollment.paymentsData[existIndex].paid === true){ 
        //     return res.status(400).send('You Have Paid the fees of this month , so you do  no need to pay again ...')
        // }
        let GST = (await Settings.findOne({}))?.gst_rate ?? 5;
        let html =(`
            <!DOCTYPE html>
<html lang="en">

<head>
    <meta name="robots" content="noindex">
    <link rel="stylesheet" href="/css/root.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pay Your Monthly Course Fees</title>


    <!-- ImportTANT links -->
    <link rel="icon" href="/img/6060.png" type="image/png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link rel="stylesheet" href="/css/header.css">
    <link rel="stylesheet" href="/css/footer.css">
    <link rel="stylesheet" href="/css/dropdown.css">
    <link rel="stylesheet" href="/css/root.css">
    <script src="/js/header.js" defer></script>
    <!-- Google Tag Manager -->
    <script defer src="/js/tags.js"> </script>
    <link rel="shortcut" href="/img/6060.png">

  <script>
  </script>  
<style>
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: 'Libre Franklin';
    }

    :root {
        --main-bg: whitesmoke;
        --card-bg: white;
        --accent-color: #ffaa1c;
        --text-color: black;
        --border-color: #ccc;
        --font-family: 'Libre Franklin', sans-serif;
    }

    body {
        font-family: var(--font-family);
        background: var(--main-bg);
        color: var(--text-color);
        margin: 0;
        padding: 0;
    }

    .payment-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 20px;
    }

    .payment-card {
        background: var(--card-bg);
        width: 100%;
        max-width: 600px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        padding: 30px;
        overflow: hidden;
    }

    .payment-card h2 {
        font-size: 1.8em;
        margin-bottom: 20px;
        color: var(--text-color);
        text-align: center;
    }

    .payment-details {
        margin-bottom: 20px;
    }

    .payment-details div {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
    }

    .payment-details div span {
        font-size: 1em;
    }

    .payment-details div span.label {
        font-weight: bold;
    }

    .payment-options {
        margin-top: 20px;
    }

    .payment-options button {
        width: 100%;
        background: var(--accent-color);
        color: var(--text-color);
        padding: 15px;
        border: none;
        border-radius: 8px;
        font-size: 1.1em;
        font-weight: bold;
        cursor: pointer;
        transition: background 0.3s ease;
    }

    .payment-options button:not(:last-child) {
        margin-bottom: 10px;
    }

    .payment-options button:hover {
        background: #ff9900;
    }

    .payment-footer {
        text-align: center;
        margin-top: 20px;
        font-size: 0.9em;
        color: #555;
    }

    .payment-footer a {
        color: var(--accent-color);
        text-decoration: none;
    }

    .payment-footer a:hover {
        text-decoration: underline;
    }
</style>

</head>

<body>
    {{>Header}}
    

    <div class="payment-container">
        <div class="payment-card">
            <h2>Pay Your Monthly Course Fees</h2>
    
            <div class="payment-details">
                <div>
                    <span class="label">Enrollment ID:</span>
                    <span>#{{id}}</span>
                </div>
                <div>
                    <span class="label">Course Name:</span>
                    <span>{{course_name}}</span>
                </div>
                <div>
                    <span class="label">Monthly Fee:</span>
                    <span>$ {{course_price}}</span>
                </div>
                <div>
                    <span class="label">GST 5%:</span>
                    <span>$ {{GST}}</span>
                </div>
                <div>
                    <span class="label">Total :</span>
                    <span>$ {{Total}}</span>
                </div>
            </div>
    
            <div class="payment-options">
                <button onclick="payWithStripe()">
                    <a href="/api/api_s/course/enrollments/payment/this-month/pay/stripe?id={{id}}" style="color: inherit;text-decoration: none;">
                        Pay with Stripe
                    </a>
                </button>
                <button onclick="payWithPaypal()">
                    <a href="/api/api_s/course/enrollments/payment/this-month/pay/paypal?id={{id}}" style="color: inherit;text-decoration: none;">
                        Pay with PayPal
                    </a>
                </button>
            </div>
    
            <div class="payment-footer">
                <p>Need help? <a href="/contact">Contact support</a></p>
            </div>
        </div>
    </div>

    {{>Footer}}

<script>
  
</script>
</body>

</html>


        `);
        let header = fs.readFileSync(path.resolve(__dirname, '../../tamplates/partials/whiteHeader.hbs'), 'utf-8');
        let footer = fs.readFileSync(path.resolve(__dirname, '../../tamplates/partials/Footer.hbs'), 'utf-8');
        html = html.replace('{{id}}', enrollment.id);
        html = html.replace('{{id}}', enrollment.id);
        html = html.replace('{{id}}', enrollment.id);
        html = html.replace('{{course_name}}', enrollment.course_name);
        html = html.replace('{{course_price}}', enrollment.course_price?.toFixed(2));
        html = html.replace('{{GST}}', enrollment.course_price * (GST / 100));
        html = html.replace('{{Total}}', (enrollment.course_price + (enrollment.course_price * (GST / 100))).toFixed(2));
        html = html.replace('{{>Header}}', header);
        html = html.replace('{{>Footer}}', footer);
        res.send(html);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).send('Because of a error of the website , your request failed ....');
    }
}
export async function MonthlyFeesRequestPayPal(req=request, res=response) {
    try {
        let id=req.query.id;
        id=Number(id);
        if (id.toString().toLowerCase()=== 'nan') namedErrorCatching('parameter error', 'id is not a number');
        let enrollment = await CourseEnrollments.findOne({ id });
        if (validate.isNull(enrollment)) throw ('there is no such enrollment in  this id :' + id);
        let id2 = (new Date().getMonth() < 9 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + "-" + new Date().getFullYear();
        let existIndex = enrollment.paymentsData.findIndex(function name(element) {
            if (element.id === id2) return element;
        });
        if (existIndex === -1) {
            return res.status(400).send('Before 1 of month , requesting is not allowed');
        }
        if (enrollment.paymentsData[existIndex].paid === true){ 
            return res.status(400).send('You Have Paid the fees of this month , so you do  no need to pay again ...')
        }
       
        let GST = (await Settings.findOne({}))?.gst_rate ?? 5;
      
        let payment =new PaypalPayment({
            client_id :T_PAYPAL_CLIENT_ID,
            client_secret :T_PAYPAL_SECRET,
            success_url :BASE_URL+'/api/api_s/course/enrollments/payment/this-month/pay/paypal/success',
            cancel_url : BASE_URL+'/api/api_s/course/enrollments/payment/this-month/pay/paypal/cancel'
        });

        let {link, token}=await payment.checkOutWithShipping({
            shipping : Math.round(enrollment.course_price * (GST/100)),
            items :[{
                name :enrollment.course_name ,
                unit_amount : {
                    currency_code :'USD',
                    value :enrollment.course_price.toFixed(2)
                },
                quantity:1
            }]
        })
        if (link && token) {
            enrollment.paymentsData[existIndex].payment_method='paypal';
            enrollment.paymentsData[existIndex].paypal_token=token;
            await enrollment.save();
            res.redirect(link);
            return;
        } else {
            res.status(500).send('Because of a error of the website , your request failed ....')
            return
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Because of a error of the website , your request failed ....')
    }
}
export async function MonthlyFeesRequestStripe(req=request, res=response) {
    try {
        let id=req.query.id;
        id=Number(id);
        if (id.toString().toLowerCase()=== 'nan') namedErrorCatching('parameter error', 'id is not a number');
        let enrollment = await CourseEnrollments.findOne({ id });
        if (validate.isNull(enrollment)) throw ('there is no such enrollment in  this id :' + id);
        let id2 = (new Date().getMonth() < 9 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + "-" + new Date().getFullYear();
        let existIndex = enrollment.paymentsData.findIndex(function name(element) {
            if (element.id === id2) return element;
        });
        if (existIndex === -1) {
            return res.status(400).send('Before 1 of month , requesting is not allowed');
        }
        if (enrollment.paymentsData[existIndex].paid === true){ 
            return res.status(400).send('You Have Paid the fees of this month , so you do  no need to pay again ...')
        }
        let GST = (await Settings.findOne({}))?.gst_rate ?? 5;

        let stripe=new StripePay({
            success_url :BASE_URL+'/api/api_s/course/enrollments/payment/this-month/pay/stripe/success'+'?session_id={CHECKOUT_SESSION_ID}',
            cancel_url : BASE_URL+'/api/api_s/course/enrollments/payment/this-month/pay/stripe/cancel'+'?session_id={CHECKOUT_SESSION_ID}',
        });

        let rasult=await stripe.checkOut({
            shipping_amount : ((enrollment.course_price * (GST/100)) *100),
            line_items :[
                {
                    price_data: {
                        currency: 'usd', 
                        product_data: {
                            name: enrollment.course_name
                        },
                        unit_amount:enrollment.course_price* 100
                    },
                    quantity:1
                }]
        })
        if (rasult.url && rasult.id) {
            enrollment.paymentsData[existIndex].payment_method='stripe';
            enrollment.paymentsData[existIndex].stripe_session_id=rasult.id;
            await enrollment.save();
            res.redirect(rasult.url);
            return;
        } else {
            res.status(500).send('Because of a error of the website , your request failed ....')
            return
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Because of a error of the website , your request failed ....')
    }
}
export async function MonthlyFeesRequestSuccessPaypal(req=request, res=response) {
    try {
        let token =req.query.token;
        if (!token || token?.length < 5 || token?.length > 300 || typeof token !== 'string') throw 'paypal token is not valid';
        let enrollment = await CourseEnrollments.find()
            .where('activated').equals(true)
            .where('paid').equals(true);
        if (enrollment.length === 0) return res.send('Sorry , this feature will not work as not student has purchased a course')
        let existIndex = enrollment.findIndex(
            function (el) {
                if (el.paymentsData.length === 0) return;
                for (let i = 0; i < el.paymentsData.length; i++) {
                    const { paypal_token,paid } = el.paymentsData[i];
                    if (paypal_token === token && paid === false) return el;
                    if (paypal_token === token && paid !== false) {
                        console.log('This Month fee is paid...');
                    }
                }
            }
        );

        if (existIndex===-1) {
            res.status(400).send('there is no course enrollment data in your request');
            return;
        }

        let GST = (await Settings.findOne({}))?.gst_rate ?? 5;

        enrollment[existIndex].paymentsData= enrollment[existIndex].paymentsData.map(function(el){
            if (el.paypal_token ===token) {
                el.paid=true;
                el.payment_date=new Date();
                el.paidAmount =(enrollment[existIndex].course_price + enrollment[existIndex].course_price *(GST/100)).toFixed(2);
                return el;
            } else return el;
        });
        enrollment[existIndex].paymentThisMonth = { isPaid: true, paidDate: new Date() };
        await enrollment[existIndex].save();
        return res.status(202).send(MonthlyFeesSuccessPage({
            student : enrollment[existIndex].student_name ,
            total : (enrollment[existIndex].course_price + enrollment[existIndex].course_price * (GST / 100)).toFixed(2),
            id :  enrollment[existIndex].id,
            course :enrollment[existIndex].course_name
        }));
    } catch (error) {
        console.error(error);
        res.status(500).send('Because of a error of the website , your request failed ....');
    }
}
export async function MonthlyFeesRequestSuccessStripe(req = request, res = response) {
    try {
        let session_id = req.query.session_id;
        if (!session_id || typeof session_id !== 'string' || session_id?.length < 5 || session_id?.length > 300 ) throw 'paypal token is not valid';
        let enrollment = await CourseEnrollments.find()
            .where('activated').equals(true)
            .where('paid').equals(true);
        if (enrollment.length === 0) return res.send('Sorry , this feature will not work as not student has purchased a course')
        let existIndex = enrollment.findIndex(
            function (el) {
                if (el.paymentsData.length === 0) return;
                for (let i = 0; i < el.paymentsData.length; i++) {
                    const { stripe_session_id, paid } = el.paymentsData[i];
                    if (stripe_session_id === session_id && paid === false) return el;
                    if (stripe_session_id === session_id && paid !== false) {
                        console.log('This Month fee is paid...');
                    }
                }
            }
        );

        if (existIndex === -1) {
            res.status(400).send('there is no course enrollment data in your request');
            return;
        }
        let GST = (await Settings.findOne({}))?.gst_rate ?? 5;

        enrollment[existIndex].paymentsData = enrollment[existIndex].paymentsData.map(function (el) {
            if (el.paypal_token === token) {
                el.paid = true;
                el.payment_date = new Date();
                el.paidAmount = (enrollment[existIndex].course_price + enrollment[existIndex].course_price * (GST / 100)).toFixed(2);
                return el;
            } else return el;
        });
        enrollment[existIndex].paymentThisMonth = { isPaid: true, paidDate: new Date() };
        await enrollment[existIndex].save();


        
        return res.status(202).send(MonthlyFeesSuccessPage({
            student : enrollment[existIndex].student_name ,
            total : (enrollment[existIndex].course_price + enrollment[existIndex].course_price * (GST / 100)).toFixed(2),
            id :  enrollment[existIndex].id,
            course :enrollment[existIndex].course_name
        }));
    } catch (error) {
        console.error(error);
        res.status(500).send('Because of a error of the website , your request failed ....');
    }
}
export async function MonthlyFeesRequestCancelPaypal(req = request, res = response){
    try {
        let token =req.query.token;
        if (!token || token?.length < 5 || token?.length > 300 || typeof token !== 'string') throw 'paypal token is not valid';
        let enrollment = await CourseEnrollments.find()
            .where('activated').equals(true)
            .where('paid').equals(true);
        if (enrollment.length === 0) return res.send('Sorry , this feature will not work as not student has purchased a course')
        let existIndex = enrollment.findIndex(
            function (el) {
                if (el.paymentsData.length === 0) return;
                for (let i = 0; i < el.paymentsData.length; i++) {
                    const { paypal_token,paid } = el.paymentsData[i];
                    if (paypal_token === token && paid === false) return el;
                    if (paypal_token === token && paid !== false) {
                        console.log('This Month fee is paid...');
                    }
                }
            }
        );

        if (existIndex===-1) {
            res.status(400).send('there is no course enrollment data in your request');
            return;
        }
        
        let GST = (await Settings.findOne({}))?.gst_rate ?? 5;

        return res.status(200).send(
            MonthlyFeesCancelPage({
                student: enrollment[existIndex].student_name,
                total: (enrollment[existIndex].course_price + enrollment[existIndex].course_price * (GST / 100)).toFixed(2),
                id: enrollment[existIndex].id,
                course: enrollment[existIndex].course_name,
                payment_link: BASE_URL + '/api/api_s/course/enrollments/payment/this-month?id=' + enrollment[existIndex].id
            })
        );
    } catch (error) {
        console.error(error);
        res.status(500).send('Because of a error of the website , your request failed ....');
    }
}
export async function MonthlyFeesRequestCancelStripe(req = request, res = response){
    try {
        let session_id = req.query.session_id;
        if (!session_id || typeof session_id !== 'string' || session_id?.length < 5 || session_id?.length > 300 ) throw 'paypal token is not valid';
        let enrollment = await CourseEnrollments.find()
            .where('activated').equals(true)
            .where('paid').equals(true);
        if (enrollment.length === 0) return res.send('Sorry , this feature will not work as not student has purchased a course')
        let existIndex = enrollment.findIndex(
            function (el) {
                if (el.paymentsData.length === 0) return;
                for (let i = 0; i < el.paymentsData.length; i++) {
                    const { stripe_session_id, paid } = el.paymentsData[i];
                    if (stripe_session_id === session_id && paid === false) return el;
                    if (stripe_session_id === session_id && paid !== false) {
                        console.log('This Month fee is paid...');
                    }
                }
            }
        );

        if (existIndex === -1) {
            res.status(400).send('there is no course enrollment data in your request');
            return;
        }
        let GST = (await Settings.findOne({}))?.gst_rate ?? 5;

        return res.status(200).send(
            MonthlyFeesCancelPage({
                student: enrollment[existIndex].student_name,
                total: (enrollment[existIndex].course_price + enrollment[existIndex].course_price * (GST / 100)).toFixed(2),
                id: enrollment[existIndex].id,
                course: enrollment[existIndex].course_name,
                payment_link:BASE_URL+ '/api/api_s/course/enrollments/payment/this-month?id=' + enrollment[existIndex].id
            })
        );
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Because of a error of the website , your request failed ....');
    }
}
function MonthlyFeesSuccessPage({student,total, id , course }) {
    let header = fs.readFileSync(path.resolve(__dirname, '../../tamplates/partials/whiteHeader.hbs'), 'utf-8');
    let footer = fs.readFileSync(path.resolve(__dirname, '../../tamplates/partials/Footer.hbs'), 'utf-8');
    let html=(`<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payment Success</title>
            <style>
                :root {
                    --main-bg: whitesmoke;
                    --card-bg: white;
                    --accent-color: #ffaa1c;
                    --text-color: black;
                    --font-family: 'Libre Franklin', sans-serif;
                }
        
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
        
                main {
                    font-family:  'Libre Franklin', sans-serif;
                    background: whitesmoke;
                    color:  black;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    padding: 20px;
                }
        
                .success-container {
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
                    padding: 40px;
                    text-align: center;
                    max-width: 600px;
                    width: 100%;
                }
        
                .success-container h1 {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 20px;
                    color: #ffaa1c;
                }
        
                .success-container p {
                    font-size: 1.2rem;
                    margin-bottom: 30px;
                }
        
                .success-container .details {
                    margin-bottom: 20px;
                    padding: 20px;
                    background: white;
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
                    color: black;
                    background: #ffaa1c;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: 600;
                    transition: background 0.3s;
                }
        
                .success-container .btn:hover {
                    background: #e59919;
                }
        
                .success-container .checkmark {
                    font-size: 4rem;
                    color:#ffaa1c;
                    margin-bottom: 20px;
                }
            </style>
            <!-- ImportTANT links -->
            <link rel="icon" href="/img/6060.png" type="image/png">
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,100..900;1,100..900&display=swap"
                rel="stylesheet">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
                integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
                crossorigin="anonymous" referrerpolicy="no-referrer" />
            <link rel="stylesheet" href="/css/header.css">
            <link rel="stylesheet" href="/css/footer.css">
            <link rel="stylesheet" href="/css/dropdown.css">
            <link rel="stylesheet" href="/css/root.css">
            <script src="/js/header.js" defer></script>
            <!-- Google Tag Manager -->
            <script defer src="/js/tags.js"> </script>
            <link rel="shortcut" href="/img/6060.png">
        </head>
        
        <body>
            ${header}
            <main>
            <div class="success-container">
                <div class="checkmark">✔</div>
                <h1>Payment Successful!</h1>
                <p>Thank you for your payment. Your monthly fees have been successfully processed.</p>
        
                <div class="details">
                    <div><span>Student Name:</span> ${student}</div>
                    <div><span>Course:</span>${course}</div>
                    <div><span>Enrollment ID:</span> #${id}</div>
                    <div><span>Payment Date:</span> ${new Date().toDateString()}</div>
                    <div><span>Amount Paid:</span> ${typeof total === 'number' ? total.toFixed(2) : total}</div>
                </div>
        
                <a href="/accounts/student" class="btn">Go to Dashboard</a>
            </div>
            </main>
            ${footer}
        </body>
        
        </html>`)
    return html;
    
}
function MonthlyFeesCancelPage({ student, total, id, course, payment_link }) {
    let header = fs.readFileSync(path.resolve(__dirname, '../../tamplates/partials/whiteHeader.hbs'), 'utf-8');
    let footer = fs.readFileSync(path.resolve(__dirname, '../../tamplates/partials/Footer.hbs'), 'utf-8');
    let html=(`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Failed</title>
    <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;600;700&display=swap" rel="stylesheet">
     <!-- ImportTANT links -->
 <link rel="icon" href="/img/6060.png" type="image/png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"> 
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<link rel="stylesheet" href="/css/header.css">
<link rel="stylesheet" href="/css/footer.css">
<link rel="stylesheet" href="/css/dropdown.css">
<link rel="stylesheet" href="/css/root.css">
<script src="/js/header.js" defer></script>
<!-- Google Tag Manager -->
<script defer src="/js/tags.js"> </script>
<link rel="shortcut" href="/img/6060.png">
    <style>
        :root {
            --main-bg: whitesmoke;
            --card-bg: white;
            --accent-color: #ffaa1c;
            --text-color: black;
            --error-color: #ff4c4c;
            --font-family: 'Libre Franklin', sans-serif;
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
        .failure-container {
            background: var(--card-bg);
            border-radius: 10px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            padding: 40px;
            text-align: center;
            max-width: 600px;
            width: 100%;
        }

        .failure-container h1 {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 20px;
            color: var(--error-color);
        }

        .failure-container p {
            font-size: 1.2rem;
            margin-bottom: 30px;
        }

        .failure-container .details {
            margin-bottom: 20px;
            padding: 20px;
            background: var(--main-bg);
            border-radius: 8px;
            text-align: left;
            font-size: 1rem;
        }

        .failure-container .details div {
            margin-bottom: 10px;
        }

        .failure-container .details div span {
            font-weight: 600;
        }

        .failure-container .btn {
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

        .failure-container .btn:hover {
            background: #e59919;
        }

        .failure-container .error-icon {
            font-size: 4rem;
            color: var(--error-color);
            margin-bottom: 20px;
        }
    </style>
</head>

<body>
${header}
    <main>
    <div class="failure-container">
        <div class="error-icon">✘</div>
        <h1>Payment Failed</h1>
        <p>Unfortunately, your payment could not be processed. Please try again or contact support for assistance.</p>

        <div class="details">
            <div><span>Student Name:</span>${student}</div>
            <div><span>Course:</span> ${course}</div>
            <div><span>Enrollment ID:</span> #${id}</div>
            <div><span>Attempted Payment Date:</span> ${new Date().toDateString()}</div>
            <div><span>Amount:</span> $${total}</div>
        </div>

        <a href="${payment_link}" class="btn">Try Again</a>
        <a href="/contact" class="btn" style="margin-left: 10px;">Contact Support</a>
    </div>
    </main>
    ${footer}
</body>

</html>
`);
    return html;
    
}


export default ({
    MonthlyFeesRequestPage,
    MonthlyFeesRequestPayPal,
    MonthlyFeesRequestStripe,
    MonthlyFeesRequestSuccessPaypal , 
    MonthlyFeesRequestSuccessStripe,
    MonthlyFeesRequestCancelPaypal, 
    MonthlyFeesRequestCancelStripe
});