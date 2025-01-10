/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ 
Insha Allah,  Allah is enough for me
*/

import { log, validate } from "string-player";
import catchError, { namedErrorCatching } from "../utils/catchError.js";
import MembershipCoupons from "../models/membershipcoupon.js";
import {request,response} from 'express'

export async function createMembershipCoupon(req = request, res = response) {
    try {
        let { name, code, rate ,expiringDate} = req.body;
        log(req.body);
        if (validate.isEmty(name)) namedErrorCatching('parameter-error', 'name is not define');
        if (validate.isEmty(code)) namedErrorCatching('parameter-error', 'code is not define');
        if (validate.isNaN(Number(rate))) namedErrorCatching('parameter-error', 'rate is not a number');
        if (validate.isNaN(Number(expiringDate))) namedErrorCatching('parameter-error', 'expiringDate is not a number');

        if (name.trim().length === 0) namedErrorCatching('parameter-error', 'name is too short');
        if (code.trim().length === 0) namedErrorCatching('parameter-error', 'code is too short');

        if (name.trim().length > 50) namedErrorCatching('parameter-error', 'name is too large');
        if (code.trim().length > 50) namedErrorCatching('parameter-error', 'code is too large');

        if (rate > 0.75) namedErrorCatching('parameter-error', 'rate is too large');
        if (rate < 0.01) namedErrorCatching('parameter-error', 'rate is too large');

        if (expiringDate < Date.now()) namedErrorCatching('parameter-error', 'expiringDate is not valid');
        if (expiringDate.toString().length >= 32) namedErrorCatching('parameter-error', 'expiringDate is not valid');

        [name, code, expiringDate] = [name.toLowerCase(), code.toUpperCase(), Math.floor(expiringDate)];

        let previousCouponIsTheSameName = await MembershipCoupons.findOne({ name });
        if (previousCouponIsTheSameName !== null) namedErrorCatching('database error', 'can not use the same name another time');

        let previousCouponIsTheSameCode = await MembershipCoupons.findOne({ code });
        if (previousCouponIsTheSameCode !== null) namedErrorCatching('database error', 'can not use the same name another time');

        let coupon = new MembershipCoupons({ name, code, rate, expiringDate });
        coupon=await coupon.save();
        res.status(201).json(coupon);
        return;
    } catch (error) {
        catchError(res, error);
    }
}


export async function getMembershipCouponRates(req = request, res = response) {
    try {
        let code = req.query.code;
        if (!code) namedErrorCatching('parametar error', 'name parameter is not define');
        code = code.toUpperCase();
        let coupon = await MembershipCoupons.findOne({ code });
        if (coupon === null) namedErrorCatching('database error', 'no coupon exist');
        if (coupon.activated===false) namedErrorCatching('error', 'coupon is not valid');
        if (coupon.expiringDate < Date.now()) {
            coupon.activated=false;
            await coupon.save();
            return res.status(400).json({error :{type :"coupon expired "}})
        }
        return res.status(200).json({ rate: coupon.rate });
    } catch (error) {
        catchError(res, error);
    }
}


export async function deleteMembershipCoupon(req = request, res = response) {
    try {
        let id = req.query.id; id = Number(id);
        if (validate.isNaN(id)) namedErrorCatching('parameter error', 'id is not a number');
        if (id.toString().length >= 32) namedErrorCatching('parameter error', 'id is not valid');
        let membershipCoupon = await MembershipCoupons.findOne({ id });
        if (membershipCoupon !== null) {
            await MembershipCoupons.findOneAndDelete({ id });
            return res.sendStatus(202);
        } else return res.sendStatus(204);
    } catch (error) {
        catchError(res, error);
    }
}



export async function updateMembershipCoupon(req = request, res = response) {
    try {
        let { name, code, rate, expiringDate, id } = req.body;
        console.log(req.body);
        
        if (validate.isEmty(name)) namedErrorCatching('parameter-error', 'name is not define');
        if (validate.isEmty(code)) namedErrorCatching('parameter-error', 'code is not define');
        if (validate.isNaN(Number(rate))) namedErrorCatching('parameter-error', 'rate is not a number');
        if (validate.isNaN(Number(expiringDate))) namedErrorCatching('parameter-error', 'expiringDate is not a number');
        if (validate.isNaN(Number(id))) namedErrorCatching('parameter-error', 'id is not a number');

        if (name.trim().length === 0) namedErrorCatching('parameter-error', 'name is too short');
        if (code.trim().length === 0) namedErrorCatching('parameter-error', 'code is too short');

        if (name.trim().length > 50) namedErrorCatching('parameter-error', 'name is too large');
        if (code.trim().length > 50) namedErrorCatching('parameter-error', 'code is too large');

        if (rate > 0.75) namedErrorCatching('parameter-error', 'rate is too large');
        if (rate < 0.01) namedErrorCatching('parameter-error', 'rate is too large');

        if (expiringDate < Date.now()) namedErrorCatching('parameter-error', 'expiringDate is not valid');
        if (expiringDate.toString().length >= 32) namedErrorCatching('parameter-error', 'expiringDate is not valid');
        if (id.toString().length >= 32) namedErrorCatching('parameter-error', 'expiringDate is not valid');

        [name, code, expiringDate, id] = [name.toLowerCase(), code.toUpperCase(), Math.floor(Number(expiringDate)), Math.floor(Number(id))];
        let updatedObject={name, code, expiringDate, id};

        let previousCouponIsTheSameName = await MembershipCoupons.findOne({ name });
        if (previousCouponIsTheSameName !== null) delete updatedObject.name;

        let previousCouponIsTheSameCode = await MembershipCoupons.findOne({ code });
        if (previousCouponIsTheSameCode !== null) delete updatedObject.code;
        
        await MembershipCoupons.findOneAndUpdate({ id }, updatedObject);
        return res.sendStatus(202);

    } catch (error) {
        catchError(res, error);
    }
}



export async function activateMembershipCoupon(req = request, res = response) {
    try {
        let id = req.query.id; id = Number(id);
        if (validate.isNaN(id)) namedErrorCatching('parameter error', 'id is not a number');
        if (id.toString().length >= 32) namedErrorCatching('parameter error', 'id is not valid');
        let membershipCoupon=await MembershipCoupons.findOne({id});
        if (membershipCoupon!== null) {
            membershipCoupon.activated=true;
            await membershipCoupon.save();
            return res.sendStatus(202);
        } else return res.sendStatus(204);
    } catch (error) {
        catchError(res, error);
    }
}



export async function deActivateMembershipCoupon(req = request, res = response) {
    try {
        let id = req.query.id; id = Number(id);
        if (validate.isNaN(id)) namedErrorCatching('parameter error', 'id is not a number');
        if (id.toString().length >= 32) namedErrorCatching('parameter error', 'id is not valid');
        let membershipCoupon=await MembershipCoupons.findOne({id});
        if (membershipCoupon!== null) {
            membershipCoupon.activated=false;
            await membershipCoupon.save();
            return res.sendStatus(202);
        } else return res.sendStatus(204);
    } catch (error) {
        catchError(res, error);
    }
}


export async function getMembershipCoupons(req = request, res = response) {
    try {
        let data =await MembershipCoupons.find({});
        return res.status(200).json(data);
    } catch (error) {
        catchError(res, error);
    }
}