/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { Alert, log, Success } from "../utils/smallUtils.js";
import { repleCaracter } from "../utils/replaceCr.js";
import { Product } from "../models/Products.js";
import { MakePriceString } from "../utils/string.manipolation.js";
import { createPaypalPayment } from "../utils/payment/create.order.paypal.js";
import { Orders } from "../models/Order.js";
import { User } from "../models/user.js";
import { product_purchase_event_happaned_amdin_email, product_purchase_event_happaned_user_email } from "../mail/Course.mail.js";


export  async function OrderApiPaypal(req,res) {
    let { 
        first_name,
        last_name,
        phone,
        email,
        country,
        city,
        district,
        postcode,
        notes,
        items,
        street ,
    } =req.body;
    let testArray =[
        first_name,
        last_name,
        phone,
        country,
        city,
        district,
        postcode,
        notes,
        email ,
        street,
    ];
    let EmtyTest=await testArray.findIndex((el,index )=> { if (!el && index !== 8) return true });
    if (EmtyTest!==-1) return Alert('Please give add the data' ,res);
    if (email.includes('@') ===false|| email.includes('.') ===false )  return Alert('Not A valid Email',res)
    first_name =await repleCaracter(first_name);
    last_name =await repleCaracter(last_name);
    phone =await repleCaracter(phone);
    if (country !== 'india' && country !== 'canada')  return Alert('We do not support in this country',res)
    city =await repleCaracter(city);
    district =await repleCaracter(district);
    postcode = Number(postcode);
    email =await repleCaracter(email);
    if (postcode.toString() === 'NaN') throw 'Post Code is not define'
    notes = (notes === ''|| !notes ) ? 'no Notes' :notes;
    notes = await repleCaracter(notes);
    let Order = {
        id :Date.now(),
        date:new Date().getDate()+ '-' + new Date().getMonth()+ '-' +new Date().getFullYear()  ,
        buyer :{
            id :req.user_info._id,
            email :req.user_info.email
        },
        reciever :{
            name :first_name + last_name,
            phone : country === 'canada' ? '+1' + phone : '+91' + phone,
            email :email,
            country:country,
            district:district,
            city :city,
            postcode:postcode,
            street :street,
        },
        total_product_price :0,
        shipping_cost:0,
        total:0,
        shiping_items:[],
        reciever_notes:notes ?? 'no notes',
        payment_method:'paypal',
        paypal_order_id :'',
    };
   
    let onlyTotalProductPrice =0;
    let onlyTotalShipping=0;
    let totalPrice=0;
   
    try {
    for (let i = 0; i < items.length; i++) {
            let totalProductPrice=0 ;
            let totalshipping=0;
            let value ;
            let __order_per_product_price =0;
            let {id ,quantity,size} = await items[0];
            if (!id|| !quantity  || !size) throw new Error("Product Info Not defined");
            id=Number(id);
            if (typeof size !== 'string') throw new Error("size is not correct");
            size = await repleCaracter(size)
            if ( id.toString().toLowerCase==='nan' || quantity.toString().toLowerCase() ==='nan') throw new Error("Product Id is not valid");
            let ProdFound=false
            let prod =await Product.findOne({id}).then(e => { log('Product Found'); ProdFound= e;return e }).catch(e => {log(e)});        
            if (!ProdFound) throw new Error("Server Problem related to produc");
                
                let { 
                    name,
                    description,
                    selling_style,
                    size_and_price,
                    delivery_charge_in_india,
                    delivery_charge_in_canada
                } =prod;
                totalshipping= country==='canada' ? delivery_charge_in_canada : delivery_charge_in_india;
                if (selling_style=== 'per_price') {
                    value = prod.price;
                   
                }
                if (selling_style ==='per_size') {
                    let priceIndex= size_and_price.findIndex(el => el.size===size);
                    if (priceIndex === -1)
                        {
                            log({priceIndex});
                            throw 'Unkown server error '
                        }
                        value =size_and_price[priceIndex].price;
                }
                if (selling_style !== 'per_size' && selling_style!== 'per_price') throw new Error("Unkown selling style");
                
                value=Number(value)   ;
                __order_per_product_price=value;
                value+=(totalshipping /quantity)
                totalProductPrice = quantity * value;
              
              

                //adding data 

                totalPrice+=totalProductPrice;
                onlyTotalShipping+=totalshipping;
                onlyTotalProductPrice+=totalProductPrice;
                let PaypalValue=await MakePriceString(value)
                items.push({
                    name :( name.length>120 ? name.substring(0,120) : name),
                    quantity,
                    description:(description.length > 120 ? description.substring(0,120) : description)
                    ,
                    unit_amount:
                    {
                        currency_code: 'USD',
                        value :PaypalValue
                    }}); //paypal
                    items.shift();
                    log({
                        value
                    }) ;        
                 /*------------------------order items adding ----------------------- */   
                 
                 Order.shiping_items.push({
                    _id : prod._id,
                    item_name :prod.name,
                    size :size,
                    quantity: quantity,
                    per_price:__order_per_product_price,
                    shipping :Number(totalshipping),
                    total_price:Number(totalshipping) + quantity*__order_per_product_price

                 })
                 
                 Order.shipping_cost=onlyTotalShipping,
                 Order.total=Order.total+totalProductPrice;
                 Order.total_product_price+=quantity*__order_per_product_price;

    }  



    /*--------------------------Creating a Order --------------------------- */
    Order.shipping_cost=await MakePriceString(Order.shipping_cost);
    Order.total=await MakePriceString(Order.total);
    Order.total_product_price =await MakePriceString(Order.total_product_price);

    let {orderCreated,order_id} =await Orders.create(Order)
    .then(e => {
        log('//product created');
        return {orderCreated :true ,order_id:e.id}
    })
    .catch(e => {
        log(e)
        log('//product was not created');
        return {orderCreated :false}
    })
    if (!orderCreated) return Alert('Failed to create a order,server',res)




    let total =/*'23.00'*/await MakePriceString( onlyTotalProductPrice );
    onlyTotalProductPrice = await MakePriceString(onlyTotalProductPrice) ;

    let {error,success,link ,paypal_id} =await createPaypalPayment({
        items,
        productToatal : onlyTotalProductPrice,
        shipping : onlyTotalShipping,
        total,
        success_url:'/api/api_s/paypal-order-success',
        cancell_url :'/api/api_s/paypal-order-cancel'
    })
  
    if (error) {
        log(error)
        return Alert('Failed to make paypal payment',res);
    }
    if (success) {
        let status=await Orders.findOneAndUpdate({id:order_id},{paypal_order_id :paypal_id})
        .then(e => {
            return true
        })
        .catch(e => {
            log(e)
            return false
        });
        if (!status) return Alert('server,error')
        return res.json({link})
    }
    } catch (error) {
        log({error})

    return Alert(error,res)
    }
}


export async function OrderSuccessPaypalApi(req,res) {   
    try {
        let {token}=req.query;
        log({token})
        function status(data=token) {
          if (!token) return false
          if (data.includes('{')) return false 
          if (data.includes('}')) return false 
          if (data.includes('*')) return false 
          if (data.includes(':')) return false 
          if (data.includes('[')) return false 
          if (data.includes(']')) return false 
          if (data.includes('(')) return false 
          if (data.includes('(')) return false 
          if (data.includes('$')) return false 
          if (data.includes('>')) return false 
          if (data.includes('<')) return false 
          return true
        }
        status =status();
        if (!status) return res.render('notAllowed');
        let order=await Orders.findOne({
            paypal_order_id :token
        });
        if (!order) return res.render('notAllowed');
        order.activated =true;
        let user= await User.findById(order.buyer.id);
        user.orders.push({id:order._id});
        user=await user.save();
        await order.save();
        product_purchase_event_happaned_amdin_email().then(()=> {})
        product_purchase_event_happaned_user_email(user.email).then(()=> {})
        res.render('student-corner',{
            bio : user.bio ?  user.bio :'I dream to become black belt in karate and Master Martial Arts',
            name :user.name? user.name :'name',
            age :user.age ? user.age :0,
            gender :user.gender ?user.gender :'male',
            district:user.district ? user.district :'name',
            city:user.city? user.city :'',
            country:user.country? user.country :'',
            postcode:user.postCode? user.postCode :0,
            street:user.street? user.street :'',
            thumb :user.thumb?user.thumb:'/img/avatar.png'
        }) ;
        return
    } catch (error) {
        log({error})
    } 
}

export async function OrderCancellPaypalApi(req,res) {
   let {token}=req.query
   function status(data=token) {
    if (!token) return false
     if (data.includes('{')) return false 
     if (data.includes('}')) return false 
     if (data.includes('*')) return false 
     if (data.includes(':')) return false 
     if (data.includes('[')) return false 
     if (data.includes(']')) return false 
     if (data.includes('(')) return false 
     if (data.includes('(')) return false 
     if (data.includes('$')) return false 
     if (data.includes('>')) return false 
     if (data.includes('<')) return false 
     return true
   }
   status =status();
   if (!status) return res.redirect('notAllowed');
   Orders.findOneAndDelete({
    paypal_order_id :token
   })
   .then(e =>
    {
     log('order cancelled successful')
     res.redirect('/')
    })
   .catch(e => {
    log(e)
    res.redirect('/')
    })


}