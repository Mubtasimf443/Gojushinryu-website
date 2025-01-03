/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */


import { Router } from "express"
import { LargeAPIRateLimiter } from "../_lib/Config/RateLimiter.js";
import userCheck from "../_lib/midlewares/User.check.js";
import { OrderApiPaypal } from "../_lib/api/OrderAPi.js";
import morgan from "morgan";
import { MembershipApidataCheckMidleware, paypalMembershipFunction } from "../_lib/api/MembershipApi.js";
import { courseBuyPaypalApi } from "../_lib/api/course.buy.api.js";
import { stripeOrderApi } from "../_lib/api/stripe.checkout.api.js";
import { stripeCourseBuyAPiJs } from "../_lib/api/stripe.course.buy.api.js";
import { membershipMidleWareStripe, stripeMembershipFunction } from "../_lib/api/membership.srtipe.api.js";
import { uplaodPostAPiFucntion } from "../_lib/model_base_function/Post.js";
import { uploadCountryRepresentativeApi } from "../_lib/model_base_function/CountryRepresentatives.js";
import { customMembershipApi } from "../_lib/model_base_function/custom-memberhsip.js";
import CustomLink from "../_lib/models/customLink.js";
import { log } from "string-player";
import { createCustomLink } from "../_lib/model_base_function/customLink.js";
import { customCoursePurchaseApi } from "../_lib/api/custom.course.api.js";

const LargeApiRouter = Router();


// LargeApiRouter.use(LargeAPIRateLimiter);//this will stop attackers form giving a huge request in this large api's
LargeApiRouter.use(function(req,res,next){
    log(req.baseUrl);next()
})
LargeApiRouter.use(morgan('dev'))

//post
LargeApiRouter.post('/custom-link',createCustomLink)
LargeApiRouter.post('/paypal-checkout', userCheck,OrderApiPaypal);
LargeApiRouter.post('/paypal-membership-purchase', userCheck,MembershipApidataCheckMidleware ,paypalMembershipFunction);
LargeApiRouter.post('/paypal-course-purchase-api',userCheck,courseBuyPaypalApi);
LargeApiRouter.post('/stripe-checkout',userCheck,stripeOrderApi)
LargeApiRouter.post('/stripe-membership-api',userCheck,membershipMidleWareStripe,stripeMembershipFunction)
LargeApiRouter.post('/stripe-course-purchase-api',userCheck,stripeCourseBuyAPiJs)
LargeApiRouter.post('/uplaod-post',uplaodPostAPiFucntion)
LargeApiRouter.post('/upload-coutntry-representative',uploadCountryRepresentativeApi)
LargeApiRouter.post('/custom-membership', userCheck, customMembershipApi)
LargeApiRouter.post('/custom-course', userCheck, customCoursePurchaseApi)

export default LargeApiRouter;