/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

import { model, Schema } from 'mongoose';

let allienceSchema = new Schema({
    name: {
        type: String,
        trim: true,
    },
    image : {
        type: String,
        trim: true,
    }, 
    organizationLogo : {
        type: String,
        trim: true,
    },
    OrganizationLink :{
        type: String,
        trim: true
    },
    title : {
        type: String,
        trim: true,
    },
    info : {
        type: String,
        trim: true,
    },
    infoHtml : {
        type: String,
        trim: true,
    },
    createdAt :{
        type: Number,
        default: Date.now 
    }
})

export const AllienceGrandMaster = model('AllienceGrandMaster', allienceSchema);
// export default AllienceGrandMaster;
