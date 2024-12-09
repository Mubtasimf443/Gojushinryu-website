/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import CustomLink from "../models/customLink.js";
import {log, MakePriceString} from 'string-player'
import { repleCaracter } from "../utils/replaceCr.js";
import { CourseEnrollments } from "../models/courseEnrollment.js";
import { createPaypalPayment } from "../utils/payment/create.order.paypal.js";
import { createStripeCheckOut } from "../Config/stripe.js";

export async function customCoursePurchaseApi(req,res) {
    try {
        let courseData=await purifyCourseData(req);
        let courseEnrollMent=await createNewCourseEnrollment(courseData, req);
        let {link}=await createPayment(courseData, courseEnrollMent);
        if (!link) throw 'create payment is not giving a link'
        return res.status(201).json({
            hasError :false , 
            link :link
        })
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            hasError :true,
            error :error
        })
    }
}
async function purifyCourseData(req) {
    try {
        let {courseData,paymentMethod}=req.body;
        if (typeof courseData !== 'object') throw 'courseData is not object or undefined'
        let {date_of_birth,postcode,district,country,city,customCourseId}=courseData;
        
        
        //type check
        if (typeof postcode  !== 'number') throw 'postcode is not a number'
        if ( postcode.toString()  === 'NaN') throw 'postcode is not a number'
        if (typeof customCourseId  !== 'number') throw 'customCourseId is not a number'
        if ( customCourseId.toString() === 'NaN') throw 'customCourseId is not a number'


        if (typeof date_of_birth  !== 'string') throw 'date_of_birth is not a string'
        if (typeof district  !== 'string') throw 'district is not a string'
        if (typeof city  !== 'string') throw 'city is not a string'
        if (typeof country  !== 'string') throw 'country is not a string'
        if ( paymentMethod !=='stripe'&& paymentMethod !=='paypal') throw 'paymentMethod is not paypal or stripe'

        date_of_birth=await repleCaracter(date_of_birth);
        district=await repleCaracter(district);
        city=await repleCaracter(city);
        country=await repleCaracter(country);

        let customCourse=await CustomLink.findOne({
            unique_id :customCourseId
        });

        if (!customCourse) throw ('not custom course exist in database for this id :'+customCourseId)
        if (customCourse.linkActivated===false) throw 'The Link is not activated'
        if (typeof customCourse.course!=='object') throw `this is a membership custom link , not course custom link`

        let course =customCourse.course;

        return {
            date_of_birth,
            city,
            district,
            country,
            postcode,
            course,
            paymentMethod
        }
    } catch (massage) {
        throw {
            code :1 ,
            massage :massage,
            name :'course Data Check error'
        }
    }
}
async function createNewCourseEnrollment(courseData,req ) {
    try {
        let courseEnrollMent =new CourseEnrollments({
            course_name :courseData.course.name,
            name:courseData.course.name,
            course_id :courseData.course.course_id,
            student_id :req.user_info._id,
            Date : new Date(),
            course_price:courseData.course.price,
            student_city :courseData.city,
            student_country :courseData.country ,
            student_district :courseData.district ,
            student_postcode :courseData.postcode ,
        });

        let data= await courseEnrollMent.save();
        return data
    } catch (error) {
        console.error(error);
        throw {
            code :2 ,
            massage :massage,
            name :'Database creating error'
        }
    }
}
async function createPayment(courseData,enrollment){
    try {
        if (courseData.paymentMethod==='stripe') {
            let items=[{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: courseData.course.name
                    },
                        unit_amount: Number(courseData.course.price)*100
                },
                quantity: 1
            }];
    
            let data = await createStripeCheckOut({
                line_items:items,
                success_url :'/api/api_s/stripe-course-purchase-success',
                cancel_url :'/api/api_s/stripe-course-purchase-cancel',
                amount_shipping : 0
            });

            if (!data) throw 'sorry , can make stripe payment and no data '
            if (!data.url) throw 'failed  to load data'
            enrollment.payment_method ='stripe';
            enrollment.stripe_session_id = data.id;
            await enrollment.save().then((e)=> log(`//ernollment updated and stripe payment session id is ${e.stripe_session_id}`));
            return {
                link:data.url
            }
        }
        if (courseData.paymentMethod==='paypal') {
            let value = await MakePriceString(courseData.course.price)
            
            let items = [{
                name:  courseData.course.name,
                description:  courseData.course.name,
                quantity: 1,
                unit_amount: {
                    currency_code: 'USD',
                    value: value
                }
            }];

            let {error,success,paypal_id,link } = await createPaypalPayment({
                items:items,
                total:value ,
                productToatal:value ,
                shipping:0,
                success_url :'/api/api_s/paypal-course-buy-success',
                cancell_url :'/api/api_s/paypal-course-buy-cancell'
            })


            if (error) throw error

            if (success) {
                enrollment.payment_method ='paypal';
                enrollment.paypal_token=paypal_id;
                await enrollment.save()
                .then(
                    function(data){
                        log(`//ernollment updated and paypal payment token  is ${data.paypal_token}`)
                    }
                )

                return {
                    link
                }
            }
        }
    } catch (error) {
        throw {
            code :3 ,
            name:'Payment error' ,
            massage:error 
        }
    }
}