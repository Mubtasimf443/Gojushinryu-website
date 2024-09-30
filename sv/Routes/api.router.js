/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */
import { ADMIN_EMAIL, FROM_EMAIL, MAIL_USER } from '../_lib/env.js';
import {mailer} from '../_lib/mailer.js'
import { Router } from "express"
import { log } from '../_lib/smallUtils.js';
import { Contact_us_api_Function } from '../_lib/api/Contact_Form_Api.js';
import { UplaodImageApi } from '../_lib/api/UplaodImageApi.js';
import { ChangeuserData } from '../_lib/api/Change.userData.js';
let apiRouter =Router()

apiRouter.post('/contact' , Contact_us_api_Function)
apiRouter.post('/upload-image-for-10-minutes',UplaodImageApi)
apiRouter.put('/UpdateUserData',ChangeuserData);




export default apiRouter