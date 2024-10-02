/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */

import { Router } from "express";
import jwt from 'jsonwebtoken'
import { JWT_SECRET_KEY } from "../_lib/utils/env.js";
import { Admin } from "../_lib/models/Admin.js";
import { addMinPageRoute } from "../_lib/model_base_function/Admin.cpanal.js";
import { GMCornerPageRoute } from "../_lib/model_base_function/gm_council.page.route.js";
import { StudentCornerPageRoute } from "../_lib/model_base_function/st.corner.page.route.js";
import { Alert } from "../_lib/utils/smallUtils.js";
import { Product } from "../_lib/models/Products.js";


let pageRouter = Router();
pageRouter.get('/home', (req, res) => res.render('home'))
pageRouter.get('/course', (req, res) => res.render('course-selling-page'))
pageRouter.get('/courses/:name', (req,res)=> {
    if (req.params.name==="course") return res.render('course-selling-page')
    if (req.params.name==="dates") return res.render('calender')
})
pageRouter.get('/Membership-application', (req, res) => res.render('MembershipFrom'))
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
pageRouter.get('/shop',(req,res)=>res.render('shop'))
pageRouter.get('/shop/:name',(req,res)=> {
    if (req.params.name === 'cart') return res.render('cart');
    if (req.params.name === 'fevorites') return res.render('fevorites');
    if (req.params.name === 'checkout') return res.render('checkout');
    return res.render('shop');
});
pageRouter.get('/post/:name',(req,res)=> res.render('post-detail'));
pageRouter.get('/control-panal' ,addMinPageRoute);
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

pageRouter.get('/shop/equipments/:cetegory/:name', (req,res) =>  {
    let testArray =[req.params.cetegory,req.params.name];
    let test=testArray.findIndex(el => {
        if (typeof el === "number") false
        if (el.includes('['))  return true
        if (el.includes(']'))  return true
        if (el.includes('{')) return true
        if (el.includes('}')) return true
        if (el.includes('(')) return true
        if (el.includes(')')) return true
        if (password.includes('&')) return true
        if (password.includes('$')) return true
        if (password.includes('`')) return true
        if (password.includes('"')) return true
        if (password.includes("'")) return true
        if (password.includes('|')) return true
    }) ;
    if (test !== -1) {
        Alert('Sorry,Can not find The page',res);
    }
    Product.findOne
});




export {pageRouter}










