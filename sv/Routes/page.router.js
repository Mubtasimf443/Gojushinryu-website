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


let pageRouter = Router();


pageRouter.use(fileRateLimter)
pageRouter.get('/home', (req, res) => res.render('home'))
// pageRouter.get('/course', FindCourseApi)
pageRouter.get('/courses/:name',userCheckAndNavigation,coursePageNavigation)
pageRouter.get('/Membership-application',userCheck, MembershipPageNavigation)
pageRouter.get('/about-us/goju-shin-ryo', (req, res) => res.render('about-us-gsr'))
pageRouter.get('/about-us/school-of-tradistional-martial-arts', (req, res) => res.render('about-us-smta'))
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
pageRouter.get('/post/:name',(req,res)=> res.render('post-detail'));
pageRouter.get('/control-panal',addMinPageRoute);
pageRouter.get('/media/:name',(req,res) => {
    if (req.params.name === 'videos') return res.render('video');
    if (req.params.name === 'video') return res.render('video');
    if (req.params.name==="events") return res.render('events');
    if (req.params.name==="post") return res.render('events');
    if (req.params.name==="images") return res.render('images');    
})
pageRouter.get('/about-us/organization-charts',(req,res)=>res.render('OurOrganaizationChart'))
pageRouter.get('/allience',(req,res)=> res.render('alli'))
pageRouter.get('/accounts/:name',async (req,res)=>{
    if (req.params.name === 'grand-master-counchil') return GMCornerPageRoute(req,res)
    if (req.params.name === 'student') return StudentCornerPageRoute(req,res)
})




export {pageRouter}










