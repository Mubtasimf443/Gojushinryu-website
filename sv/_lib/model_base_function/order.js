/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import { isNotA, isnota, repleCrAll, tobe, validate } from "string-player";
import { Orders } from "../models/Order.js";
import catchError, { namedErrorCatching } from "../utils/catchError.js";
import replaceCarecter, { repleCaracter } from "../utils/replaceCr.js";
import { Alert, Success, log } from "../utils/smallUtils.js";
import express from "express";
import { Product } from "../models/Products.js";
import { sendAdminOrderNotification, sendOrderConfirmationEmail, sendPaymentRequestEmail, sendShippingNotificationEmail } from "../mail/order.mail.js";
import { BASE_URL, FROM_EMAIL } from "../utils/env.js";



export async function findOrders(req, res) {
    try {
        let orders = await Orders.find({})
            .where('isCancelled').equals(false)
            .where("order_status").ne('Cancelled')
            .sort({id:-1})
            .limit(10)
            .skip(0);
        if (orders) return res.status(200).json({ success: true, data: orders })
    } catch (error) {
        console.error(error);
        Alert('server error', res)
    }
}



export async function updateOrderStatus(req, res) {
    try {
        console.log(req.body);
        let { id, c_reason, status } = req.body;
        if (!id || c_reason === undefined) throw 'data are emty {id :' + id + ', c_reason :' + c_reason + ' }'
        if (status !== 'pending' && status !== 'processing' &&
            status !== 'completed' && status !== 'cancelled'
        ) throw 'status is not corect // { status : "' + status + '"}'
        id = await repleCaracter(id);
        let order = await Orders.findById(id);
        order.order_status = status;
        if (c_reason !== '' && status === 'cancelled') {
            c_reason = await repleCaracter(c_reason);
            order.cancelReason = c_reason;
        }
        await order.save()
        return res.sendStatus(200);

    } catch (error) {
        log(error)
        return res.status(400).json({ error: 'failed to update data' })
    }
}

export async function cancelOrder(req, res) {
    try {
        let id = req.query.id, cancelReason = req.query.cancelReason;
        if (validate.isUndefined(id)) namedErrorCatching('parameter error', 'please give a order id');
        if (validate.isNaN(Number(id))) namedErrorCatching('parameter error', 'invalid order id');
        if (validate.isUndefined(cancelReason) || isnota.string(cancelReason)) namedErrorCatching('parameter error', 'invalid cancelReason');
        if (!tobe.minMax(cancelReason, 10, 1300)) namedErrorCatching('parameter error', 'cancelReason is too big or small');
        let order = await Orders.findOne({ id: Number(id) });
        if (validate.isNull(order)) namedErrorCatching('parameter error', 'no order exist in the id of ' + id);
        order.isCancelled = true;
        order.order_status = "Cancelled";
        order.cancelReason=cancelReason;
        await order.save();
        return res.sendStatus(204);
    } catch (error) {
        catchError(res, error);
    }
}


export async function OrderInPaymentNeeded(req, res) {
    try {
        let { shipping, tax, id } = req.query;

        if (validate.isUndefined(shipping)) namedErrorCatching('parameter error', 'please give a shipping');
        if (validate.isUndefined(tax)) namedErrorCatching('parameter error', 'please give a tax');
        if (validate.isUndefined(id)) namedErrorCatching('parameter error', 'please give a order id');

        if (validate.isNaN(Number(shipping))) namedErrorCatching('parameter error', 'invalid shipping');
        if (validate.isNaN(Number(tax))) namedErrorCatching('parameter error', 'invalid tax');
        if (validate.isNaN(Number(id))) namedErrorCatching('parameter error', 'invalid order id');

        if (shipping < 0 || tax < 0) namedErrorCatching('parameter error', 'tax or shipping is less than 0');

        let order = await Orders.findOne({ id: Number(id) });
        if (validate.isNull(order)) namedErrorCatching('parameter error', 'no order exist in the id of ' + id);
        
        order.order_status = 'Payment Needed';
        order.amountData.shipping_cost = shipping;
        order.amountData.tax = tax;
        order.amountData.total = (Number(order.amountData.total_product_price) + Number(order.amountData.tax) + Number(order.amountData.shipping_cost));
        order.adminApproved.status=true;
        order.adminApproved.activationTime=new Date();
        order.activated=true;

        if (validate.isNaN(Number(order.amountData.total))) throw namedErrorCatching('internal error', `order.amountData.total is a NaN`);

        order.amountData.shipping_cost
        await sendPaymentRequestEmail({
            buyerEmail : order.reciever.email,
            amountData :order.amountData,
            orderDetails :order.shiping_items.map(el => ({name :el.name , price : el.price})),
            orderId :order.id,
            paypalLink :BASE_URL +'/api/l-api/order/payment/paypal/'+order.id,
            stripeLink :BASE_URL +'/api/l-api/order/payment/stripe/'+order.id
        });

        await order.save();

        return res.sendStatus(200);
    } catch (error) {
        catchError(res, error);
    }
}


export async function orderInProcess(req, res) {
    try {
        let id = req.query.id;
        if (validate.isUndefined(id)) namedErrorCatching('parameter error', 'please give a order id');
        if (validate.isNaN(Number(id))) namedErrorCatching('parameter error', 'invalid order id');
        let order = await Orders.findOne({ id: Number(id) });
        if (validate.isNull(order)) namedErrorCatching('parameter error', 'no order exist in the id of ' + id);
        order.order_status = "In Process";
        await order.save();
        return res.sendStatus(200);
    } catch (error) {
        catchError(res, error);
    }
}


export async function orderInDelivery(req, res) {
    try {
        let id = req.query.id;
        if (validate.isUndefined(id)) namedErrorCatching('parameter error', 'please give a order id');
        if (validate.isNaN(Number(id))) namedErrorCatching('parameter error', 'invalid order id');
        let order = await Orders.findOne({ id: Number(id) });
        if (validate.isNull(order)) namedErrorCatching('parameter error', 'no order exist in the id of ' + id);
        sendShippingNotificationEmail({
            buyerEmail : order.reciever.email,
            orderId :order.id
        });
        order.order_status = "In Delivery";
        await order.save();
        return res.sendStatus(200);
    } catch (error) {
        catchError(res, error);
    }
}



export async function orderIsCompleted(req, res) {
    try {
        let id = req.query.id;
        if (validate.isUndefined(id)) namedErrorCatching('parameter error', 'please give a order id');
        if (validate.isNaN(Number(id))) namedErrorCatching('parameter error', 'invalid order id');
        let order = await Orders.findOne({ id: Number(id) });
        if (validate.isNull(order)) namedErrorCatching('parameter error', 'no order exist in the id of ' + id);
        order.order_status = "Completed";
        order.isCompleted=true;
        await order.save();
        return res.sendStatus(200);
    } catch (error) {
        catchError(res, error);
    }
}




export async function findUserOrder(req, res) {
    try {
        let data = await Orders.find().where('buyer.id').equals(req.user_info._id);
        if (data.length===0 ) return res.sendStatus(204);
        data=data.map(
            function(el) {
                let quantity=0;
                for (let i = 0; i < el.shiping_items.length; i++) quantity += el.shiping_items[i].quantity;
                return ({ 
                    quantity, 
                    thumb: el.shiping_items[0].thumb, 
                    total: el.adminApproved.status ? el.amountData.total : el.amountData.total_product_price, 
                    status: el.order_status 
                });
            }
        )
        return res.status(200).json({ data })
    } catch (e) {
       catchError(res,e);
    }
}


export async function createOrder(req, res) {
    try {
        class CreateOrder {
            constructor(req = express.request) {
                this.req = req;
                this.total_product_price = 0;
                this.buyer_email='';
                this.reciver_email = '';
            }
            getLocation() {
                let location = this.req.body.location;
                if (validate.isUndefined(location) || isnota.object(location)) namedErrorCatching('parameter error', 'location is not a object');
                let { city, country, district, road_no, zipcode } = location;
                if (validate.isEmty(city) || isnota.string(city)) namedErrorCatching('parameter error', 'city is emty');
                if (validate.isEmty(country) || isnota.string(country)) namedErrorCatching('parameter error', 'country is emty');
                if (validate.isEmty(district) || isnota.string(district)) namedErrorCatching('parameter error', 'district is emty');
                if (validate.isEmty(road_no) || isnota.string(road_no)) namedErrorCatching('parameter error', 'road_no is emty');
                if (validate.isNaN(Number(zipcode))) namedErrorCatching('parameter error', 'road_no is emty');
                [city, country, district, road_no] = repleCrAll([city, country, district, road_no]);
                return ({ city, country, district, road_no, zipcode: Number(zipcode) });
            }
            getReciverData() {
                let reciver = this.req.body.reciver;
                if (validate.isUndefined(reciver) || isnota.object(reciver)) namedErrorCatching('parameter error', 'reciver is not a object');
                let { fname, lname, email, phone } = reciver;
                if (validate.isEmty(fname) || isnota.string(fname)) namedErrorCatching('parameter error', 'fname is emty');
                if (validate.isEmty(lname) || isnota.string(lname)) namedErrorCatching('parameter error', 'lname is emty');
                if (validate.isEmty(phone) || isnota.string(phone)) namedErrorCatching('parameter error', 'phone is emty');
                if (validate.isEmail(email) === false) namedErrorCatching('parameter error', 'email is not an email');
                [fname, lname, email, phone] = repleCrAll([fname, lname, email, phone])
                return ({ fname, lname, email, phone, name: fname + ' ' + lname });
            }
            getNotes() {
                if (validate.isEmty(this.req.body.notes) || isnota.string(this.req.body.notes)) namedErrorCatching('parameter error', 'fname is emty');
                let [notes] = repleCrAll([this.req.body.notes]);
                return notes;
            }
            async getItems() {
                if (isnota.array(this.req.body.items)) namedErrorCatching('parameter error', 'items is not a array');
                let items = this.req.body.items, ItemAsProd = [];
                let total_product_price = 0;
                for (let i = 0; i < items.length; i++) {
                    if (isnota.object(items[i].sizeAndPrice) || validate.isArray(items[i].sizeAndPrice)) namedErrorCatching('parameter error', ` items[${i}].sizeAndPrice is not a object`);
                    if (validate.isEmty(items[i].sizeAndPrice.size) || isnota.string(items[i].sizeAndPrice.size)) namedErrorCatching('parameter error', ` items[${i}].sizeAndPrice.size is not a string`);
                    if (validate.isNaN(Number(items[i].sizeAndPrice.price))) namedErrorCatching('parameter error', ` items[${i}].sizeAndPrice.price is not a Number`);
                    if (validate.isNaN(Number(items[i].id))) namedErrorCatching('parameter error', ` items[${i}].id is not a Number`);
                    if (validate.isNaN(Number(items[i].quantity))) namedErrorCatching('parameter error', ` items[${i}].quantity is not a Number`);
                    let prod = await Product.findOne({ id: items[i].id });
                    if (validate.isNull(prod)) namedErrorCatching('database error', `there are no product in the id of ${items[i].id}`);
                    if (validate.isUndefined(prod.SizeAndPrice.find(
                        function (el) { if (el.size === items[i].sizeAndPrice.size && el.price == items[i].sizeAndPrice.price) return el; }
                    ))) namedErrorCatching('parameter error', 'not a valid size and price');
                    
                    let item = ({
                        id: prod.id,
                        name: prod.name,
                        price: Number(items[i].sizeAndPrice.price),
                        quantity: items[i].quantity,
                        size: items[i].sizeAndPrice.size,
                        total: (Number(items[i].sizeAndPrice.price) * (Number(items[i].quantity))),
                        thumb: prod.thumb,
                        url :`/shop/equipments/${prod.id}`,
                        id :prod.id,
                    });

                    total_product_price += item.total;
                    ItemAsProd.push(item);
                }

                if (validate.isNaN(total_product_price)) namedErrorCatching('server error', 'total_product_price');
                this.total_product_price = total_product_price;
                return ItemAsProd;
            }
            getBuyer() {
                let
                    id = this.req.user_info._id,
                    email = this.req.user_info.email,
                    phone = this.req.user_info.phone;
                this.buyer_email=this.req.user_info.email;
                return ({ id, email, phone });
            }
            getProductTotal() {
                return (this.total_product_price);
            }
        }

        let _o = new CreateOrder(req);
        let
            reciever = _o.getReciverData(),
            buyer = _o.getBuyer(),
            reciever_address = _o.getLocation(),
            shiping_items = await _o.getItems(),
            total_product_price = _o.getProductTotal(),
            reciever_notes = _o.getNotes();


        let order = new Orders({
            reciever: reciever,
            buyer: buyer,
            shiping_items: shiping_items,
            amountData: { total_product_price: total_product_price },
            reciever_address: reciever_address,
            reciever_notes: reciever_notes
        });


        order =await order.save();
        res.sendStatus(201);
        sendOrderConfirmationEmail(order.reciever.email, order.shiping_items.map(el => el.name), order.id , order.amountData.total_product_price ).catch(e => console.error(e));
        sendAdminOrderNotification({ customerName: reciever.name, customerEmail: order.reciever.email, orderId: order.id, totalAmount: order.amountData.total_product_price, orderDetails: order.shiping_items.map(el => ({ name: el.name, price: el.price })) });
       
        return;
    } catch (error) {
        catchError(res, error)
    }
}

