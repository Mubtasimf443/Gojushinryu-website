/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/


import mongoose from 'mongoose';



const productschema = new mongoose.Schema({
  id: {
    type: Number,
    default: Date.now
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  cetegory: {
    type: String,
  },
  thumb: {
    type: String,
  },
  sizeDetails:String,
  images: [String],
  SizeAndPrice: [{
    size: String,
    price: Number
  }]
});

export const Product = mongoose.model('products', productschema); 