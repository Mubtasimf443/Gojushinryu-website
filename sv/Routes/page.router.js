/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */

import { Router } from "express";

let pageRouter = Router();



pageRouter.get('/', (req, res) => res.render('home'))
pageRouter.get('/home', (req, res) => res.render('home'))
pageRouter.get('/course', (req, res) => res.render('course-selling-page'))
pageRouter.get('/course/:name',(req,res)=>res.render('course'));
pageRouter.get('/Membership-application', (req, res) => res.render('MembershipFrom'))
pageRouter.get('/about-us/goju-shin-ryo', (req, res) => res.render('about-us-gsr'))
pageRouter.get('/about-us/school-of-tradistional-martial-arts', (req, res) => res.render('about-us-smta'))
pageRouter.get('/dates',(req,res)=>res.render('calender'));
pageRouter.get('*', (req, res) => res.render('404'));





export {pageRouter}










