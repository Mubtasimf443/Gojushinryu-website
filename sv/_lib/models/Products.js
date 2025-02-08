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
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  cetegory: {
    type: String,
    trim: true,
    lowercase: true
  },
  thumb: {
    type: String,
    trim: true,
    set : (thumb) => encodeURIComponent(thumb),
    get : (thumb) => decodeURIComponent(thumb)
  },
  sizeDetails: {
    type: String,
    trim: true,
  },
  images: {
    type :Array,
    of :  { 
      type: String, 
      trim: true ,
      set : (thumb) => encodeURIComponent(thumb),
      get : (thumb) => decodeURIComponent(thumb)
    }
  },
  SizeAndPrice: [{
    size: {
      type: String,
      trim: true,
      lowercase: true
    },
    price: {
      type: Number
    }
  }]
});

export const Product = mongoose.model('products', productschema); 