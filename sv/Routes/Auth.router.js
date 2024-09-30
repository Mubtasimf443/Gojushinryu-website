/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */
/* By Allah's Marcy I will gain success , Insha Allah*/

import { Router } from "express";
import { signUpFunction } from "../_lib/auth/signup.auth.js";
import {checkSignUpData_for_user} from '../_lib/auth/check.data.js'
import { user_varification_api } from "../_lib/auth/varify.auth.js";
import { GMLoginApiFunc, loginApiFunc } from "../_lib/auth/login.auth.js";
import { forgetPasswordOtpApi, forgetPasswordResetPassApi } from "../_lib/auth/password.reset.auth.js";
import { adminVaification } from "../_lib/user_role_base_function/admin/Admin.cpanal.js";
let authRouter = Router();



authRouter.post('/user/sign-up',checkSignUpData_for_user,signUpFunction);
authRouter.post('/user/sign-up-otp-varification',user_varification_api);
authRouter.post('/user/sign-in',loginApiFunc);
authRouter.post('/user/reset-password-opt-request',forgetPasswordOtpApi);
authRouter.post('/user/reset-password-request',forgetPasswordResetPassApi);
authRouter.post('/admin/varify',adminVaification);
authRouter.post('/gm/sign-in',GMLoginApiFunc);

export default authRouter;