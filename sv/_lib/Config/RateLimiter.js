/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
Insha Allah,  By his marcy I will Gain Success 
*/


import { rateLimit } from 'express-rate-limit'

export const LargeAPIRateLimiter = rateLimit({
    //this for when a user is requesting to large apis
    // what can break the app totally
	windowMs:10* 1000, 
	limit: 5, 
	standardHeaders: 'draft-7', 
	legacyHeaders: false, 
    message:async (req,res) => {
        res.json({error:'Please Make request Slowly , You are making request Very fast'})
    }
})