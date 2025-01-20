/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/


import { request, response } from "express";
import { repleCaracter, repleCrAll, tobe, validate } from "string-player";
import catchError, { namedErrorCatching } from "../utils/catchError.js";
import { sendCourseApplicationEmail } from "../mail/courseContact.mail.js";
import { CourseEnrollments } from "../models/courseEnrollment.js";
import { Settings } from "../models/settings.js";
import PaypalPayment from "../utils/payment/PaypalPayment.js";
import { BASE_URL, PAYPAL_CLIENT_ID, PAYPAL_SECRET, T_PAYPAL_CLIENT_ID, T_PAYPAL_SECRET } from "../utils/env.js";
import StripePay from "../utils/payment/stripe.js";
import CourseCoupons from "../models/course_coupon.js";
import { urlToCloudinaryUrl } from "../Config/cloudinary.js";


export async function coursePurchaseApi(req = request, res = response) {
    try {
        let { studentImage, name, phone, email, postalCode, dob, address, hasDisability, hasBadMedical, sex, hasViolence, disabilityDetails, purpose, mode, payment_method } = req.body;

        {
            if (validate.isEmty(name)) namedErrorCatching('parameter error', 'name is emty');
            if (validate.isEmty(phone)) namedErrorCatching('parameter error', 'phone is emty');
            if (validate.isEmty(email)) namedErrorCatching('parameter error', 'email is emty');
            if (validate.isEmty(postalCode)) namedErrorCatching('parameter error', 'postalCode is emty');
            if (validate.isEmty(studentImage)) namedErrorCatching('parameter error', 'studentImage is emty');
            if (validate.isEmty(dob)) namedErrorCatching('parameter error', 'dob is emty');
            if (validate.isEmty(address)) namedErrorCatching('parameter error', 'address is emty');
            if (validate.isEmty(hasDisability)) namedErrorCatching('parameter error', 'hasDisability is emty');
            // if (validate.isEmty(disabilityDetails)) namedErrorCatching('parameter error', 'disabilityDetails is emty');
            if (validate.isEmty(hasBadMedical)) namedErrorCatching('parameter error', 'hasBadMedical is emty');
            if (validate.isEmty(purpose)) namedErrorCatching('parameter error', 'hasBadMedical is emty');
            if (validate.isEmty(sex)) namedErrorCatching('parameter error', 'hasBadMedical is emty');
            if (validate.isEmty(hasViolence)) namedErrorCatching('parameter error', 'hasBadMedical is emty');    
        }
        {
            if (mode !== '1' && mode !== '5') namedErrorCatching('parameter error', 'mode is emty');
            if (payment_method !== 'paypal' && payment_method !== 'stripe') namedErrorCatching('parameter error', 'mode is emty');
            if (!validate.isEmail(email)) namedErrorCatching('parameter error', 'email is not a email');
            if (hasDisability !== 'Yes' && hasDisability !== 'No') namedErrorCatching('parameter error', 'hasDisability is invalid');
            if (hasBadMedical !== 'Yes' && hasBadMedical !== 'No') namedErrorCatching('parameter error', 'hasBadMedical is invalid');
            if (hasViolence !== 'Yes' && hasViolence !== 'No') namedErrorCatching('parameter error', 'hasViolence is invalid');
            if (sex !== 'Male' && sex !== 'Female') namedErrorCatching('parameter error', 'sex is invalid');
            [name, phone, postalCode, dob, address, purpose] = repleCrAll([name, phone, postalCode, dob, address, purpose]);
        }

      
        let courses = new Map([['1', '  Regular Martial Arts classes'], ['5', `Bhangra Fitness Class for All Ages`]]);
        let settings = await Settings.findOne ({});
        let course_price = (mode === '1' ? settings.fees_of_reqular_class : settings.fees_of_Bhangra_fitness);

        {
            studentImage =await urlToCloudinaryUrl(studentImage);
            if (!studentImage) namedErrorCatching('image-url-error','invalid studentImage url');
        }
        let courseEnrollment = new CourseEnrollments({
            course_id: Number(mode),
            course_name: courses.get(mode),
            course_price: course_price,
            payment_method: payment_method,
            student_image :studentImage,
            student_email: email,
            student_name: name,
            student_phone: phone,
            student_address :address,
            student_dob :dob,
            student_postcode : postalCode,
            student_sex :sex,
            additional_details :{
                hasBadMedical,
                hasDisability,
                hasViolence,
                purpose :purpose
            }
        });
        if (hasDisability === 'Yes' || hasBadMedical === 'Yes' ) {
            if (typeof disabilityDetails === 'string') {
                courseEnrollment.additional_details.disabilityDetails=await repleCaracter(disabilityDetails)
            }
        };

        let paymentPrices = {};
        { //Payment Prices 
            paymentPrices['course_price'] = Math.round(course_price);
            paymentPrices['gst_rate'] = settings.gst_rate / 100;
            paymentPrices['gst'] = paymentPrices['course_price'] * paymentPrices['gst_rate'];
            paymentPrices['total'] = paymentPrices['course_price'] + paymentPrices['gst'];
        }

        
        if (req.body.coupon) {
            req.body.coupon = repleCaracter(req.body.coupon);
            let courseCoupon = await CourseCoupons.findOne({ code: req.body.coupon });
            if (courseCoupon !== null && courseCoupon?.activated === true && courseCoupon?.expiringDate > Date.now()) {
                let rate=courseCoupon.rate;
                paymentPrices.course_price = paymentPrices.course_price - (paymentPrices.course_price * rate);
                paymentPrices.course_price=Math.round(paymentPrices.course_price);
                paymentPrices.gst = paymentPrices.course_price * paymentPrices.gst_rate;
                paymentPrices.gst = Math.round(paymentPrices.gst); 
                paymentPrices.total = paymentPrices.course_price + paymentPrices.gst;
                paymentPrices.total = Math.round(paymentPrices.total);
            }
        }

        

        if (payment_method === 'paypal') {
           
            let paypal = new PaypalPayment({
                client_id: PAYPAL_CLIENT_ID,
                client_secret: PAYPAL_SECRET,
                mode: 'live',
                success_url: BASE_URL + '/api/api_s/course/purchase/paypal/success/',
                cancel_url: BASE_URL + '/api/api_s/course/purchase/paypal/cancel/',
                brand_name: 'School od Traditonal Martial Arts'
            });

            let paymentInfo = await paypal.checkOutWithShipping({
                items: [{
                    name: courses.get(mode),
                    unit_amount: {
                        currency_code: 'USD',
                        value: paymentPrices.course_price.toFixed(2)
                    },
                    quantity: 1
                }],
                shipping: paymentPrices.gst.toFixed(2),
            })
           

            if (paymentInfo.link && paymentInfo.token) {
                courseEnrollment.payment_method ='paypal';
                courseEnrollment.paypal_token = paymentInfo.token;
                await courseEnrollment.save();
                res.status(201).json({ url: paymentInfo.link });
                return;
            }
            else { throw ({ type: "internal error", massage: "can not create paypal error" }) }

        }
        if (payment_method === 'stripe') {
            let stripe = new StripePay({
                success_url: BASE_URL + '/api/api_s/course/purchase/stripe/success' +'?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: BASE_URL + '/api/api_s/course/purchase/stripe/cancel'+'?session_id={CHECKOUT_SESSION_ID}',
            });

            let paymentInfo = await stripe.checkOut({
                shipping_amount: paymentPrices.gst* 100,
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: courses.get(mode),
                            },
                            unit_amount: paymentPrices.course_price*100,
                        },
                        quantity: 1
                    }
                ]
            });

            courseEnrollment.payment_method='stripe';
            courseEnrollment.stripe_session_id =paymentInfo.id;
            await courseEnrollment.save();
            res.status(201).json({ url: paymentInfo.url });
            return;
        }
    } catch (error) {
        catchError(res, error)
    }
}

export async function courseContactApi(req = request, res = response) {
    try {
        let { name, phone, email, country, city, district, zipcode, road_no, mode } = req.body;

        [zipcode] = [Number(zipcode)];

        if (validate.isEmty(name)) namedErrorCatching('parameter error', 'name is emty');
        if (validate.isEmty(phone)) namedErrorCatching('parameter error', 'phone is emty');
        if (validate.isEmty(email)) namedErrorCatching('parameter error', 'email is emty');

        if (validate.isEmty(country)) namedErrorCatching('parameter error', 'country is emty');
        if (validate.isEmty(city)) namedErrorCatching('parameter error', 'city is emty');
        if (validate.isEmty(district)) namedErrorCatching('parameter error', 'district is emty');
        if (validate.isEmty(road_no)) namedErrorCatching('parameter error', 'road_no is emty');
        if (validate.isNaN(zipcode)) namedErrorCatching('parameter error', 'zipcode is emty or not a number');

        if (mode !== '2' && mode !== '3' && mode !== '4') namedErrorCatching('parameter error', 'mode is emty');

        if (!validate.isEmail(email)) namedErrorCatching('parameter error', 'email is not a email');

        if (!tobe.minMax(name, 3, 30)) namedErrorCatching('parameter error', 'name is too short or too big');
        if (!tobe.minMax(country, 3, 30)) namedErrorCatching('parameter error', 'country is too short or too big');
        if (!tobe.minMax(city, 3, 30)) namedErrorCatching('parameter error', 'city is too short or too big');
        if (!tobe.minMax(district, 3, 30)) namedErrorCatching('parameter error', 'district is too short or too big');
        if (!tobe.minMax(road_no, 3, 30)) namedErrorCatching('parameter error', 'road_no is too short or too big');
        if (zipcode < 30 || zipcode > 1000000) namedErrorCatching('parameter error', 'zipcode is too short or too big');

        let courses = new Map([['2', '~Online Martial Art Classes~'], ['3', `~Our Seminars~`], ['4', `~Women Defence Classes~`]]);


        let isSend = await sendCourseApplicationEmail({ student: { name, phone, email, country, city, district, zipcode, road_no }, courseName: courses.get(mode) });

        if (isSend) return res.sendStatus(202);
        else return res.status(500).json({ massage: "Because of the server error , The application failed" });
    } catch (error) {
        catchError(res, error)
    }
}
