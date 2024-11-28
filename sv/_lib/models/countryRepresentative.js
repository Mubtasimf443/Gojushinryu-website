/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

import mongoose from 'mongoose'

const schema=new mongoose.Schema({
    id:{
        type :Number,
        default :Date.now
    },
    name :String,
    email :String,
    dateOfBirth :String,
    country :String,
    phone :String,
    description:String,
    thumbUrl:String,
    approved_by_admin:Boolean
})

const CountryRepresentatives =mongoose.model('countryRepresentatives',schema);

export default CountryRepresentatives