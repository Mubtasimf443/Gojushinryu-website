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
            required: [true, 'Issue found date is required'],
            default: Date.now, // Defaults to current date and time
        },
        description: {
            type: String,
            required: [true, 'Issue description is required'],
            trim: true,
            minlength: [10, 'Description should be at least 10 characters long'],
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