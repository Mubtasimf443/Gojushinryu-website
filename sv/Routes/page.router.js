/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */

import { Router } from "express";

let pageRouter = Router();



pageRouter.get('/', (req, res) => res.render('home'))
pageRouter.get('/home', (req, res) => res.render('home'))
pageRouter.get('/Membership-application', (req, res) => res.render('MembershipFrom'))
pageRouter.get('/about-us/goju-shin-ryo', (req, res) => res.render('about-us-gsr'))
pageRouter.get('/about-us/school-of-tradistional-martial-arts', (req, res) => res.render('about-us-smta'))
pageRouter.get('*', (req, res) => res.render('404'))





export {pageRouter}










