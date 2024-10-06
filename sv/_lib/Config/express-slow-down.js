/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success
 */

import {slowDown} from 'express-slow-down'
import { log } from '../utils/smallUtils.js'

let ApidelayAfter =5;
export const ApiRateLimter =slowDown({
    windowMs:5*1000,
    delayAfter: ApidelayAfter,
    delayMs:(used) => {
      log(used);
      return (used -ApidelayAfter) *500;
    }
});

let fileDelayAfter =20;//20 files can not be bigger than 5 mb ,as We have Optimis
export const fileRateLimter =slowDown({
    windowMs:5*1000,
    delayAfter: fileDelayAfter,
    delayMs:(used) => {
      log(used);
      return (used -fileDelayAfter) *500;
    }
});
