/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */


import { Router } from "express"
import { LargeAPIRateLimiter } from "../_lib/Config/RateLimiter.js";
import userCheck from "../_lib/midlewares/User.check.js";
import { OrderApiPaypal } from "../_lib/api/OrderAPi.js";

const LargeApiRouter = Router();


LargeApiRouter.use(LargeAPIRateLimiter);


LargeApiRouter.post('/paypal-checkout', userCheck,OrderApiPaypal);





export default LargeApiRouter;