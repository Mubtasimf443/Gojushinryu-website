/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

import mongoose from 'mongoose';

const schema =new mongoose.Schema({
  id :{
    type : Number,
    required :true,
    default:Date.now
  },
  date:{
    type: String,
    required: true
  },
  buyer :{
    id :{
    type:mongoose.SchemaTypes.ObjectId,
    ref :'User',
    required:true
    },
    email :{
      type :String,
      required:true
    },
  },
  reciever :{
    name :{
      type: String,
      required: true
    },
    phone:{
      type: String,
      required: true
    },
    country  :{
      type: String,
      required: true
    },
    district  :{
      type: String,
      required: true
    },
    city  :{
      type: String,
      required: true
    },
    street:{
      type: String,
      required: true
    } ,
    postcode :{
      type: Number,
      required: true
    }
  },
  reciever_notes :{
    type:String,
    required: true
  },
  total :{
    type: String, 
    required: true
  },
  total_product_price :{
    type: String, 
    required: true
  },
  shipping_cost:{
    type: String,
    required: true
  },
  shiping_items:[{
    _id :{
      type: mongoose.SchemaTypes.ObjectId,
      ref:'products', 
      required: true
    },
    item_name:{
      type: String, 
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    per_price: {
      type: Number,
      required: true
    },
    size :{
      type :String,
      required :true
    },
    shipping:{
      type :Number,
      required :true
    },
    total_price:{
      type: Number,
      required: true
    }
  }],
  payment_method :{
    type: String,
    required: true,
  },
  paypal_order_id :String,
  stripe_Token :String,
  order_status :{
    type: String,
    required: true,
    default:"pending"
  },
  isCancelled:{
    type:Boolean,
    required:true,
    default:false
  },
  cancelReason:{
    type:String
  } ,
  activated :{
    type :Boolean,
    default :false,
    required :true
  },

  trash:Boolean
});

/************************I worked hard to prevent dql injection****************************/
// schema.methods.checkSQLInjection =function() {
//   if (this.name.includes('{')) return false 
//   if (this.delevering_country.includes('{')) return false 
//   if (this.delevering_city.includes('{')) return false 
//   if (this.delevering_district.includes('{')) return false 
//   if (this.delevering_house_address.includes('{')) return false 
//   if (this.reciever_name.includes('{')) return false
//   if (this.reciever_email.includes('{')) return false 
//   if (this.name.includes('{')) return false 
//   if (this.currency.includes('{')) return false
//   if (
//     (function (){
//     let defaultSend = false;
//     for (var i = 0; i < this.shiping_items.length; i++) {
//       if (shiping_items[i].item_name.includes('{')) defaultSend = true
//       if (shiping_items[i].per_price.includes('{')) defaultSend =true
//       if (shiping_items[i].total_price.includes('{') ) defaultSend = true 
//       return defaultSend
//     }
//    })()
//     ) return false
    
//   return true
// }



export const Orders = mongoose.model('orders', schema);
export default Orders 