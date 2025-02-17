/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/
import mongoose from "mongoose";

const syllabusAssetSchema = new mongoose.Schema({
    id:{
        type: Number,
        default: Date.now,
        required: true, 
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    assetType: {
        type: String,
        enum: ['video', 'pdf', 'image', 'text'],
        required: true
    },
    content: {
        type: String,
        required: true, // URL or text for video/image or file path for PDF
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true, 
    },
    createdAtNum: {
        type: Number,
        default: Date.now,
        required: true, 
    },
    backupAssetLink: {
        type: String,
        default :'null'
    }
});

// Create a model based on the schema
export const SyllabusAsset = mongoose.model('SyllabusAsset', syllabusAssetSchema);
export default SyllabusAsset;
