/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import path, { resolve } from "path";
import { connectDB } from "./_lib/Config/ConnectDb.js";
import { Product } from "./_lib/models/Products.js";
import fs from 'fs'
import { fileURLToPath } from "url";
import { log } from "console";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
await connectDB();

// const prods = require('./products.json');

// for (let i = 0; i < prods.length; i++) {
//     const element = prods[i];
//     delete prods[i]._id;
//     await Product.create(element);
//     console.log('created');
// }


process.exit()