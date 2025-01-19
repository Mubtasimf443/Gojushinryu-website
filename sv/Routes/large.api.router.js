/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */


import {  Router } from "express"
import { LargeAPIRateLimiter } from "../_lib/Config/RateLimiter.js";
import userCheck from "../_lib/midlewares/User.check.js";
import morgan from "morgan";
import { MembershipApidataCheckMidleware, paypalMembershipFunction } from "../_lib/api/MembershipApi.js";
import { courseBuyPaypalApi } from "../_lib/api/course.buy.api.js";
import { stripeCourseBuyAPiJs } from "../_lib/api/stripe.course.buy.api.js";
import { membershipMidleWareStripe, stripeMembershipFunction } from "../_lib/api/membership.srtipe.api.js";
import { uplaodPostAPiFucntion } from "../_lib/model_base_function/Post.js";
import { uploadCountryRepresentativeApi } from "../_lib/model_base_function/CountryRepresentatives.js";
import { customMembershipApi } from "../_lib/model_base_function/custom-memberhsip.js";
import CustomLink from "../_lib/models/customLink.js";
import { log } from "string-player";
import { createCustomLink } from "../_lib/model_base_function/customLink.js";
import { customCoursePurchaseApi } from "../_lib/api/custom.course.api.js";
import { createOrder } from "../_lib/model_base_function/order.js";
import { coursePurchaseApi } from "../_lib/course/course.Purchase.Api.js";
import orderPayment from '../_lib/api/orderPayment.js'
import requestGojushinryuMembership from "../_lib/model_base_function/gojushinryuMembership.js";

const router = Router();


// Outer.use(LargeAPIRateLimiter);//this will stop attackers form giving a huge request in this large api's
router.use(function(req,res,next){
    log(req.baseUrl);next()
})
router.use(morgan('dev'))

//get 
router.get('/order/payment/paypal/:id', orderPayment.OrderPaymentPaypal);
router.get('/order/payment/stripe/:id', orderPayment.OrderPaymentStripe);


//post
router.post('/custom-link', createCustomLink)
router.post('/paypal-membership-purchase', userCheck, MembershipApidataCheckMidleware, paypalMembershipFunction);
router.post('/paypal-course-purchase-api', userCheck, courseBuyPaypalApi);
router.post('/stripe-membership-api', userCheck, membershipMidleWareStripe, stripeMembershipFunction)
router.post('/stripe-course-purchase-api', userCheck, stripeCourseBuyAPiJs)
router.post('/uplaod-post', uplaodPostAPiFucntion)
router.post('/upload-coutntry-representative', uploadCountryRepresentativeApi)
router.post('/custom-membership', userCheck, customMembershipApi)
router.post('/custom-course', userCheck, customCoursePurchaseApi)
router.post('/order/create', userCheck, createOrder);
router.post('/course/purchase', coursePurchaseApi);
router.post('/request-gojushinryu-membership', userCheck, requestGojushinryuMembership);


export default router;