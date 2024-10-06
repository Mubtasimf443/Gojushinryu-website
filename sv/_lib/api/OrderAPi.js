/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { Alert, log, Success } from "../utils/smallUtils.js";
import { repleCaracter } from "../utils/replaceCr.js";
import { Product } from "../models/Products.js";
import { MakePriceString } from "../utils/string.manipolation.js";
import { createPaypalPayment } from "../utils/payment/create.order.paypal.js";


export  async function OrderApiPaypal(req,res) {
    let { 
        first_name,
        last_name,
        phone,
        country,
        city,
        district,
        postcode,
        notes,
        items
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
    ];
    let EmtyTest=await testArray.findIndex((el,index )=> { if (!el && index !== 8) return true });
    if (EmtyTest!==-1) return Alert('Please give add the data');
    first_name =await repleCaracter(first_name);
    last_name =await repleCaracter(last_name);
    phone =await repleCaracter(phone);
    country =await repleCaracter(country);
    city =await repleCaracter(city);
    district =await repleCaracter(district);
    postcode =await repleCaracter(postcode);
    notes = (notes === ''|| !notes ) ? 'no Notes' :notes;
    notes = await repleCaracter(notes);
    let totalPrice=0;
    try {
    for (let i = 0; i < items.length; i++) {
            let totalProductPrice=0 ;
            let value ;
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
                    size_and_price
                } =prod;
                if (selling_style=== 'per_price') {
                    value=await MakePriceString(prod.price)
                    totalProductPrice = quantity * value;
                }
                if (selling_style ==='per_size') {
                    let priceIndex= size_and_price.findIndex(el => el.size===size);
                    if (priceIndex === -1) {
                    log({priceIndex});
                    throw 'Unkown server error '
                     }
                value =size_and_price[priceIndex].price;
                value= await MakePriceString(value)
                }
                if (selling_style !== 'per_size' && selling_style!== 'per_price') throw new Error("Unkown selling style");
                totalPrice+=totalProductPrice;
                items.push({name ,quantity,description,
                    unit_amount:{
                        currency_code: 'USD',
                        value
                    }}); //paypal
                    items.shift();
                    log({
                        value
                    })
    }  
    let total =await MakePriceString(totalPrice );
    let {error,success,link} =await createPaypalPayment({items,productToatal:total,shipping:0,total})
    if (error) return Alert('Failed to make paypal payment',res);
    if (success) return res.json({link});
    } catch (error) {
    log({error})
    return Alert(error,res)
    }
}