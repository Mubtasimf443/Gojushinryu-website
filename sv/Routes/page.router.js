/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */

import { Router } from "express";
import jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY } from "../_lib/utils/env.js";
import { addMinPageRoute } from "../_lib/model_base_function/Admin.js";
import { GMCornerPageRoute } from "../_lib/model_base_function/gm.js";
import { StudentCornerPageRoute } from "../_lib/model_base_function/user.js";
import { fileRateLimter } from "../_lib/Config/express-slow-down.js";
import {FindCourseApi} from '../_lib/model_base_function/Course.js'
import {findProductPageNavigation ,findProductDetails} from '../_lib/model_base_function/Product.js'
import { checkoutPageMidleware } from "../_lib/midlewares/chackoutPageMildleware.js";
import userCheck, { userCheckAndNavigation } from "../_lib/midlewares/User.check.js";
import { MembershipPageNavigation } from "../_lib/midlewares/membership.page.js";
import { coursePageNavigation } from "../_lib/midlewares/course.page.navigation.js";
import { eventPageNavigation } from "../_lib/model_base_function/Event.js";
import { givePostDetailsFunction, postPageNavigation } from "../_lib/model_base_function/Post.js";
import { Settings } from "../_lib/models/settings.js";


let pageRouter = Router();


pageRouter.use(fileRateLimter)
pageRouter.get('/home',async (req, res) => { 
    try {
        let settings=await Settings.findOne({});
        if (!settings) throw 'error !settings'
        let {home_video_url}=settings;
        
        if (!home_video_url) throw 'error :!home_video_url'
        res.render('home',{
        home_video_url
        }) 
    } catch (error) {
        console.log({error});
        res.render('home')
    }
})
// pageRouter.get('/course', FindCourseApi)

pageRouter.get('/courses',(req,res) => res.render('course-selling-page'))
pageRouter.get('/courses/date',async (req,res) => {
    try {
        let settings=await Settings.findOne({})
        return res.render('calender',{
            date_of_womens_defence_class:settings.date_of_womens_defence_class.date ?? '',
            date_of_regular_class:settings.date_of_regular_class.date ?? '',
            date_of_online_class:settings.date_of_online_class.date ?? ''
          }) 
    } catch (error) {
        console.log({error});
    }
})

pageRouter.get('/Membership-application',userCheckAndNavigation, MembershipPageNavigation)
pageRouter.get('/about-us/goju-shin-ryu', (req, res) => res.render('about-us-gsr'))
pageRouter.get('/about-us/school-of-traditional-martial-arts', (req, res) => res.render('about-us-smta'))
pageRouter.get('/about-us/testimonials', (req, res) => res.render('testimonials'))
// pageRouter.get('/dates',(req,res)=>res.render('calender'))
pageRouter.get('/auth/:name',(req,res)=> {
    if (req.params.name === 'register') return res.render('sign-up');
    if (req.params.name === 'sign-up') return res.render('sign-up');
    if (req.params.name === 'login') return res.render('login');
    if (req.params.name === 'sign-in') return res.render('login');
    if (req.params.name === 'reset-password') return res.render('reset-user-password');
    if (req.params.name === 'otp-varification') {
       // console.log(req.cookies.vft);
        if (!req.cookies.vft) return res.status(400).render('notAllowed');
        jwt.verify(req.cookies.vft,JWT_SECRET_KEY,(err,data)=> {
            if (err) return res.status(400).render('notAllowed');
            return res.render('varification')
        })
    }
    if (req.params.name === 'reset-password') return res.render('reset-password');
})
pageRouter.get('/contact',(req,res)=>res.render('contact'))
pageRouter.get('/shop/equipments/:id',findProductDetails)
pageRouter.get('/shop/:name',(req,res)=> {
    let {name,cetegory,id}=req.params
    if (name === 'cart') return res.render('cart');
    if (name === 'fevorites') return res.render('fevorites');
    if (name === 'checkout') return checkoutPageMidleware(req,res); 
});
pageRouter.get('/shop', findProductPageNavigation);
pageRouter.get('/control-panal',addMinPageRoute);
pageRouter.get('/media/:name',(req,res) => {   
    if (req.params.name === 'videos') return res.render('video');
    if (req.params.name === 'video') return res.render('video');
    if (req.params.name==="events") return eventPageNavigation(req,res)
    if (req.params.name === "post") return postPageNavigation(req,res)
    if (req.params.name==="images") return res.render('images');    
})

pageRouter.get('/media/:name/:id',(req,res) => {
    if (req.params.name === "post") return givePostDetailsFunction(req,res)
})
pageRouter.get('/about-us/organization-charts',(req,res)=>res.render('OurOrganaizationChart'))
pageRouter.get('/alliance',(req,res)=> res.render('alli'))
pageRouter.get('/accounts/:name',async (req,res)=>{
    if (req.params.name === 'grand-master-counchil') return GMCornerPageRoute(req,res)
    if (req.params.name === 'student') return StudentCornerPageRoute(req,res)
})


pageRouter.get('/course/:name',async (req,res) => {
    try {
        let settings=await Settings.findOne({})
        let name =req.params.name;
        let date='';
        if (name === 'regular-classes') {
            date=settings.date_of_regular_class.date;
            return res.render('course__regular__class',{date})
        }
        if (name === 'Online-classes') {
            date=settings.date_of_online_class.date;
            return res.render('course__online__class',{date})
        }
         if (name === 'women-fitness-classes') {
            date=settings.date_of_womens_defence_class.date;
            return res.render('course__womens_seminars',{date})
        }
        if (name === 'our-seminars') return res.render('course_our_seminar')
        if (name === 'bhangar-fitness-classes-for-all-ages') return res.render('course__banghar__fitness__class')    
    } catch (error) {
        console.log({error});
    }
  
})





export {pageRouter}










