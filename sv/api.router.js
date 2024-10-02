/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */
import { ADMIN_EMAIL, FROM_EMAIL, JWT_SECRET_KEY, MAIL_USER } from './_lib/utils/env.js';
import {mailer} from './_lib/utils/mailer.js'
import { Router, urlencoded } from "express"
import { Alert, log } from './_lib/utils/smallUtils.js';
import { Contact_us_api_Function } from './_lib/api/Contact_Form_Api.js';
import { UplaodImageApi } from './_lib/api/UplaodImageApi.js';
import { ChangeuserData, changeUserPasswordAPI } from './_lib/api/Change.userData.js';
import { UplaodImageApiIn25Minutes } from './_lib/api/UplaodImageApiIn25Minutes.js';
import { UploadImageToCloudinary } from './_lib/Config/cloudinary.js';
import { ImageUrl } from './_lib/models/imageUrl.js';
import { Product } from './_lib/models/Products.js';
import jwt from 'jsonwebtoken' ;
import { Admin } from './_lib/models/Admin.js';
import AdminCheckMidleware from './_lib/midlewares/AdminCheckMidleware.js';
import { UploadProductApi } from './_lib/api/uplaod.product.api.js';


//variables
let apiRouter =Router()

apiRouter.post('/contact' , Contact_us_api_Function)
apiRouter.post('/upload-image-for-10-minutes',UplaodImageApi)
apiRouter.post('/upload-image-for-25-minutes',UplaodImageApiIn25Minutes);
apiRouter.put('/UpdateUserData',ChangeuserData);
apiRouter.put('/Update-User-Password',changeUserPasswordAPI);
apiRouter.post('/upload-product',AdminCheckMidleware,UploadProductApi);


export default apiRouter