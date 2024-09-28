/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */
/* By Allah's Marcy I will gain success , Insha Allah*/

import { Router } from "express";
import { signUpFunction } from "../_lib/auth/signup.auth.js";
import {checkSignUpData_for_user} from '../_lib/auth/check.data.js'
let authRouter = Router();



authRouter.post('/user/sign-up',checkSignUpData_for_user,signUpFunction);

export default authRouter;