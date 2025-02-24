/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import { request, response } from 'express'
import catchError from '../error.handle.js';
import Orders from '../Order.js';
import { sendOrderCancellationEmailToUser, sendWeeklyCancelledOrdersReportEmailToAdmin } from '../mails/order.js';

export async function deleteSpamOrders(req = request, res = response) {
    try {
        let spamOrders = await Orders.find()
            .where('order_status').equals('Payment Needed')
            .where('id').lt(Date.now() - 7 * 24 * 60 * 60 * 1000);

        if (spamOrders.length === 0) return res.sendStatus(204);

        for (let i = 0; i < spamOrders.length; i++) {
            const spamOrder = spamOrders[i];
            await sendOrderCancellationEmailToUser({ email: spamOrder.buyer.email, userName: spamOrder.reciever.lname, orderId: '#' + spamOrder.id })
        }
       
        await sendWeeklyCancelledOrdersReportEmailToAdmin(spamOrders);
        
        for (let i = 0; i < spamOrders.length; i++) {
            const order = spamOrders[i];
            order.order_status = 'Cancelled';
            order.isCancelled=true;
            order.cancelReason ='Due to not Paying the Price of the order in time Order Was cancelled';
            await order.save();
        }
     
        return res.sendStatus(202);
    } catch (error) {
        catchError(res, error);
    }
}