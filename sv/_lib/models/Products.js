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
    get: function (el) { return decodeURIComponent(el) },

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
      get: function (el) { return decodeURIComponent(el) },
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