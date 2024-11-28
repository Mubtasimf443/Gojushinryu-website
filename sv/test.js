import { log } from "string-player";
import {connectDB} from './_lib/Config/ConnectDb.js'
import CountryRepresentatives from "./_lib/models/countryRepresentative.js";
import { mailer } from "./_lib/utils/mailer.js";
import { ADMIN_EMAIL, FROM_EMAIL } from "./_lib/utils/env.js";
/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/
await connectDB();

// representativeJoiningMail({
//    to:'mubtasimf443@gmail.com',
//    name :'Mubtasim',
//    country :'Saudi Arabia'
// })

