/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ InshaAllah 
*/ 

import axios from 'axios'
import { BASE_URL, PAYPAL_LINK, T_PAYPAL_CLIENT_ID, T_PAYPAL_SECRET } from '../env.js';
import { log, Success } from '../smallUtils.js';

export async function createPaypalPayment({items,total ,productToatal,shipping ,success_url,cancell_url}) {
    log({
        items,
        a: items[0].unit_amount,
        total ,
        productToatal,
        shipping
    }); 
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
        
       
        if (typeof total !== 'string' || Number(total).toString==='NaN' ) { log({total}); throw new Error("total  is not a corect");            }
        if (typeof productToatal !== 'string' || Number(productToatal).toString==='NaN' ) { log({productToatal}); throw new Error("productotal  is not a corect");            }
        if (typeof shipping !== 'number' || Number(shipping).toString==='NaN' ) { log({shipping}); throw new Error("shipping  is not a corect");            }
        // log(productToatal)


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
                            value: total,//'23.00',
                            breakdown: {
                                item_total: {
                                    currency_code: 'USD',
                                    value:productToatal
                                }
                            }
                        }
                    }
                ],
                application_context: {
                    return_url: BASE_URL + success_url,
                    cancel_url: BASE_URL + cancell_url,
                    shipping_preference: 'NO_SHIPPING',
                    user_action: 'PAY_NOW',
                    brand_name: 'GojuShinRyu'
                }
            })
        }) ;
        log(response.data)
        log({pplink:response.data.links[1]});
        let link= response.data.links.find(link => link.rel === 'approve').href;
        return {success:true,link , paypal_id:response.data.id}
    } catch (error) {
        log(error);
        if (error.data) {
            log(error.data)
            log(error.data.links)
        }
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





export async function OrderSuccessPaypalApi(req,res) {   
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
    if (!status) return res.redirect('notAllowed');
    Orders.findOneAndUpdate({
        paypal_order_id :token
    },{
        activated:true
    })
    .then(e =>
    {
         log('order activated successful')
         res.redirect('/accounts/student')
    })
    .catch(e => {
        log(e)
        res.redirect('/')
    })
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