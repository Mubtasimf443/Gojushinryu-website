/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */
/* By Allah's Marcy I will gain success , Insha Allah*/

import { Router } from "express";
import { findProductImage } from "../_lib/model_base_function/Product.js";
import { fastApiRateLimiter } from "../_lib/Config/express-slow-down.js";
import morgan from "morgan";

const fastApiRouter=Router();
fastApiRouter.use(morgan('dev'))
fastApiRouter.use(fastApiRateLimiter)


fastApiRouter.get('/find-product-image', findProductImage)














export default fastApiRouter