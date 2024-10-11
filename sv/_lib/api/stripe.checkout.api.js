/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { createStripeCheckOut } from "../Config/stripe.js";
import { Orders } from "../models/Order.js";
import { Product } from "../models/Products.js";
import { repleCaracter } from "../utils/replaceCr.js";
import { Alert, log, Success } from "../utils/smallUtils.js";


export async function stripeOrderApi(req,res) {
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
    log('emty test pass')


    if (Number(postcode).toString() === 'NaN') throw 'Post Code is not define'
    if (country !== 'india' && country !== 'canada')  return Alert('We do not support in this country',res)
    if (email.includes('@') ===false|| email.includes('.') ===false )  return Alert('Not A valid Email',res)
    if ((items instanceof Array )===false) return Alert('items are not correct',res)

    

    console.log('//conditionals pass');
   

    first_name =await repleCaracter(first_name);
    last_name =await repleCaracter(last_name);
    phone =await repleCaracter(phone);
    city =await repleCaracter(city);
    district =await repleCaracter(district);
    postcode = Number(postcode);
    email =await repleCaracter(email);
    notes = (notes === ''|| !notes ) ? 'no Notes' :notes;
    notes = await repleCaracter(notes);

    console.log('//repleCaracter ');

     
    let Order={ //mongo database
        date:new Date().getDate()+ '-' + new Date().getMonth()+ '-' +new Date().getFullYear()  ,
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
        payment_method:'stripe',
        stripe_Token :'',
        buyer :{
            id :req.user_info._id,
            email :req.user_info.email,
        }
    };

    console.log(Order);
    


    try {
        
   
    let line_items=[]//stripe  
    let totalshipping=0;
    let totalProductValue=0;

    for (let i = 0; i < items.length; i++) {
        let {id,quantity,size}  = items[i];
        
        size =await repleCaracter(size)
        if (Number(quantity).toString().toLowerCase()==='nan') throw 'quantity is not ok // ' +quantity 
        if (Number(id).toString().toLowerCase() === 'nan') throw 'quantity is not ok // ' +id 
        

        let prod=await Product.findOne({id})
        if (!prod) throw 'prod is not found'
       


        let {
            name ,  
            selling_style,
            size_and_price,
            delivery_charge_in_india,
            delivery_charge_in_canada
        } =prod;
        log({name})

        let value='';        
        let shipping=country==='canada' ? delivery_charge_in_canada : delivery_charge_in_india;
        
        if (selling_style=== 'per_price') {
            value = Number(prod.price);
        }

        if (selling_style ==='per_size') {
            let priceIndex= size_and_price.findIndex(el => el.size===size);
            if (priceIndex === -1)
                {
                    log({priceIndex});
                    throw 'Unkown server error '
                }
            value = Number(size_and_price[priceIndex].price);
        }


        if (selling_style !== 'per_size' && selling_style!== 'per_price') throw new Error("Unkown selling style");
        if (!value || Number(value).toString().toLowerCase() ==='nan') throw 'value is nor correct //'+value



        line_items.push({
            
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: ( name.length > 100 ? name.substring(0,100) + '...' : name )
                    },
                    unit_amount: ((value,quantity,shipping)=> {
                        value =Number(value)
                        value +=(shipping/quantity);
                        value = value*100;
                        return value
                    })(value,quantity,shipping),
                },
                quantity: quantity
        })
        console.log(line_items);
        



        Order.shiping_items.push({//database
            _id : prod._id,
            item_name:name,
            quantity:quantity,
            per_price:value,
            size :size,
            shipping:Number(shipping) ,
            total_price:value+Number(shipping)
        })



        totalshipping += ( country==='canada' ? delivery_charge_in_canada : delivery_charge_in_india)
        totalProductValue+=value;

    }


    if (!line_items.length) throw 'There is no data in line items ...// '+line_items


    Order.total_product_price=totalProductValue;
    Order.shipping_cost=totalshipping;
    Order.total=totalProductValue+totalshipping;



    let order=new Orders(Order);
    // log({order_id:order._id})

    let data = await createStripeCheckOut({
        line_items:line_items,
        success_url :'/api/api_s/stripe-order-success',
        cancel_url :'/api/api_s/stripe-order-cancel',
        amount_shipping:totalshipping
    })



    if (!data) throw 'Paypal url is not correct url //' +data

    log({id :data.id});

    order.stripe_Token=data.id;
    await order.save();
    return res.json({success:true,link:data.url})
    

    } catch (error) {
         console.log(error);
         return Alert('Server error',res)
    }



}


export async function stripeOrderSuccessApi(req,res) {
    log(req.query)
    Success(res)
}


export async function stripeOrderCancellApi(req,res) {
    log(req.query)
    Success(res)
}

