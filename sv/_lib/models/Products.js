/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/


import mongoose from 'mongoose';



const productschema = mongoose.Schema({
    id :{
      type : Number,
      required:true
    },
    name : {
      type : String,  
      required :true
    },
    description :{
      type: String,
      required: true
    },
    cetegory:{
      type: String,
      required: true
    },
    thumb:{
      type: String,
      required: true
    },
    images :[String],
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
    price : {
        type: String,
    },
    size_and_price :[{
        size :String,
        price :String,//price in usd
    }],
    size:String,
    delivery_charge_in_india :String,
    delivery_charge_in_canada :String,
  })

export const Product = mongoose.model('products', productschema); 