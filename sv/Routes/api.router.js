/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */
import { ADMIN_EMAIL, FROM_EMAIL, MAIL_USER } from '../_lib/env.js';
import {mailer} from '../_lib/mailer.js'
import { Router } from "express"
import { log } from '../_lib/smallUtils.js';
import { Contact_us_api_Function } from '../_lib/api/Contact_Form_Api.js';
import { UplaodImageApi } from '../_lib/api/UplaodImageApi.js';
import { ChangeuserData, changeUserPasswordAPI } from '../_lib/api/Change.userData.js';
import { UplaodImageApiIn25Minutes } from '../_lib/api/UplaodImageApiIn25Minutes.js';


//variables
let apiRouter =Router()

apiRouter.post('/contact' , Contact_us_api_Function)
apiRouter.post('/upload-image-for-10-minutes',UplaodImageApi)
apiRouter.post('/upload-image-for-25-minutes',UplaodImageApiIn25Minutes)
apiRouter.put('/UpdateUserData',ChangeuserData);
apiRouter.put('/Update-User-Password',changeUserPasswordAPI);

export default apiRouter