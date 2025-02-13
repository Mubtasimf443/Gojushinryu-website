/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success
 */

import { slowDown } from 'express-slow-down'
import { log } from '../utils/smallUtils.js'
import {rateLimit} from 'express-rate-limit'
import { request } from 'express';

let ApidelayAfter = 30;


export const ApiRateLimter = slowDown({
  windowMs: 5 * 1000,
  delayAfter: ApidelayAfter,
  delayMs: (used) => {
    used > 100 && log(used);
    return (used - ApidelayAfter) * 200;
  }
});

let fileDelayAfter = 20;//20 files can not be bigger than 5 mb ,as We have Optimis
export const fileRateLimter = slowDown({
  windowMs: 5 * 1000,
  delayAfter: 20,
  delayMs: (used) => {
    used > 100 && log(used);
    return (used - fileDelayAfter) * 200;
  }
});


export const fastApiRateLimiter = slowDown({
  windowMs: 30 * 1000,
  delayAfter: 30,
  delayMs: (used) => {
    log(used);
    return (used - fileDelayAfter) * 500;
  }
});


export const largeApiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  legacyHeaders: true,
  message:function (req=request, res) {
    console.log('Attacker Ip is '+ req.ip);
    return 'You can only Request 30 in 1 Minutes';
  } 
});