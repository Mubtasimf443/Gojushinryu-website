/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import axios from 'axios';
import fetch from 'node-fetch';
import { isnota, MakePriceStringSync, validate } from 'string-player';
import { PAYPAP_CURRENCY } from '../env.js';


export default class PaypalPayment {
    
    constructor(options= {client_id:"", client_secret:"", mode :"" , success_url:"" , cancel_url:"",currency_code:'USD'}) {
        this.client_id=options.client_id;
        this.client_secret=options.client_secret;
        if (!options.mode) options.mode ='sandbox'
        this.api_link= (options.mode === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : "https://api-m.paypal.com");
        if (options.success_url) this.success_url=options.success_url;
        if (options.cancel_url) this.cancel_url =options.cancel_url;
        if (options.currency_code) this.currency_code=options.currency_code;
        if (options.brand_name) this.brand_name=options.brand_name;
    }

    async getAccessToken(){
        let response= await fetch(this.api_link + '/v1/oauth2/token' , {
            headers :{
                "Cache-Control":"no-cache",
                'Authorization' :'Basic '+ Buffer.from(this.client_id +':'+this.client_secret ).toString('base64')
            },
            body :'grant_type=client_credentials',
            method :'POST'
        });
        response= await response.json();
        if (response.access_token) return response.access_token;
        if (response.error) {
            if (response.error_description) {
                throw ({
                    paypalError:{
                        type :response.error,
                        description: 'Client credentials are missing'
                    }
                }) 
            } else {
                throw ({
                    paypalError :{
                        type :response.error,
                        ...response
                    }
                })
            }
        }

    }

    async createPayment(options = { accessToken :"",items: [{ name: 'Sample Item',  unit_amount: { currency_code: 'USD', value: '100.00', }, quantity: '1' }], total: "", productToatal: "", shipping: "", success_url: "", cancel_url: "" ,currency_code :""}) {
        let
            success_url = options.success_url || this.success_url,
            cancel_url = options.cancel_url || this.cancel_url;
        let 
            items = options.items,
            currency_code =  PAYPAP_CURRENCY;
        try {
            for (let i = 0; i < items.length; i++) {
                let { name, quantity, unit_amount } = items.shift();
                if (!name || isnota.string(name)) throw `items[${i}].name is emty or not a string`;
                if (quantity <= 0 || isnota.num(quantity)) throw `items[${i}].quantity is not a number or NaN`;
                if (!unit_amount?.value || isnota.string(unit_amount?.value)) throw `items[${i}].unit_amount.value is emty or not a string`;
                unit_amount.currency_code = unit_amount.currency_code ?? PAYPAP_CURRENCY;
                items.push({ name, quantity, unit_amount })
            }
        } catch (error) { this.paypalError("Items_checking_error", error) }

        let response=await fetch(this.api_link +'/v2/checkout/orders' ,{
            method :'POST',
            headers: {
                "Cache-Control":"no-cache",
                'Content-Type': 'application/json',
                Authorization: `Bearer ${options.accessToken}`
            },
            body:JSON.stringify({
                intent: 'CAPTURE',
                purchase_units: [{
                    items: items,
                    amount: {
                        currency_code: PAYPAP_CURRENCY,
                        value: options.total,
                        breakdown: {
                            item_total: {
                                currency_code:PAYPAP_CURRENCY,
                                value: options.productToatal, // Cost of items
                            },
                            shipping: {
                                currency_code: PAYPAP_CURRENCY,
                                value: options.shipping, // Shipping cost
                            }
                        }
                    }
                }],
                application_context: {
                    return_url:options.success_url || this.success_url,
                    cancel_url: options.cancel_url || this.cancel_url,
                    user_action: 'PAY_NOW',
                    brand_name:this.brand_name ? this.brand_name :undefined,
                }
            })
        });

        response=await response.json();
        if (response.links instanceof Array && response.id && response.status === 'CREATED' ) {
            let link=response.links.find(link => link.rel === 'approve');
            if (validate.isNotA.object(link)===false && link?.href) {
                return ({link :link.href,token :response.id});
            } 
        } else this.paypalError(response)
    }

    async checkOutWithShipping(options ={currency_code,shipping , items: [{ name: '',  unit_amount: { currency_code: '', value: '0', }, quantity: '0' }] }) {
        let accessToken=await this.getAccessToken();
        let
            productTotal = 0,
            shipping = parseInt(options.shipping);

        if (validate.isNaN(shipping)) throw 'shipping is not a number';

        for (let i = 0; i < options.items.length; i++) {
            productTotal += parseInt(options.items[i]?.unit_amount?.value) * parseInt(options.items[i].quantity);
            if (validate.isNaN(productTotal)) throw 'items[i].unit_amount.value is not correct in the index '+i;
        }

        let link = await this.createPayment({
            accessToken :accessToken,
            items :options.items,
            total :( productTotal +shipping ).toFixed(2),
            productToatal :productTotal.toFixed(2),
            shipping :shipping.toFixed(2),
            currency_code :options.currency_code || 'USD',
            success_url :this.success_url,
            cancel_url :this.cancel_url
        });
        
        return link;
    }

    paypalError(type, description) {
        if (description === undefined) throw ({ paypalError: { ...type } });
        else throw ({ paypalError: { type, description } })
    }
}
