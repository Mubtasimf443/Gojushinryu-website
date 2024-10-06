/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ InshaAllah 
*/ 

import axios from 'axios'
import { BASE_URL, PAYPAL_LINK, T_PAYPAL_CLIENT_ID, T_PAYPAL_SECRET } from '../env.js';
import { log, Success } from '../smallUtils.js';

export async function createPaypalPayment({items,total ,productToatal,shipping}) {
    try {
        if (items instanceof Array === false) throw new Error("Items is not a array");
        for (let index = 0; index < items.length; index++) {
            const {name ,description ,quantity, unit_amount} =await items[index];
            if (!name ) throw new Error("Name is undefiened");
            if (!description ) throw new Error("Name is undefiened");
            if (!quantity ) throw new Error("Name is undefiened");
            if (typeof quantity !== 'number' || Number(quantity).toString==='NaN' ) throw new Error("quantity is not a number");            
            if (typeof unit_amount !== 'object') throw new Error("Unit amount is not a object"); 
            let {currency_code,value} =await unit_amount;
            if (!currency_code || !value) {
                log({currency_code,value});
                throw new Error("check currency_code,value"); 
            }
            if (currency_code !=='USD') throw new Error("currency_code is not USD"); 
            if (typeof value !=='string') throw new Error("value is not string"); 
        }
        log({
            items,
            total ,
            productToatal,
            shipping
        });
        if (typeof total !== 'string' || Number(total).toString==='NaN' ) { log({total}); throw new Error("total  is not a corect");            }
        if (typeof productToatal !== 'string' || Number(productToatal).toString==='NaN' ) { log({productToatal}); throw new Error("productotal  is not a corect");            }
        if (typeof shipping !== 'number' || Number(shipping).toString==='NaN' ) { log({shipping}); throw new Error("shipping  is not a corect");            }
        // log(productToatal)
         if ( Number(total) !== Number(productToatal)+shipping) throw new Error("Total is not correct");
        /************************fetch request started****************************/
        let access_token =await generatePayPalToken()

        const response = await axios({
            url: PAYPAL_LINK + '/v2/checkout/orders',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token
            },
            data: JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        items,
                        amount: {
                            currency_code: 'USD',
                            value: '23.00',
                            breakdown: {
                                item_total: {
                                    currency_code: 'USD',
                                    value:'23.00' //productToatal
                                }
                            }
                        }
                    }
                ],
                application_context: {
                    return_url: BASE_URL + '/api/order-api/success',
                    cancel_url: BASE_URL + '/api/order-api/cancel',
                    shipping_preference: 'NO_SHIPPING',
                    user_action: 'PAY_NOW',
                    brand_name: 'GojuShinRyu'
                }
            })
        })
        log(response.data.links[1]);
        let link= response.data.links.find(link => link.rel === 'approve').href;
        return {success:true,link}
    } catch (error) {
        log(error);
        console.error('paypal error')
        return {error:'Failed make a payment '}
    }
}
export async function generatePayPalToken() {
    try {
        let response= await axios({
            url:PAYPAL_LINK +'/v1/oauth2/token'
            ,
            method:"POST",
            data: 'grant_type=client_credentials',
            auth:{
                username:T_PAYPAL_CLIENT_ID,
                password:T_PAYPAL_SECRET
            }
        });
     //   console.log(response.data);
        
        return response.data.access_token
    } catch (error) {
    //    console.error(error);
        log('token error')
        throw 'Token Failed To gain'
    }
  
}



