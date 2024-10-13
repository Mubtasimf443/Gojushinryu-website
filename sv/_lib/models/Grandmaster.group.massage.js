/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import mongoose from "mongoose"

let massageSchema =new mongoose.Schema({
    massages:[{
        massage:String,
        massager_name :{
            type:String
        },
        massage_time :{
            type:Number,
            default :Date.now
        },
    }],
    id :{
        type :Number,
        default :Date.now()
    }
})

export let Grand_Master_Group_Massages=mongoose.model('Grand_Master_Group_Massages',massageSchema);

