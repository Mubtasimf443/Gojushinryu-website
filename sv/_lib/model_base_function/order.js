/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import { Orders } from "../models/Order.js";
import { repleCaracter } from "../utils/replaceCr.js";
import { Alert, Success  ,log} from "../utils/smallUtils.js";



export async function findOrders(req,res) {
    try {
        let orders =await Orders.find({//activeted:false
 });
        
        if (orders) return res.json({success:true,data:orders})
    } catch (error) {
       Alert('server error',res)
    }
}



export async function updateOrderStatus(req,res) {
    try {
        console.log(req.body);
        let {id,c_reason,status}=req.body;
        if (!id || c_reason===undefined) throw 'data are emty {id :'+id +', c_reason :' +c_reason +' }'
        if ( status !== 'pending' && status!=='processing' && 
            status !=='completed' && status !== 'cancelled'
            ) throw 'status is not corect // { status : "' + status +  '"}'
        id =await repleCaracter(id);
        let order =await Orders.findById(id);
        order.order_status=status;
        if (c_reason !== '' && status === 'cancelled') {
            c_reason =await repleCaracter(c_reason);
            order.cancelReason=c_reason;
        }
        await order.save()
        return res.sendStatus(200);

    } catch (error) {
        log(error)
        return res.status(400).json({error:'failed to update data'})
    }
}



export async function findUserOrder(req,res) {
    try {
        let {orders} =req.user_info;
        console.log({orders});
        
        if (!orders.length) return res.sendStatus(304)
        let data=[];
        for (let i = 0; i < orders.length; i++) {
            const id = orders[i];
            let order=await Orders.findOne({_id :id})
            data.push(order)
        }
        return res.status(200).json({data})
    } catch (e) {
        log(e)
        res.sendStatus(400)
    }
}