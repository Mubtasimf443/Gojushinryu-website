/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */
import { log } from 'console';
import { Router } from 'express';
import {createRequire} from 'module'
import { createOrder } from '../_lib/Config/paypal.js';
const require = createRequire(import.meta.url);
let OrderRouter = Router();

OrderRouter.post('/pay',async (req, res) => {    
    try {
        const url =await createOrder();
        res.json({url})

    } catch (error) {
        console.log(error);
        
        res.json({error})
      // log(error) 
    }
});


OrderRouter.get('/success', (req, res) => {
    log(req.query)
    res.send('success');

});

OrderRouter.get('/cancel', (req, res) => {
    log(req.query)
    res.send('Cancelled')
});

export  default OrderRouter;