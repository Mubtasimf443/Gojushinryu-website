/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

import mongoose from "mongoose";


const assetSchema = new mongoose.Schema({
    id: {
        type: Number,
        default: Date.now,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        enum: ['image', 'video'], // Restrict type to image, video, or iframe
        required: true,
    },
    url: {
        type: String,
        required: function () {
            return (this.type === 'image');
        }, // URL is required for image and video types
    },
    iframe: {
        type: String,
        
        trim: true,
        
        required: function () {
            return (this.type === 'video');
        }, // iframe is required for iframe type

    },
    title: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true, // Optional description for the asset
        lowercase: true
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation timestamp
    },
});


export const Assets = mongoose.model('Assets', assetSchema);
export default Assets;