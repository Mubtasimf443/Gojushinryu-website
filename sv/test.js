/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { connectDB } from "./_lib/Config/ConnectDb.js";
import { GM } from "./_lib/models/GM.js";
import { Product } from "./_lib/models/Products.js";
import fs from "fs";
await connectDB();

let prods =await Product.find();

for (let i = 0; i < prods.length; i++) {
    prods[i].thumb = decodeURIComponent(prods[i].thumb);
    for (let index = 0; index < prods[i].images.length; index++) {
        console.log('Updated Image ' + prods[i].images[index]);
        prods[i].images[index] = decodeURIComponent(prods[i].images[index]);
    }
    await prods[i].save();
}
