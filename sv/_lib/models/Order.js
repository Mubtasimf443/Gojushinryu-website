/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

import mongoose from 'mongoose';

const
  extraDatas = {
    order_status: {
      type: String,
      default: "Pending"
      // 5 status of the orders
      // Pending
      // In Process
      // In Delivery
      // Completed
      // Payment Needed
      // Cancelled
    },
    isCancelled: {
      type: Boolean,
      default: false
    },
    cancelReason: {
      type: String
    },
    activated: {
      type: Boolean,
      default: false,
    },
    trash: {
      default: false,
      type: Boolean
    },
    reciever_notes: {
      type: String,
    }, 
    isCompleted :{
      default: false,
      type: Boolean
    }
  },
  reciever = {
    name: String,
    phone: String,
    email: String,
    fname: String, 
    lname: String
  },
  buyer = {
    id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    email: String,
    phone: String,
    name :String,
    fname :String,
    lname :String,
  },
  shiping_items = [{
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'products',
    },
    thumb:String,
    name: String,
    quantity: Number,
    price: Number,
    size: String,
    url: String,
    total: Number,
    id :Number
  }],
  reciever_address = {
    country: String,
    district: String,
    city: String,
    road_no: String,
    zipcode: Number,
  },
  amountData = {
    total: {
      type: String,
    },
    total_product_price: {
      type: String,
    },
    shipping_cost: {
      type: String,
    },
    tax:String,
  },
  adminApproved = {
    activationTime: {
      type: Date,
    },
    status: {
      type: Boolean,
      default: false,
    }
  },
  paymentInfo = {
    payment_method: {
      type: String,
      default: 'none'
    },
    paypal_token: String,
    string_token: String,
    payment_done_date: {
      type: Date,
    },
    payment_status: {
      type: Boolean,
      default: false
    }
  };


const schema = new mongoose.Schema({
  id: {
    type: Number,
    default: Date.now
  },
  date: {
    type: String,
    default: (e => new Date())
  },
  buyer: buyer,
  reciever: reciever,
  reciever_address: reciever_address,
  shiping_items: shiping_items,
  amountData: amountData,
  adminApproved: adminApproved,
  paymentInfo: paymentInfo,
  ...extraDatas
});


export const Orders = mongoose.model('orders', schema);
export default Orders 