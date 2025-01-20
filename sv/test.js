/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { log } from "string-player";
import { connectDB } from "./_lib/Config/ConnectDb.js";
import { User } from "./_lib/models/user.js";


await connectDB();
let users=await User.find()

for (let i = 0; i < users.length; i++) {
    users[i].social_media_details= {
        facebook: { hasDetails: false },
        linkedin: { hasDetails: false },
        twitter: { hasDetails: false },
        instagram: { hasDetails: false }
    }
    await  users[i].save();
    console.log('user updated');
    
    
}
setTimeout(() => {
    throw 'error'
}, 10000);
