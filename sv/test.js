/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { connectDB } from "./_lib/Config/ConnectDb.js";
import { GM } from "./_lib/models/GM.js";

await connectDB();
console.log(await GM.findOne({ email: 'mub' }).or({ username :'vjettly'}))
