/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
Insha Allah,  By his marcy I will Gain Success 
*/

import { createRequire } from 'module';
import { BASE_URL, T_STRIPE_KEY, STRIPE_SECRET_KEY } from '../utils/env.js';
import { log } from '../utils/smallUtils.js';
let require = createRequire(import.meta.url)
const STRIPE = require('stripe')(STRIPE_SECRET_KEY);



export async function createStripeCheckOut({ success_url, cancel_url, line_items, amount_shipping }) {
  try {
    const session = await STRIPE.checkout.sessions.create({
      cancel_url: BASE_URL + cancel_url + '?session_id={CHECKOUT_SESSION_ID}',
      success_url: BASE_URL + success_url + '?session_id={CHECKOUT_SESSION_ID}',
      line_items: line_items,
      // [{price_data: {currency: 'usd', product_data: {name: 'Node.js and Express book'},unit_amount: 50 * 100},quantity: 1}],
      mode: 'payment',
    });

    return session;
  } catch (error) {
    log(error)
    return false
  }

}






export default STRIPE;
