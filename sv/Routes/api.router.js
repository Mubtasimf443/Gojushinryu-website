/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */
import { Router } from "express"
import { Contact_us_api_Function } from '../_lib/api/Contact_Form_Api.js';
import { UplaodImageApi } from '../_lib/api/UplaodImageApi.js';
import { ChangeuserData, changeUserPasswordAPI } from '../_lib/api/Change.userData.js';
import { UplaodImageApiIn25Minutes } from '../_lib/api/UplaodImageApiIn25Minutes.js';
import AdminCheckMidleware from '../_lib/midlewares/AdminCheckMidleware.js';
import { UploadProductApi } from '../_lib/api/uplaod.product.api.js';
import { CreateACourseApi, UpdateCourseDates } from '../_lib/model_base_function/Course.js';
import { UploadEventApi } from '../_lib/model_base_function/Event.js';
import { CreateGMApi, DeleteGMAccount, FindGMApi, UpdateGmDataAPI } from '../_lib/model_base_function/gm.js';
import { DeleteProduct, FindProduct, giveProductDetails } from '../_lib/model_base_function/Product.js';
import { BaneUserFunction, DeleteUserAccount, FindMember, FindUser, RemoveFromBanedUserFunction } from '../_lib/model_base_function/user.js';
import morgan from 'morgan';
import { log } from "../_lib/utils/smallUtils.js";
import { OrderCancellPaypalApi, OrderSuccessPaypalApi } from "../_lib/api/OrderAPi.js";
import { membershipCancellPaypalApi, membershipSuccessPaypalApi } from "../_lib/api/MembershipApi.js";



//variables
let apiRouter =Router()

//midlewares
apiRouter.use(morgan('dev'))



//get
apiRouter.get('/find-grand-master', FindGMApi)
apiRouter.get('/find-product',FindProduct)
apiRouter.get('/find-user',FindUser)
apiRouter.get('/find-member', FindMember)



//Post Route
apiRouter.post('/contact' , Contact_us_api_Function)
apiRouter.post('/upload-course',CreateACourseApi);
apiRouter.post('/upload-product',AdminCheckMidleware,UploadProductApi);
apiRouter.post('/upload-image-for-10-minutes',UplaodImageApi)
apiRouter.post('/upload-image-for-25-minutes',UplaodImageApiIn25Minutes);
apiRouter.post('/upload-event-api',UploadEventApi)
apiRouter.post('/create-grand-master',CreateGMApi)
apiRouter.post('/give-product-details', giveProductDetails)


//Update
apiRouter.put('/Update-User-Data',ChangeuserData);
apiRouter.put('/Update-User-Password',changeUserPasswordAPI);
apiRouter.put('/update-cousre-dates',UpdateCourseDates);
apiRouter.put('/update-grand-master',UpdateGmDataAPI);
apiRouter.put('/bann-user',BaneUserFunction);
apiRouter.put('/remove-from-bann-user', RemoveFromBanedUserFunction);


//Delete
apiRouter.delete('/delete-product',DeleteProduct)
apiRouter.delete('/delete-grand-master-account',DeleteGMAccount)
apiRouter.delete('/delete-user-account',DeleteUserAccount)


//payments
apiRouter.get('/paypal-order-success', OrderSuccessPaypalApi)
apiRouter.get('/paypal-order-cancel', OrderCancellPaypalApi);
apiRouter.get('/paypal-membership-success',membershipSuccessPaypalApi);
apiRouter.get('/paypal-membership-cancel',membershipCancellPaypalApi);



export default apiRouter