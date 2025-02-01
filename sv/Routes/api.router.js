/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */


import { Router } from "express"
import { Contact_us_api_Function } from '../_lib/api/Contact_Form_Api.js';
import { UplaodImageApi } from '../_lib/api/UplaodImageApi.js';
import { ChangeuserData, changeUserPasswordAPI } from '../_lib/api/Change.userData.js';
import { UplaodImageApiIn25Minutes } from '../_lib/api/UplaodImageApiIn25Minutes.js';
import AdminCheckMidleware from '../_lib/midlewares/AdminCheckMidleware.js';
import { UploadProductApi } from '../_lib/api/uplaod.product.api.js';
import { CreateACourseApi, deleteCourseApi, deleteCourseEnrollment, findCourseEnrollments } from '../_lib/model_base_function/Course.js';
import { adminEventUplaodAPI, deleteEvent, eventsHome, getGmEvents, UploadEventApi } from '../_lib/model_base_function/Event.js';
import { CreateGMApi, DeleteGMAccount, FindGMApi, UpdateGmDataAPI } from '../_lib/model_base_function/gm.js';
import { DeleteProduct, FindProduct, findProductImage, giveProductDetails, productDetailsFormQuery } from '../_lib/model_base_function/Product.js';
import { BaneUserFunction, DeleteUserAccount, findBlackBeltPageBb,  FindUser, getUserData, getUserEnrolledCourseApi, getUserMembershipJS, makeBlackBeltTotheStudent, RemoveFromBanedUserFunction, UserLogout, userSocialMedia } from '../_lib/model_base_function/user.js';
import morgan from 'morgan';
import { log } from "../_lib/utils/smallUtils.js";
import { membershipCancellPaypalApi, membershipSuccessPaypalApi } from "../_lib/api/MembershipApi.js";
import { courseBuyCancellPaypalApi, courseBuySuccessPaypalApi } from "../_lib/api/course.buy.api.js";
import { notificationApi, notificationMailApi } from "../_lib/api/notification.api.js";
import { cancelOrder, findOrders, findUserOrder, orderInDelivery, OrderInPaymentNeeded, orderInProcess, orderIsCompleted, updateOrderStatus } from "../_lib/model_base_function/order.js";
import { findMemberShipdata, findMembersOfMemberPage } from "../_lib/model_base_function/membership.js";
import userCheck from "../_lib/midlewares/User.check.js";
import { removeNotificationFromDatabase } from "../_lib/api/basic.notifiation.api.js";
import { checkGM } from "../_lib/midlewares/gm.midleware.js";
import { courseBuyCancellStripeApi, courseBuySuccessStripeApi, stripeCourseBuyAPiJs } from "../_lib/api/stripe.course.buy.api.js";
import { stripeMembershipCancelFunction, stripeMembershipSuccessFunction } from "../_lib/api/membership.srtipe.api.js";
import { changeSettingsAPI } from "../_lib/api/change.settings.api.js";
import { createTestimonials, getTestimonials, deleteTestimonials, testinmonialsForHomePage, createTestimonialsWithoutImage } from "../_lib/model_base_function/Testimonials.js";
import { allowRepresentative, disAllowRepresentative, getCountryRepresentatives, getCountryRepresentativesForAdmin } from "../_lib/model_base_function/CountryRepresentatives.js";
import { deleteCustomLink, disableCustomLink, enableCustomLink, findCustomLinks } from "../_lib/model_base_function/customLink.js";
import { activateMembershipCoupon, createMembershipCoupon, deActivateMembershipCoupon, deleteMembershipCoupon, getMembershipCouponRates, getMembershipCoupons, updateMembershipCoupon } from "../_lib/model_base_function/membershipcoupon.js";
import { courseContactApi } from "../_lib/course/course.Purchase.Api.js";
import { coursePurchaseCancelPaypal, coursePurchaseCancelStripe, coursePurchaseSuccessPaypal, coursePurchaseSuccessStripe } from "../_lib/course/coursePurchase.success.api.js";
import { noCache } from "../_lib/midlewares/catching.js";
import { courseEnrollmentPaymentRequestApi } from "../_lib/course/ce.payment.request.js";
import MonthlyCourseEnrollMentFees from "../_lib/course/MonthlyFeesPage.js";
import orderPayment from '../_lib/api/orderPayment.js'
import { activateCourseCoupon, createCourseCoupon, deActivateCourseCoupon, deleteCourseCoupon, getCourseCouponRates, getCourseCoupons, updateCourseCoupon } from "../_lib/model_base_function/courseCoupon.js";
import { admin_approveGojushinryuMembership, cancelAndDeleteGojushinryuMembership, findGojushinryuMembershipRequest, GojushinryuMembershipRequestSuccessPage, userIdToImage } from "../_lib/model_base_function/gojushinryuMembership.js";
import catchError from "../_lib/utils/catchError.js";
import { deleteAsset, findAssetsVideoControlPanal, findImageAssetsControlPanal, imagesPageImage, UploadImageAssets, UploadVideoAssets, videosPageVideos } from "../_lib/model_base_function/Assets.js";





//variables
let router =Router()

//midlewares
router.use(morgan('dev'))
router.use(noCache)


//get
router.get('/find-grand-master', FindGMApi)
router.get('/find-product',FindProduct)
router.get('/find-product-image',findProductImage)
router.get('/find-user',FindUser)
router.get('/find-order',findOrders)
router.get('/get_user_orders',userCheck,findUserOrder)
router.get('/get-user-data',userCheck,getUserData)
router.get('/get-courses-enrollments-data',findCourseEnrollments)
router.get('/get-user-membership',userCheck,getUserMembershipJS)
router.get('/get-user-courses',userCheck,getUserEnrolledCourseApi)
router.get('/get-product-from-query', productDetailsFormQuery);
router.get('/testimonials', getTestimonials)
router.get('/testimonials/home', testinmonialsForHomePage)
router.get('/events/home', eventsHome)
router.get('/country-representative',getCountryRepresentatives)
router.get('/country-representative-for-admin',getCountryRepresentativesForAdmin)
router.get('/custom-link',findCustomLinks);
router.get('/coupons/memberships' , getMembershipCoupons);
router.get('/coupons/memberships/rate' , getMembershipCouponRates);
router.get('/coupons/course' , getCourseCoupons);
router.get('/coupons/course/rate' , getCourseCouponRates);
router.get('/course/purchase/paypal/success', coursePurchaseSuccessPaypal);
router.get('/course/purchase/paypal/cancel', coursePurchaseCancelPaypal);
router.get('/course/purchase/stripe/success', coursePurchaseSuccessStripe);
router.get('/course/purchase/stripe/cancel', coursePurchaseCancelStripe);
router.get('/course/enrollments/payment/this-month', MonthlyCourseEnrollMentFees.MonthlyFeesRequestPage);
router.get('/course/enrollments/payment/this-month/pay/paypal', MonthlyCourseEnrollMentFees.MonthlyFeesRequestPayPal);
router.get('/course/enrollments/payment/this-month/pay/stripe',  MonthlyCourseEnrollMentFees.MonthlyFeesRequestStripe);
router.get('/course/enrollments/payment/this-month/pay/paypal/success', MonthlyCourseEnrollMentFees.MonthlyFeesRequestSuccessPaypal);
router.get('/course/enrollments/payment/this-month/pay/paypal/cancel', MonthlyCourseEnrollMentFees.MonthlyFeesRequestCancelPaypal);
router.get('/course/enrollments/payment/this-month/pay/stripe/success',  MonthlyCourseEnrollMentFees.MonthlyFeesRequestSuccessStripe);
router.get('/course/enrollments/payment/this-month/pay/stripe/cancel',  MonthlyCourseEnrollMentFees.MonthlyFeesRequestCancelStripe);
router.get('/order/payment/paypal/:id/success', orderPayment.OrderPaymentPaypalSuccess);
router.get('/order/payment/stripe/:id/success', orderPayment.OrderPaymentStripeSuccess);
router.get('/order/payment/paypal/:id/cancel', orderPayment.OrderPaymentPaypalCancel);
router.get('/order/payment/stripe/:id/cancel', orderPayment.OrderPaymentStripeCancel);
router.get('/gojusinryu-membership-request-success',GojushinryuMembershipRequestSuccessPage);
router.get('/gojusinryu-membership-request-list',findGojushinryuMembershipRequest);
router.get('/user-id-to-image',userIdToImage);
router.get('/user-social-media',userCheck, userSocialMedia.getUserSocialMedia);
router.get('/find-members-of-member-page',findMembersOfMemberPage);
router.get('/find-black-belt-of-black-belt-page',findBlackBeltPageBb);
router.get('/user-logout', UserLogout);
router.get('/assets/image/control-panal', findImageAssetsControlPanal );
router.get('/assets/image/page', imagesPageImage );
router.get('/assets/video/control-panal', findAssetsVideoControlPanal );
router.get('/assets/video/page', videosPageVideos );

//Post Route
router.post('/contact' , Contact_us_api_Function)
router.post('/upload-product',AdminCheckMidleware,UploadProductApi);
router.post('/upload-image-for-10-minutes',UplaodImageApi)
router.post('/upload-image-for-25-minutes',UplaodImageApiIn25Minutes);
router.post('/upload-event-api',UploadEventApi)
router.post('/create-grand-master',CreateGMApi)
router.post('/give-product-details', giveProductDetails)
router.post('/find-membership-data',findMemberShipdata)
router.post('/get-gm-events',getGmEvents)
router.post('/admin-event-upload-api', adminEventUplaodAPI);
router.post('/testimonials', createTestimonials)
router.post('/testimonials-second-api', createTestimonialsWithoutImage);
router.post('/coupons/memberships' , createMembershipCoupon);
router.post('/coupons/course' , createCourseCoupon);
router.post('/course/apply/contact', courseContactApi );
router.post('/assets/image', UploadImageAssets );
router.post('/assets/video', UploadVideoAssets );


//Update
router.put('/Update-User-Data',ChangeuserData);
router.put('/Update-User-Password',userCheck,changeUserPasswordAPI);
router.put('/update-grand-master',checkGM ,UpdateGmDataAPI);
router.put('/bann-user',BaneUserFunction);
router.put('/remove-from-bann-user', RemoveFromBanedUserFunction);
router.put('/update-order-status', updateOrderStatus);
router.put('/remove-notification-form-database',userCheck,removeNotificationFromDatabase)
router.put('/change-settings', changeSettingsAPI)
router.put('/allow-representative',allowRepresentative);
router.put('/disAllow-representative',disAllowRepresentative);
router.put('/custom-link/enable', enableCustomLink);
router.put('/custom-link/disable', disableCustomLink);
router.put('/order/order_status/payment_needed', OrderInPaymentNeeded);
router.put('/order/order_status/in_process', orderInProcess);
router.put('/order/order_status/in_delivery', orderInDelivery);
router.put('/order/order_status/completed', orderIsCompleted);
router.put('/coupons/memberships' , updateMembershipCoupon);
router.put('/coupons/memberships/activate' , activateMembershipCoupon);
router.put('/coupons/memberships/deactivate' , deActivateMembershipCoupon);
router.put('/coupons/course' , updateCourseCoupon);
router.put('/coupons/course/activate' , activateCourseCoupon);
router.put('/coupons/course/deactivate' , deActivateCourseCoupon);
router.put('/course/enrollments/payment-request' , courseEnrollmentPaymentRequestApi);
router.put('/gojusinryu-membership-request-approve' , admin_approveGojushinryuMembership);
router.put('/user-social-media/facebook',userCheck, userSocialMedia.upDateSmFacebook);
router.put('/user-social-media/instagram',userCheck, userSocialMedia.upDateSmInstagram);
router.put('/user-social-media/linkedin',userCheck, userSocialMedia.upDateSmLinkedin);
router.put('/user-social-media/twitter',userCheck, userSocialMedia.upDateSmTwitter);
router.put('/user/make-black-belt', makeBlackBeltTotheStudent);

//Delete
router.delete('/delete-product',DeleteProduct)
router.delete('/delete-grand-master-account',DeleteGMAccount)
router.delete('/delete-user-account',DeleteUserAccount)
router.delete('/delete-event', deleteEvent)
router.delete('/testimonials', deleteTestimonials)
router.delete('/custom-link', deleteCustomLink)
router.delete('/order/cancel', cancelOrder)
router.delete('/coupons/memberships' , deleteMembershipCoupon);
router.delete('/coupons/course' , deleteCourseCoupon);
router.delete('/course/enrollments' , deleteCourseEnrollment);
router.delete('/gojusinryu-membership-request-delete' , cancelAndDeleteGojushinryuMembership);
router.delete('/assets' , deleteAsset);


//payments

router.get('/paypal-membership-success',membershipSuccessPaypalApi);
router.get('/paypal-membership-cancel',membershipCancellPaypalApi);
router.get('/paypal-course-buy-success',courseBuySuccessPaypalApi)
router.get('/paypal-course-buy-cancell',courseBuyCancellPaypalApi)
router.get('/stripe-course-purchase-success',courseBuySuccessStripeApi)
router.get('/stripe-course-purchase-cancel',courseBuyCancellStripeApi)
router.get('/stripe-membership-success',stripeMembershipSuccessFunction);
router.get('/stripe-membership-cancel',stripeMembershipCancelFunction);


//mail
router.post('/mail-notification-to-user',notificationMailApi)
router.post('/notification-to-user',notificationApi)



export default router