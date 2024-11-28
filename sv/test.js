import { log } from "string-player";
import {connectDB} from './_lib/Config/ConnectDb.js'
import CountryRepresentatives from "./_lib/models/countryRepresentative.js";
/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/
connectDB()
.then(async (params) => {
   let d=await CountryRepresentatives.findOneAndUpdate({}, {id:Date.now()});
   console.log('updated');
   
})