/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ 
Insha Allah,  Allah is enough for me
*/

import mongoose, { Schema } from "mongoose";


let bugsSchema =new mongoose.Schema(
    {
        type: {
            type: String,
            trim: true,
        },
        issueFoundDate: {
            type: Date,
        
            default: Date.now, // Defaults to current date and time
        },
        description: {
            type: String,
            trim: true,
        },
        uniqueId: {
            type: Number,
            default: () => Date.now(), // Unique numeric ID based on timestamp
            unique: true, // Ensures uniqueness
        },
        solved :{
            type: Boolean,
            default:false
        }
    }
);


const Bugs =mongoose.model('bugs', bugsSchema);
export default Bugs;