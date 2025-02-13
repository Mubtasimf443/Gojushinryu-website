/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { request, response } from "express";
import catchError from "../utils/catchError.js";
import Orders from "../models/Order.js";
import { log, validate } from "string-player";
import PaypalPayment from "../utils/payment/PaypalPayment.js";
import { BASE_URL, Footer, LinksHbs, noindex_meta_tags, PAYPAL_SECRET, PAYPAL_CLIENT_ID,PAYPAL_MODE, T_PAYPAL_CLIENT_ID, T_PAYPAL_SECRET, whiteHeader } from "../utils/env.js";
import StripePay from "../utils/payment/stripe.js";
import path, { resolve } from 'path'
import {readFileSync, rmSync} from 'fs'
import { fileURLToPath } from "url";

const __dirname=path.dirname(fileURLToPath(import.meta.url));

async function OrderPaymentPaypal(req = request, res = response) {
    try {
        let id = req.params.id;
        id = Number(id);
        if (id.toString().toLowerCase() === 'nan') return res.status(400).render('massage_server', { title: 'order no found', body: 'there is no such order found ' });
        let order = await Orders.findOne({ id });
        if (validate.isNull(order)) return res.status(400).render('massage_server', { title: 'order no found', body: 'there is no such order found ' });
        if (order.order_status !== 'Payment Needed') return res.status(400).send('Because of confusion , You can not Pay the order .');
        if (order.isShippingAndTaxAdded !== true) return res.status(400).send('Because of confusion , You can not Pay the order .');
        if (order.adminApproved.status !== true) return res.status(400).send('Because of confusion , You can not Pay the order .');
        if (order.isShippingAndTaxAdded !== true) return res.status(400).send('Because of confusion , You can not Pay the order .');
        if (order.paymentInfo.payment_status !== false) return res.status(400).send('Because of confusion , You can not Pay the order .');
       
        let { total, total_product_price, shipping_cost, tax } = order.amountData;
        [total, total_product_price, shipping_cost, tax] = [total, total_product_price, shipping_cost, tax].map(el => Number(el));
        [total, total_product_price, shipping_cost, tax].map((element, index) => { if (element.toString() === 'NaN') throw (`index ${index} is not a NaN`); });
        let paypal = new PaypalPayment({
            client_id: PAYPAL_CLIENT_ID,
            client_secret: PAYPAL_SECRET,
            mode :PAYPAL_MODE,
            success_url: BASE_URL + `/api/api_s/order/payment/paypal/${order.id}/success`,
            cancel_url: BASE_URL + `/api/api_s/order/payment/paypal/${order.id}/cancel`
        })
        let items = order.shiping_items.map(({ name, quantity, price }) => ({ name: name.length < 80? name : name.substring(0, 80), unit_amount: { currency_code: 'USD', value: price.toFixed(2) }, quantity }))
        
        let { token, link } = await paypal.checkOutWithShipping({ shipping: (shipping_cost + tax).toFixed(2), items });

        if (link && token) {
            order.paymentInfo.payment_method = 'paypal';
            order.paymentInfo.paypal_token = token;
            await order.save();
            return res.redirect(link)
        } else {
            log('there is no link or token')
            res.status(500).send('<h4 style="color:red"> sorry failed to execute your request because of a server error</h4>')
        }
    } catch (error) {
        console.error(error);
        console.error(error?.paypalError?.links);
        
        res.status(500).send('<h4 style="color:red"> sorry failed to execute your request because of a server error</h4>')
    }
}
async function OrderPaymentStripe(req = request, res = response) {
    try {
        let id = req.params.id;
        id = Number(id);
        if (id.toString().toLowerCase() === 'nan') return res.status(400).render('massage_server', { title: 'order no found', body: 'there is no such order found ' });
        let order = await Orders.findOne({ id });
        if (validate.isNull(order)) return res.status(400).render('massage_server', { title: 'order no found', body: 'there is no such order found ' });
        if (order.order_status !== 'Payment Needed') return res.status(400).send('Because of confusion , You can not Pay the order .');
        if (order.isShippingAndTaxAdded !== true) return res.status(400).send('Because of confusion , You can not Pay the order .');
        if (order.adminApproved.status !== true) return res.status(400).send('Because of confusion , You can not Pay the order .');
        if (order.isShippingAndTaxAdded !== true) return res.status(400).send('Because of confusion , You can not Pay the order .');
        if (order.paymentInfo.payment_status !== false) return res.status(400).send('Because of confusion , You can not Pay the order .');
       
        let { total, total_product_price, shipping_cost, tax } = order.amountData;
        [total, total_product_price, shipping_cost, tax] = [total, total_product_price, shipping_cost, tax].map(el => Number(el));
        [total, total_product_price, shipping_cost, tax].map((element, index) => { if (element.toString() === 'NaN') throw (`index ${index} is not a NaN`); });

        let stripe = new StripePay({
            success_url: BASE_URL + `/api/api_s/order/payment/stripe/${order.id}/success` + '?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: BASE_URL + `/api/api_s/order/payment/stripe/${order.id}/cancel` + '?session_id={CHECKOUT_SESSION_ID}',
        })

        let session = await stripe.checkOut({
            shipping_amount: (shipping_cost + tax) * 100,
            line_items: order.shiping_items.map(({ name, price, quantity }) => ({ price_data: { currency: 'usd', product_data: { name: name.length < 100 ? name : name.substring(0, 100), }, unit_amount: (100 * price) }, quantity }))
            // [{ price_data: { currency: 'usd', product_data: { name: undefined }, unit_amount: 1 * 100 }, quantity: 0 }]
        })
        if (session.url && session.id) {

            order.paymentInfo.payment_method = 'stripe';
            order.paymentInfo.stripe_session_id = session.id;
            await order.save();
            return res.redirect(session.url)
        } else {
            log('there is no link or token')
            res.status(500).send('<h4 style="color:red"> sorry failed to execute your request because of a server error</h4>');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('<h4 style="color:red"> sorry failed to execute your request because of a server error</h4>')
    }
}
async function OrderPaymentPaypalSuccess(req = request, res = response) {
    try {
        let token =req.query.token;
        
        if (!token || token?.length < 5 || token?.length > 300 || typeof token !== 'string') throw 'paypal token is not valid';
        let order =await Orders.findOne().where('paymentInfo.paypal_token').equals(token);
        
        if (validate.isNull(order)) {
            log('Order Not found level 1 ...');
            let orderId=Number(req.params.id);
            if (orderId.toString()==='NaN') return res.status(400).render('massage_server', { title: 'order not found', body: 'there is no such order found ' });
            order = await Orders.findOne().where('id').equals(orderId);
            if (validate.isNull(order)) return res.status(400).render('massage_server', { title: 'order not found', body: 'there is no such order found ' });
            if (order.paymentInfo.paypal_token === undefined) return res.status(400).render('massage_server', { title: 'Fake Order Attemp', body: 'The website is finding your order as a Fake order so we can not allow you' });
        }

        if (order.order_status !== 'Payment Needed') return res.status(400).send('Because of confusion , You can not Pay the order .');
        if (order.isShippingAndTaxAdded !== true) return res.status(400).send('Because of confusion , You can not Pay the order .');
        if (order.adminApproved.status !== true) return res.status(400).send('Because of confusion , You can not Pay the order .');
        if (order.isShippingAndTaxAdded !== true) return res.status(400).send('Because of confusion , You can not Pay the order .');

        order.order_status = 'In Process';
        order.paymentInfo.payment_status=true;
        order.paymentInfo.payment_done_date =new Date();
        await  order.save();

        return res.status(200).send(successPage({order_id :order.id , name : order.reciever.name , total:(~~order.amountData.total).toFixed(2),items :order.shiping_items}));
    } catch (error) {
        console.error(error);
        res.status(500).send('<h4 style="color:red"> sorry failed to execute your request because of a server error</h4>');
    }
}
async function OrderPaymentStripeSuccess(req = request, res = response) {
    try {
        let session_id = req.query.session_id;
        if (!session_id || typeof session_id !== 'string' || session_id?.length < 5 || session_id?.length > 500 ) throw 'paypal token is not valid';
        let order =await Orders.findOne().where('paymentInfo.stripe_session_id').equals(session_id);

        
        if (validate.isNull(order)) {
            log('Order Not found level 1 ...');
            let orderId=Number(req.params.id);
            if (orderId.toString()==='NaN') return res.status(400).render('massage_server', { title: 'order not found', body: 'there is no such order found ' });
            order = await Orders.findOne().where('id').equals(orderId);
            if (validate.isNull(order)) return res.status(400).render('massage_server', { title: 'order not found', body: 'there is no such order found ' });
            if (order.paymentInfo.paypal_token === undefined) return res.status(400).render('massage_server', { title: 'Fake Order Attemp', body: 'The website is finding your order as a Fake order so we can not allow you' });
        }
        
        if (order.order_status !== 'Payment Needed') return res.status(400).send('Because of confusion , You can not Pay the order .');
        if (order.isShippingAndTaxAdded !== true) return res.status(400).send('Because of confusion , You can not Pay the order .');
        if (order.adminApproved.status !== true) return res.status(400).send('Because of confusion , You can not Pay the order .');
        if (order.isShippingAndTaxAdded !== true) return res.status(400).send('Because of confusion , You can not Pay the order .');

        order.order_status = 'In Process';
        order.paymentInfo.payment_status=true;
        order.paymentInfo.payment_done_date =new Date();
        await order.save();

        return res.status(200).send(successPage({order_id :order.id , name : order.reciever.name , total:(~~order.amountData.total).toFixed(2) ,items :order.shiping_items}));
    } catch (error) {
        console.error(error);
        res.status(500).send('<h4 style="color:red"> sorry failed to execute your request because of a server error</h4>');
    }
}
async function OrderPaymentPaypalCancel(req = request, res = response) {
    try {
        let token =req.query.token;
        if (!token || token?.length < 5 || token?.length > 300 || typeof token !== 'string') throw 'paypal token is not valid';
        let order =await Orders.findOne().where('paymentInfo.paypal_token').equals(token);
        order.paymentInfo={
            ...order.paymentInfo,
            paypal_token : undefined
        }
        await order.save();
        return res.status(200).send(cancelPage({order_id :order.id , name : order.reciever.name , total:(~~order.amountData.total).toFixed(2),items :order.shiping_items}));
    } catch (error) {
        console.error(error);
        res.status(500).send('<h4 style="color:red"> sorry failed to execute your request because of a server error</h4>');
    }
}
async function OrderPaymentStripeCancel(req = request, res = response) {
    try {
        let session_id = req.query.session_id;
        if (!session_id || typeof session_id !== 'string' || session_id?.length < 5 || session_id?.length > 500 ) throw 'paypal token is not valid';
        let order =await Orders.findOne().where('paymentInfo.stripe_session_id').equals(session_id);
        if (validate.isNull(order)) return res.status(400).render('massage_server', { title: 'order no found', body: 'there is no such order found ' }); 
        order.paymentInfo={
            ...order.paymentInfo,
            stripe_session_id : undefined
        }
        await order.save();

        return res.status(200).send(cancelPage({order_id :order.id , name : order.reciever.name , total:(~~order.amountData.total).toFixed(2),items :order.shiping_items}));
    } catch (error) {
        console.error(error);
        res.status(500).send('<h4 style="color:red"> sorry failed to execute your request because of a server error</h4>');
    }
}
function successPage({ order_id, name, total, items} = { items: [{ name: undefined }] }) {
    total = typeof total === 'number' ? total.toFixed(2) : total;
    const header = readFileSync(resolve(__dirname, '../../tamplates/partials/whiteHeader.hbs'), 'utf-8');
    const footer = readFileSync(resolve(__dirname, '../../tamplates/partials/Footer.hbs'), 'utf-8');
    let style = (`
    <style>
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

        main {
            font-family: var(--font-family);
            background: var(--main-bg);
            color: var(--text-color);
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100vw;
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
    </style>
    `);
    let html =(`
    <!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${noindex_meta_tags}
<title>Payment Success</title>
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
 ${style}
</head>

<body>  
     ${header}
    <main >
    
        <div class="success-container">
            <div class="success-icon">✔</div>
            <h1>Payment Successful!</h1>
            <p>Thank you for your purchase. Your payment has been processed successfully.</p>
    
            <div class="details">
               <div><span>Order Id:</span> ${order_id}</div>
                <div><span>Student Name:</span> ${name}</div>
                <div><span>Products:</span><br> ${items.map((el, i) => ('<b>' + (i + 1) + '</b>' + el?.name)).join(',<br>')}</div>
    
                <div><span>Payment Date:</span> ${new Date().toDateString()}</div>
                <div><span>Total Amount:</span> $${total} </div>
            </div>
    
            <a href="/accounts/student" class="btn">Go to Dashboard</a>
            <a href="/contact" class="btn" style="margin-left: 10px;">Contact Support</a>
        </div>
    </main>
    ${footer}
</body>

</html>
    `);
    return html;
}
function cancelPage({order_id, name, total, items}= { items: [{ name: undefined }] }) {
    total = typeof total === 'number' ? total.toFixed(2) : total;
    let style = (`  <style>
        :root {
            --main-bg: whitesmoke;
            --card-bg: white;
            --accent-color: #ffaa1c;
            --text-color: black;
            --warning-color: #ff9800;
            --font-family: 'Libre Franklin', sans-serif;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        main {
            font-family: var(--font-family);
            background: var(--main-bg);
            color: var(--text-color);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            padding: 20px;
        }

        .canceled-container {
            background: var(--card-bg);
            border-radius: 10px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            padding: 40px;
            text-align: center;
            max-width: 600px;
            width: 100%;
        }

        .canceled-container h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 20px;
            color: var(--warning-color);
        }

        .canceled-container p {
            font-size: 1.2rem;
            margin-bottom: 30px;
        }

        .canceled-container .details {
            margin-bottom: 20px;
            padding: 20px;
            background: var(--main-bg);
            border-radius: 8px;
            text-align: left;
            font-size: 1rem;
        }

        .canceled-container .details div {
            margin-bottom: 10px;
        }

        .canceled-container .details div span {
            font-weight: 600;
        }

        .canceled-container .btn {
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

        .canceled-container .btn:hover {
            background: #e59919;
        }

        .canceled-container .cancel-icon {
            font-size: 4rem;
            color: var(--warning-color);
            margin-bottom: 20px;
        }
    </style>`);
    return (`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Canceled</title>
    <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@300;400;600;700&display=swap" rel="stylesheet">
    ${LinksHbs + style + noindex_meta_tags }

</head>

<body>
${whiteHeader}
    <main>
        <div class="canceled-container">
            <div class="cancel-icon">⚠</div>
            <h1>Payment Canceled</h1>
            <p>Your payment has been canceled. If this was unintentional, you can try again or contact support for assistance.</p>
    
            <div class="details">
                <div><span>Student Name:</span>${name}</div>
                <div><span>Product:</span><br>${items.map((el, i) => ('<b>' + (i + 1) + '</b>' + el?.name)).join(',<br>')} </div>
                <div><span>Order ID:</span> #${order_id}</div>
                <div><span>Canceled Date:</span>${new Date().toLocaleDateString()}</div>
                <div><span>Amount:</span> $${total}</div>
            </div>
    
            <a href="/payment" class="btn">Try Again</a>
            <a href="/contact-support" class="btn" style="margin-left: 10px;">Contact Support</a>
        </div>
    </main>
    ${Footer}
</body>

</html>
`);
}


export default ({ OrderPaymentPaypal, OrderPaymentStripe, OrderPaymentPaypalSuccess, OrderPaymentStripeSuccess, OrderPaymentPaypalCancel, OrderPaymentStripeCancel });