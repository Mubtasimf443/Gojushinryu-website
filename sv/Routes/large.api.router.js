/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */


import { Router } from "express"
import { LargeAPIRateLimiter } from "../_lib/Config/RateLimiter.js";
import userCheck from "../_lib/midlewares/User.check.js";
import { OrderApiPaypal } from "../_lib/api/OrderAPi.js";
import morgan from "morgan";
import { MembershipApidataCheckMidleware, paypalMembershipFunction } from "../_lib/api/MembershipApi.js";

const LargeApiRouter = Router();


LargeApiRouter.use(LargeAPIRateLimiter);
LargeApiRouter.use(morgan('dev'))


//post
LargeApiRouter.post('/paypal-checkout', userCheck,OrderApiPaypal);
LargeApiRouter.post('/paypal-membership-purchase', userCheck,MembershipApidataCheckMidleware ,paypalMembershipFunction);







export default LargeApiRouter;