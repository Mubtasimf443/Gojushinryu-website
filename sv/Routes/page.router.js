/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */

import { Router } from "express";

let pageRouter = Router();
pageRouter.get('/home', (req, res) => res.render('home'))
pageRouter.get('/course', (req, res) => res.render('course-selling-page'))
pageRouter.get('/course/:name',(req,res)=>res.render('course'));
pageRouter.get('/Membership-application', (req, res) => res.render('MembershipFrom'))
pageRouter.get('/about-us/goju-shin-ryo', (req, res) => res.render('about-us-gsr'))
pageRouter.get('/about-us/school-of-tradistional-martial-arts', (req, res) => res.render('about-us-smta'))
pageRouter.get('/dates',(req,res)=>res.render('calender'));
pageRouter.get('/auth/:name',(req,res)=> {
    if (req.params.name === 'register') return res.render('sign-up');
    if (req.params.name === 'sign-up') return res.render('sign-up');
    if (req.params.name === 'login') return res.render('login');
    if (req.params.name === 'sign-in') return res.render('login');
    if (req.params.name === 'otp-varification') return res.render('varification');
    if (req.params.name === 'reset-password') return res.render('reset-password');
    return res.render('login');
});
pageRouter.get('/shop/:name',(req,res)=> {
    return res.render('shop');
})
pageRouter.get('/grand-master-couchil',(req,res)=> {
    return res.render('grand-master-couchil');
})







export {pageRouter}










