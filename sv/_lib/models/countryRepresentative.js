/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

import mongoose from 'mongoose'

const schema=new mongoose.Schema({
    name :String,
    email :String,
    dateOfBirth :String,
    country :String,
    phone :String,
    decription:String,
    thumbUrl:String
})

const CountryRepresentatives =mongoose.model('countryRepresentatives',schema);

export default CountryRepresentatives