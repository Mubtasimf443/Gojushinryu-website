/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */


import { Router } from "express"
import { Contact_us_api_Function } from '../_lib/api/Contact_Form_Api.js';
import { UplaodImageApi } from '../_lib/api/UplaodImageApi.js';
import { ChangeuserData, changeUserPasswordAPI } from '../_lib/api/Change.userData.js';
import { UplaodImageApiIn25Minutes } from '../_lib/api/UplaodImageApiIn25Minutes.js';
import AdminCheckMidleware from '../_lib/midlewares/AdminCheckMidleware.js';
import { UploadProductApi } from '../_lib/api/uplaod.product.api.js';
import { CreateACourseApi, deleteCourseApi, findCourseEnrollments, giveCourseJsonApi, UpdateCourseDates } from '../_lib/model_base_function/Course.js';
import { deleteEvent, getGmEvents, UploadEventApi } from '../_lib/model_base_function/Event.js';
import { CreateGMApi, DeleteGMAccount, FindGMApi, UpdateGmDataAPI } from '../_lib/model_base_function/gm.js';
import { DeleteProduct, FindProduct, findProductImage, giveProductDetails } from '../_lib/model_base_function/Product.js';
import { BaneUserFunction, DeleteUserAccount, FindMember, FindUser, getUserData, getUserEnrolledCourseApi, getUserMembershipJS, RemoveFromBanedUserFunction } from '../_lib/model_base_function/user.js';
import morgan from 'morgan';
import { log } from "../_lib/utils/smallUtils.js";
import { OrderCancellPaypalApi, OrderSuccessPaypalApi } from "../_lib/api/OrderAPi.js";
import { membershipCancellPaypalApi, membershipSuccessPaypalApi } from "../_lib/api/MembershipApi.js";
import { courseBuyCancellPaypalApi, courseBuySuccessPaypalApi } from "../_lib/api/course.buy.api.js";
import { notificationApi, notificationMailApi } from "../_lib/api/notification.api.js";
import { stripeOrderCancellApi, stripeOrderSuccessApi } from "../_lib/api/stripe.checkout.api.js";
import { findOrders, findUserOrder, updateOrderStatus } from "../_lib/model_base_function/order.js";
import { findMemberShipdata } from "../_lib/model_base_function/membership.js";
import userCheck from "../_lib/midlewares/User.check.js";
import { removeNotificationFromDatabase } from "../_lib/api/basic.notifiation.api.js";
import { checkGM } from "../_lib/midlewares/gm.midleware.js";
import { courseBuyCancellStripeApi, courseBuySuccessStripeApi, stripeCourseBuyAPiJs } from "../_lib/api/stripe.course.buy.api.js";
import { stripeMembershipCancelFunction, stripeMembershipSuccessFunction } from "../_lib/api/membership.srtipe.api.js";
import { changeSettingsAPI } from "../_lib/api/change.settings.api.js";



//variables
let apiRouter =Router()

//midlewares
apiRouter.use(morgan('dev'))



//get
apiRouter.get('/find-grand-master', FindGMApi)
apiRouter.get('/find-product',FindProduct)
apiRouter.get('/find-product-image',findProductImage)
apiRouter.get('/find-user',FindUser)
apiRouter.get('/find-order',findOrders)
apiRouter.get('/find-member', FindMember)
// apiRouter.get('/courses',giveCourseJsonApi)
apiRouter.get('/get_user_orders',userCheck,findUserOrder)
apiRouter.get('/get-user-data',userCheck,getUserData)
apiRouter.get('/get-courses-enrollments-data',findCourseEnrollments)
apiRouter.get('/get-user-membership',userCheck,getUserMembershipJS)
apiRouter.get('/get-user-courses',userCheck,getUserEnrolledCourseApi)


//Post Route
apiRouter.post('/contact' , Contact_us_api_Function)
// apiRouter.post('/upload-course',CreateACourseApi);
apiRouter.post('/upload-product',AdminCheckMidleware,UploadProductApi);
apiRouter.post('/upload-image-for-10-minutes',UplaodImageApi)
apiRouter.post('/upload-image-for-25-minutes',UplaodImageApiIn25Minutes);
apiRouter.post('/upload-event-api',UploadEventApi)
apiRouter.post('/create-grand-master',CreateGMApi)
apiRouter.post('/give-product-details', giveProductDetails)
apiRouter.post('/find-membership-data',findMemberShipdata)
apiRouter.post('/get-gm-events',getGmEvents)


//Update
apiRouter.put('/Update-User-Data',ChangeuserData);
apiRouter.put('/Update-User-Password',changeUserPasswordAPI);
// apiRouter.put('/update-cousre-dates',UpdateCourseDates);
apiRouter.put('/update-grand-master',checkGM ,UpdateGmDataAPI);
apiRouter.put('/bann-user',BaneUserFunction);
apiRouter.put('/remove-from-bann-user', RemoveFromBanedUserFunction);
apiRouter.put('/update-order-status', updateOrderStatus);
apiRouter.put('/remove-notification-form-database',userCheck,removeNotificationFromDatabase)
apiRouter.put('/change-settings', changeSettingsAPI)


//Delete
apiRouter.delete('/delete-product',DeleteProduct)
apiRouter.delete('/delete-grand-master-account',DeleteGMAccount)
apiRouter.delete('/delete-user-account',DeleteUserAccount)
apiRouter.delete('/delete-event', deleteEvent)
// apiRouter.delete('/delete-course',deleteCourseApi )


//payments
apiRouter.get('/paypal-order-success', OrderSuccessPaypalApi)
apiRouter.get('/paypal-order-cancel', OrderCancellPaypalApi);
apiRouter.get('/paypal-membership-success',membershipSuccessPaypalApi);
apiRouter.get('/paypal-membership-cancel',membershipCancellPaypalApi);
apiRouter.get('/paypal-course-buy-success',courseBuySuccessPaypalApi)
apiRouter.get('/paypal-course-buy-cancell',courseBuyCancellPaypalApi)
apiRouter.get('/stripe-order-success',stripeOrderSuccessApi)
apiRouter.get('/stripe-order-cancel', stripeOrderCancellApi)
apiRouter.get('/stripe-course-purchase-success',courseBuySuccessStripeApi)
apiRouter.get('/stripe-course-purchase-cancel',courseBuyCancellStripeApi)
apiRouter.get('/stripe-membership-success',stripeMembershipSuccessFunction);
apiRouter.get('/stripe-membership-cancel',stripeMembershipCancelFunction);


//mail
apiRouter.post('/mail-notification-to-user',notificationMailApi)
apiRouter.post('/notification-to-user',notificationApi)



export default apiRouter