/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

import mongoose from 'mongoose';

const schema = mongoose.Schema({
  id :{
    type : Number,
    required :true
  },
  date:{
    type: String,
    required: true
  },
  orderer_id :{
    type:mongoose.SchemaTypes.ObjectId.User,
    required:true
  },
  delevering_country :{
    type: String,
    required: true
  },
  delevering_district: {
    type: String,
    required: true
  },
  delevering_city:{
    type: String,
    required: true
  },
  delevering_house_address:/*street,  Road no*/{
    type: String,
    required: true
  },
  reciever_name :{
    type: String,
    required: true
  },
  reciever_phone:{
    type: number,
    required: true
  },
  reciever_email :{
    type: number,
    required: true
  }
  shipping_cost:{
    type: String,
    required: true
  },
  currency :{
    type: String,
    required: true
  },
  shiping_items:[{
    item_name:{
    type: String, 
    required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    per_price: {
      type: String,
      required: true
    },
    total_price:{
      type: String,
      required: true
    }
  }],
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
  }
});


schema.methods.checkSQLInjection =function() {
  if (this.name.includes('{')) return false 
  if (this.delevering_country.includes('date')) return false 
  if (this.delevering_city.includes('{')) return false 
  if (this.delevering_district.includes('{')) return false 
  if (this.delevering_house_address.includes('{')) return false 
  if (this.reciever_name.includes('{')) return false
  if (this.reciever_email.includes('{')) return false 
  if (this.name.includes('{')) return false 
  if (this.currency.includes('{')) return false
  if (
    (function (){
    let defaultSend = false;
    for (var i = 0; i < this.shiping_items.length; i++) {
      if (shiping_items[i].item_name.includes('{')) defaultSend = true
      if (shiping_items[i].per_price.includes('{')) defaultSend =true
      if (shiping_items[i].total_price.includes('{') ) defaultSend = true 
      return defaultSend
    }
   })()
    ) return false
    
  return true
}

export const Orders = mongoose.model('Orders', schema);