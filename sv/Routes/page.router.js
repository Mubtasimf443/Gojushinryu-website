/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */

import { Router } from "express";
import jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY } from "../_lib/utils/env.js";
import { addMinPageRoute } from "../_lib/model_base_function/Admin.js";
import { GMCornerPageRoute } from "../_lib/model_base_function/gm.js";
import { AdminApproveUserAfterRegistration, StudentCornerPageRoute } from "../_lib/model_base_function/user.js";
import { fileRateLimter } from "../_lib/Config/express-slow-down.js";
import { FindCourseApi } from '../_lib/model_base_function/Course.js'
import { findProductPageNavigation, findProductDetails } from '../_lib/model_base_function/Product.js'
import { checkoutPageMidleware } from "../_lib/midlewares/chackoutPageMildleware.js";
import userCheck, { userCheckAndNavigation } from "../_lib/midlewares/User.check.js";
import { MembershipPageNavigation } from "../_lib/midlewares/membership.page.js";
import { coursePageNavigation } from "../_lib/midlewares/course.page.navigation.js";
import { eventPageNavigation } from "../_lib/model_base_function/Event.js";
import { givePostDetailsFunction, postPageNavigation } from "../_lib/model_base_function/Post.js";
import { Settings } from "../_lib/models/settings.js";
import { dayCatch7, longCatch, longCatch24 } from "../_lib/midlewares/catching.js";
import customLinkPage from "../_lib/model_base_function/customLink.js";
import { settingsAsArray } from "../_lib/model_base_function/Settings.js";
import { log } from "string-player";
import catchError from "../_lib/utils/catchError.js";
import { allienceGrandMasterInfo } from "../_lib/model_base_function/AllienceGrandMaster.js";

let router = Router();


router.use(fileRateLimter)
// router.use(
// })

router.get('/home',longCatch24, async (req, res) => {
    try {
        let settings = await Settings.findOne({});
        if (!settings) throw 'error !settings'
        let { home_video_url } = settings;
        if (!home_video_url) throw 'error :!home_video_url'
        res.render('home', {
            home_video_url
        })
    } catch (error) {
        console.log({ error });
        res.render('home')
    }
})
// router.get('/course', FindCourseApi)

router.get('/courses',async function (req, res) {
    try {
        let settings=await Settings.findOne({});
        res.render('course-selling-page', {
            globlal_fees_of_regular_class:settings.fees_of_reqular_class , 
            globlal_fees_of_bhangra_fitness:settings.fees_of_Bhangra_fitness,
            gst_rate : settings.gst_rate,
            dates_of_regular_class:settings.date_of_regular_class.date ?? '0,1',
            dates_of_women_defence_classes: settings.date_of_womens_defence_class.date ?? '0,1',
            dates_of_online_classes: settings.date_of_online_class.date ?? '0,1',
        })
    } catch (error) {
        console.error(error);
        res.render('course-selling-page',{
            globlal_fees_of_regular_class:125 , 
            globlal_fees_of_bhangra_fitness:100,
            gst_rate : 5
        });
    }
})


router.get('/membership-application/:org',async function(req,res) {
    try {
        let global_gst_rate = (await Settings.findOne({})).gst_rate ?? 5;
        if (req.params.org === 'school-of-traditional-martial-arts') return res.render('MembershipFrom', { global_gst_rate });
        if (req.params.org === 'goju-shin-ryu') return res.render('membership_gojushinryu', { global_gst_rate });
        res.redirect('/membership-application/school-of-traditional-martial-arts');
        return;
    } catch (error) {
        catchError(res, error);
    }
});


router.get('/auth/:name',(req, res) => {
    if (req.params.name === 'register') {
        let forwardto=req.query.forwardto;
        if (!forwardto) return res.render('sign-up', { redirectToMembershipPage: false, redirectToCoursePage: false, redirectToCheckoutPage: false });
        if (forwardto === 'membership_page' && req.query.membership_type=== 'gojushinryu') return res.render('sign-up', { redirectToMembershipPage: true, redirectToCoursePage: false, redirectToCheckoutPage: false ,membership_type:'gojushinryu'});
        if (forwardto === 'membership_page') return res.render('sign-up', { redirectToMembershipPage: true, redirectToCoursePage: false, redirectToCheckoutPage: false});
        if (forwardto === 'checkout_page') return res.render('sign-up', {redirectToMembershipPage: false, redirectToCoursePage: false, redirectToCheckoutPage: true });
        if (forwardto === 'course_page') return res.render('sign-up', { redirectToMembershipPage: false, redirectToCoursePage: true, redirectToCheckoutPage: false });
        else return res.render('sign-up', { redirectToMembershipPage: false, redirectToCoursePage: false, redirectToCheckoutPage: false });
    }
    if (req.params.name === 'sign-up') {
        let forwardto=req.query.forwardto;
        if (!forwardto) return res.render('sign-up', { redirectToMembershipPage: false, redirectToCoursePage: false, redirectToCheckoutPage: false });
        if (forwardto === 'membership_page' && req.query.membership_type=== 'gojushinryu') return res.render('sign-up', { redirectToMembershipPage: true, redirectToCoursePage: false, redirectToCheckoutPage: false ,membership_type:'gojushinryu'});
        if (forwardto === 'membership_page') return res.render('sign-up', { redirectToMembershipPage: true, redirectToCoursePage: false, redirectToCheckoutPage: false});
        if (forwardto === 'checkout_page') return res.render('sign-up', {redirectToMembershipPage: false, redirectToCoursePage: false, redirectToCheckoutPage: true });
        if (forwardto === 'course_page') return res.render('sign-up', { redirectToMembershipPage: false, redirectToCoursePage: true, redirectToCheckoutPage: false });
        else return res.render('sign-up', { redirectToMembershipPage: false, redirectToCoursePage: false, redirectToCheckoutPage: false });
    };
    if (req.params.name === 'login') {
        let forwardto=req.query.forwardto;
        if (!forwardto) return res.render('login', { redirectToMembershipPage: false, redirectToCoursePage: false, redirectToCheckoutPage: false });
        if (forwardto === 'membership_page' && req.query.membership_type=== 'gojushinryu' ) return res.render('login', { redirectToMembershipPage: true, redirectToCoursePage: false, redirectToCheckoutPage: false ,membership_type:'gojushinryu'});
        if (forwardto === 'membership_page') return res.render('login', { redirectToMembershipPage: true, redirectToCoursePage: false, redirectToCheckoutPage: false});
        if (forwardto === 'checkout_page') return res.render('login', {redirectToMembershipPage: false, redirectToCoursePage: false, redirectToCheckoutPage: true });
        if (forwardto === 'course_page') return res.render('login',{ redirectToMembershipPage: false, redirectToCoursePage: true, redirectToCheckoutPage: false });
        else return res.render('login', { redirectToMembershipPage: false, redirectToCoursePage: false, redirectToCheckoutPage: false });
    };
    if (req.params.name === 'sign-in') {
        let forwardto=req.query.forwardto;
        if (!forwardto) return res.render('login', { redirectToMembershipPage: false, redirectToCoursePage: false, redirectToCheckoutPage: false });
        if (forwardto === 'membership_page' && req.query.membership_type=== 'gojushinryu' ) return res.render('login', { redirectToMembershipPage: true, redirectToCoursePage: false, redirectToCheckoutPage: false ,membership_type:'gojushinryu'});
        if (forwardto === 'membership_page' ) return res.render('login', { redirectToMembershipPage: true, redirectToCoursePage: false, redirectToCheckoutPage: false});
        if (forwardto === 'checkout_page') return res.render('login', {redirectToMembershipPage: false, redirectToCoursePage: false, redirectToCheckoutPage: true });
        if (forwardto === 'course_page') return res.render('login',{ redirectToMembershipPage: false, redirectToCoursePage: true, redirectToCheckoutPage: false });
        else return res.render('login', { redirectToMembershipPage: false, redirectToCoursePage: false, redirectToCheckoutPage: false });
    }
    if (req.params.name === 'reset-password') return res.render('reset-user-password');
    if (req.params.name === 'otp-varification') {
        if (!req.cookies.vft) return res.status(400).render('notAllowed');
        jwt.verify(req.cookies.vft, JWT_SECRET_KEY, (err, data) => {
            if (err) return res.status(400).render('notAllowed');
            let forwardto=req.query.forwardto;
            if (forwardto === 'membership_page' && req.query.membership_type === 'gojushinryu') return res.render('varification', { redirectToMembershipPage: true, redirectToCoursePage: false, redirectToCheckoutPage: false, membership_type: 'gojushinryu' });
            if (forwardto === 'membership_page') return res.render('varification', { redirectToMembershipPage: true, redirectToCoursePage: false, redirectToCheckoutPage: false });
            if (forwardto === 'checkout_page') return res.render('varification', { redirectToMembershipPage: false, redirectToCoursePage: false, redirectToCheckoutPage: true });
            if (forwardto === 'course_page') return res.render('varification', { redirectToMembershipPage: false, redirectToCoursePage: true, redirectToCheckoutPage: false });
            else return res.render('varification', {});
        });
    }
})


router.get('/contact', dayCatch7,(req, res) => res.render('contact'))
router.get('/shop/equipments/:id', findProductDetails)
router.get('/shop/:name', (req, res) => {
    let { name, cetegory, id } = req.params
    if (name === 'cart') return res.render('cart');
    if (name === 'fevorites') return res.render('fevorites');
    if (name === 'checkout') return res.render('checkout')
});


router.get('/shop', findProductPageNavigation);
router.get('/control-panal', addMinPageRoute);
router.get('/media/:name', dayCatch7,(req, res) => {
    if (req.params.name === 'videos') return res.render('video');
    if (req.params.name === 'video') return res.render('video');
    if (req.params.name === "events") return eventPageNavigation(req, res)
    if (req.params.name === "post") return postPageNavigation(req, res)
    if (req.params.name === "images") return res.render('images');
    if (req.params.name === "saminars") return res.render('saminars');
})

router.get('/custom-links/:type/:unique_id',customLinkPage);
router.get('/countries', dayCatch7,(req, res) => res.render('flags'))
router.get('/media/:name/:id', (req, res) => {
    if (req.params.name === "post") return givePostDetailsFunction(req, res)
});
router.get('/about-us/:info',dayCatch7 ,function (req,res) {
    try {
        let info=req.params.info;
        (info) && (info=info.toLowerCase());
        if (info === 'goju-shin-ryu') return res.render('about-us-gsr');
        if (info === 'school-of-traditional-martial-arts') return  res.render('about-us-smta');
        if (info === 'testimonials') return res.render('testimonials');
        if (info === 'organization-charts') return res.render('OurOrganaizationChart');
        if (info === 'members') return res.render('Members');
        if (info === 'blackbelts') return res.render('BlackBelt');
    } catch (error) {
        console.error(error);
    }
});

router.get('/alliance',(req, res) => res.render('alli'))
router.get('/accounts/:name', async (req, res) => {
    if (req.params.name === 'grand-master-council') return GMCornerPageRoute(req, res)
    if (req.params.name === 'student') return StudentCornerPageRoute(req, res)
});
router.get('/accounts/student/not-approve-by-admin',AdminApproveUserAfterRegistration );
router.get('/become-a-country-representative', (req, res) => res.render('country-representive'));
router.get('/our-country-representatives',longCatch24, (req, res) => res.render('representatives'));
router.get('/saminar-form', function (req,res) {
   res.render('saminar_form'); 
});

router.get('/grand-master-info/:id',allienceGrandMasterInfo);

export { router as pageRouter }