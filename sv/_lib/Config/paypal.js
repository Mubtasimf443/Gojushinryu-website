/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success
 */
import dotenv, { config } from 'dotenv'
import axios from 'axios';
import { BASE_URL, PAYPAL_CLIENT_ID, PAYPAL_LINK, PAYPAL_SECRET } from '../utils/env.js';
import { response } from 'express';
dotenv.config();


async function generatePayPalToken() {
    try {
        let response= await axios({
            url:PAYPAL_LINK +'/v1/oauth2/token'
            ,
            method:"POST",
            data: 'grant_type=client_credentials',
            auth:{
                username:PAYPAL_CLIENT_ID,
                password:PAYPAL_SECRET
            }
        });
     //   console.log(response.data);
        
        return response.data.access_token
    } catch (error) {
       //console.log(error);
        
        throw 'Token Failed To gain'
    }
  
}
export const createOrder = async () => {
    let accessToken = await generatePayPalToken();
    const response = await axios({
        url: PAYPAL_LINK + '/v2/checkout/orders',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        data: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    items: [
                        {
                            name: '| Goju Shin Ryu',
                            description: 'Node.js Complete Course with Express and MongoDB',
                            quantity: 1,
                            unit_amount: {
                                currency_code: 'USD',
                                value: '100.00'
                            }
                        }
                    ],
                    amount: {
                        currency_code: 'USD',
                        value: '100.00',
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: '100.00'
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
                brand_name: 'gojushinryu'
            }
        })
    })
    console.log(response);
    
    return response.data.links.find(link => link.rel === 'approve').href;
}



export async function captureOrder(orderID) {
    const accessToken = await generateAccessToken();
    let response=await axios({
         url:PAYPAL_LINK +'/v2/checkout/orders/'+orderID+'/capture'
    });
    return response.data
}





