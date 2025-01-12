/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/



import Stripe from 'stripe';
import { STRIPE_SECRET_KEY ,T_STRIPE_KEY} from '../env.js';
import { namedErrorCatching } from '../catchError.js';
const str = new Stripe(T_STRIPE_KEY);

export default class StripePay {
    constructor(options = { success_url: "", cancel_url: "" }) {
        this.success_url = options.success_url;
        this.cancel_url = options.cancel_url;
    }
    async checkOut({  shipping_amount, line_items }) {
        const session = await str.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            success_url: this.success_url,
            cancel_url: this.cancel_url,
            shipping_address_collection: {},
            shipping_options: [
                {
                    shipping_rate_data: {
                        display_name: 'Standard Shipping',
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: shipping_amount,
                            currency: 'usd',
                        },
                    },
                },
            ],
            line_items: line_items
        })

        if (session.url && session.id) {
            return ({
                url: session.url,
                id: session.id
            })
        } else {
            throw 'sorry , failed to create stripe payment'
        }
    }
}
