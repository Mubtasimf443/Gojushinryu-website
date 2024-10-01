/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/


import mongoose from 'mongoose';



const schema = mongoose.Schema({
    name : {
      type : String,  
      required :true
    },
    description :{
      type: String,
      required: true
    },
    thumb:{
      type: String,
      required: true
    },
    images :[{image : {
      type: String,
      required: true
    }}],
    date : {
      type: String,
      required: true,
    }, 
    selling_country : {
        type: String,
        required: true,
      },
    selling_style : {
        type: String,
        required: true,
    },
    selling_price_canada : {
        type: Number,
    },
    selling_price_india : {
        type: Number,
    },
    size_and_price :[{
        key :String,
        price_in_canada :Number,
        selling_price_india:Number,
    }],
    delivery_charge_in_india :Number,
    delivery_charge_in_india :Number,
  })

  export const Posts = mongoose.model('products', schema);

  