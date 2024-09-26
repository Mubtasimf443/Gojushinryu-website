/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */

import { Router } from "express";

let pageRouter = Router();
pageRouter.get('/home', (req, res) => res.render('home'))
pageRouter.get('/course', (req, res) => res.render('course-selling-page'))
pageRouter.get('/course/:name',(req,res)=>res.render('course'))
pageRouter.get('/Membership-application', (req, res) => res.render('MembershipFrom'))
pageRouter.get('/about-us/goju-shin-ryo', (req, res) => res.render('about-us-gsr'))
pageRouter.get('/about-us/school-of-tradistional-martial-arts', (req, res) => res.render('about-us-smta'))
pageRouter.get('/dates',(req,res)=>res.render('calender'))
pageRouter.get('/events',(req,res)=>res.render('events'))
pageRouter.get('/auth/:name',(req,res)=> {
    if (req.params.name === 'register') return res.render('sign-up');
    if (req.params.name === 'sign-up') return res.render('sign-up');
    if (req.params.name === 'login') return res.render('login');
    if (req.params.name === 'sign-in') return res.render('login');
    if (req.params.name === 'otp-varification') return res.render('varification');
    if (req.params.name === 'reset-password') return res.render('reset-password');
    return res.render('login');
})
pageRouter.get('/contact',(req,res)=>res.render('contact'))
pageRouter.get('/shop',(req,res)=>res.render('shop'))
pageRouter.get('/shop/:name',(req,res)=> {
    if (req.params.name === 'cart') return res.render('cart');
    if (req.params.name === 'fevorites') return res.render('fevorites');
    return res.render('shop');

})
pageRouter.get('/control-panal/admin/name/varun-jettly' ,(req,res)=>res.render('control-panal'));
pageRouter.get('/media/:name',(req,res) => {
    if (req.params.name === 'videos') return res.render('video');
    if (req.params.name === 'video') return res.render('video');
    return res.render('images');

})
pageRouter.get('/grand-master-counchil',(req,res)=> {
    return res.render('grand-master-counchil')
})
pageRouter.get('/organization-charts',(req,res)=>res.render('OurOrganaizationChart'))
pageRouter.get('/allience',(req,res)=> res.render('alli'))
 pageRouter.get('/student-corner',(req,res)=> res.render('student-corner'))





export {pageRouter}










