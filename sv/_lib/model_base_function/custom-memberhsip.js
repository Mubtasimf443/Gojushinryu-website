/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

import { log, repleCaracter,MakePriceString } from "string-player"
import { Memberships } from "../models/Membership.js";
import CustomLink from "../models/customLink.js";
import { createPaypalPayment } from "../utils/payment/create.order.paypal.js";
import { createStripeCheckOut } from "../Config/stripe.js";


export async function customMembershipApi(req, res) {
   
    try {
        if (req.body.payment_method !== 'paypal' && req.body.payment_method !== 'stripe' ) return res.sendStatus(400)
        let membership = await CheckPureOrNot(req.body);
        if (membership.hasError === true) return res.status(400).json({ error: membership.error })
        membership=membership.membership;
        let CustomMembershipData =await checkCustomMembershipId(req.body);
        if (CustomMembershipData.hasError) return res.status(400).json({error :CustomMembershipData.error});
        let
        userEmail=req.user_info.email,
        userId=req.user_info._id,
        CustomMembershipId=CustomMembershipData.data.CustomMembershipId,
        membershipPrice =CustomMembershipData.data.price,
        membershipData=CustomMembershipData.data.membership;

        let result=await createMembership({
            membershipData,
            membershipPrice,
            membership ,
            userId,
            userEmail, 
            payment_method : req.body.payment_method
        });

        if (result.hasError) {
            return res.status(400).json({
                error :result.error
            })
        }

        if (result.success && result.link) {
            return res.status(200).json({
                success :true ,
                link :result.link
            })
        }


    } catch (error) {
        console.error(error)
    }
}



async function CheckPureOrNot(body) {
    try {
        if (typeof body !== 'object') throw 'body is not a object'
        let {
            fname,
            lname,
            email,
            phone,
            date_of_birth,
            country,
            city,
            district,
            postcode,
            doju_Name,
            instructor,
            current_grade,
            violance_charge,
            permanent_disabillity,
            membership_expiring_date,
            previous_injury,
            gender,
            is_previous_member,
            experience_level,
            has_violance_charge,
            has_permanent_injury,
        } = body;


        if (typeof fname !== 'string') throw 'fname is not a string'
        if (typeof lname !== 'string') throw 'lname is not a string'
        if (typeof email !== 'string') throw 'email is not a string'
        if (typeof date_of_birth !== 'string') throw 'date_of_birth is not a string'
        if (typeof phone !== 'string') throw 'phone is not a string'
        if (typeof country !== 'string') throw 'country is not a string'
        if (typeof city !== 'string') throw 'city is not a string'
        if (typeof district !== 'string') throw 'district is not a string'
        if (typeof postcode !== 'number') throw 'postcode is not a Number'
        if (typeof doju_Name !== 'string') throw 'doju_Name is not a string'
        if (typeof current_grade !== 'string') throw 'current_grade is not a string'
        if (typeof instructor !== 'string') throw 'instructor is not a string'
        if (typeof experience_level !== 'string') throw 'experience_level is not a string'
        if (typeof is_previous_member !== 'string') throw 'is_previous_member is not a string'
        if (typeof has_violance_charge !== 'string') throw 'has_violance_charge is not a string'
        if (typeof has_violance_charge !== 'string') throw 'has_violance_charge is not a string'
        if (typeof has_permanent_injury !== 'string') throw 'has_permanent_injury is not a string'
        if (typeof previous_injury !== 'string') throw 'previous_injury is not a string'


    

        log("// Yes Or No Check")
        if (has_violance_charge !== 'Yes' && has_violance_charge !== 'No') throw 'Violance charge is not correct'
        if (has_permanent_injury !== 'Yes' && has_permanent_injury !== 'No') throw 'Violance charge is not correct'
        if (is_previous_member !== 'Yes' && is_previous_member !== 'No') throw 'Violance charge is not correct'
        if (experience_level !== 'Senior' && experience_level !== 'Junior') throw 'experience_level is not correct'
        if (gender !== 'Male' && gender !== 'Female') throw 'gender is not a string'


        // Conditional Check 
        if (has_permanent_injury === 'Yes' && typeof permanent_disabillity !== 'string') throw 'permanent_disabillity is not Correct'
        if (has_violance_charge === 'Yes' && typeof violance_charge !== 'string') throw 'violance_charge is not Correct'
        if (is_previous_member === 'Yes' && typeof membership_expiring_date !== 'string') throw 'membership_expiring_date is not Correct'


        //Number check 
        if (Number(phone).toString().toLowerCase() === 'nan') throw 'phone is not correct'
        if (Number(postcode).toString().toLowerCase() === 'nan') throw 'postcode is not correct'


        //Membership object
        let membership = {};
        membership.fname = await repleCaracter(fname);
        membership.lname = await repleCaracter(lname);
        membership.city = await repleCaracter(city);
        membership.district = await repleCaracter(district);
        membership.country = await repleCaracter(country);
        membership.postcode = Number(postcode)
        membership.doju_Name = await repleCaracter(doju_Name);
        membership.instructor = await repleCaracter(instructor);
        membership.phone = Number(phone);
        membership.date_of_birth = await repleCaracter(date_of_birth);
        membership.current_grade = await repleCaracter(current_grade);

        //As Conditional pass we do not neet to do replecharecter
        membership.gender = gender
        membership.has_permanent_injury = has_permanent_injury;
        membership.has_violance_charge = has_violance_charge;
        membership.is_previous_member = is_previous_member;
        membership.experience_level = experience_level;

        // Conditionals
        if (has_permanent_injury === 'Yes') membership.permanent_disabillity = await repleCaracter(permanent_disabillity);
        if (has_violance_charge === 'Yes') membership.violance_charge = await repleCaracter(violance_charge);
        if (is_previous_member === 'Yes') membership.membership_expiring_date = await repleCaracter(membership_expiring_date);

        return {
            hasError: false,
            membership: membership,
        }

    } catch (error) {
        return {
            hasError: true,
            error: {
                errorCode: 1,
                errorName: 'Checking Error',
                errorMassage: error
            }
        }
    }
}

async function checkCustomMembershipId(body) {
    try {

        if (typeof body !== 'object') throw 'body is not a object'
        let { CustomMembershipId } = body;
        if (!CustomMembershipId) throw 'Custom membership id is not define'
        if (Number(CustomMembershipId).toString().toLowerCase() === 'nan') throw 'Custom membership id is a NaN'
        let customlink = await CustomLink.findOne({ unique_id: Number(CustomMembershipId) });
        log({customlink})
        if (!customlink) throw 'CustomMembershipId is not correct , customlink is null'
        if (customlink.custom_link_type !== 'membership') throw 'CustomMembershipId is not correct, custom link type not membership'
        if (!customlink.membership) throw 'CustomMembershipId is not correct,membership not a object'
        

        let {
            membership_name,
            membership_type,
            membership_price
        } = customlink.membership;


        let membershipObject={},returnObject={};

        if (membership_name.toLowerCase().includes('goju')) membershipObject.membership_company='Goju Shin Ryu Internationals'
        if (membership_name.toLowerCase().includes('traditional')) membershipObject.membership_company='School of Traditional Martial Arts Internationals'

        membershipObject.membership_name=membership_name;
        membershipObject.membership_type=membership_type;
        membershipObject.membership_name=membership_name;
        returnObject.price=membership_price;
        returnObject.membership=membershipObject;
        returnObject.CustomMembershipId=Number(CustomMembershipId);

        return {
            hasError:false,
            data :returnObject
        };

    } catch (error) {
        return {
            hasError: true,
            error: {
                errorCode: 2,
                errorName: 'Checking CustomMembershipId error',
                errorMassage: error
            }
        }
    }
}


async function createMembership({
    membershipData,
    membershipPrice,
    membership,
    userEmail,
    userId,
    payment_method
}) {
    try {
        membership = new Memberships(membership);
        membership.membership_company = membershipData.membership_company;
        membership.membership_name = membershipData.membership_name;
        membership.membership_type = membershipData.membership_type;
        membership.user_id=userId;
        if (payment_method ==='stripe') {
            let items = [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: membershipData.membership_name
                    },
                    unit_amount: Number(membershipPrice) * 100
                },
                quantity: 1
            }];


            let data = await createStripeCheckOut({
                line_items: items,
                success_url: '/api/api_s/stripe-membership-success',
                cancel_url: '/api/api_s/stripe-membership-cancel',
                amount_shipping: 0
            });

            
            if (!data) throw 'stripe error , no stripe data found'
            if (!data.id || !data.url) throw 'stripe id not found'
            membership.payment_method='stripe';
            membership.stripe_id=data.id ;
            await membership.save();
            return {
                hasError :false,
                success :true,
                link :data.url
            }
        }
        if (payment_method === 'paypal') {
            let paypalValue=await MakePriceString(membershipPrice);
            // log({paypalValue})
            let items = [{
                name:membershipData.membership_name ,
                description: membershipData.membership_name,
                quantity: 1,
                price: Number(membershipPrice),
                unit_amount: {
                    currency_code: 'USD',
                    value: paypalValue
                }
            }];
            let paypalObject= {
                items,
                total: paypalValue,
                productToatal: paypalValue,
                shipping: 0,
                success_url: '/api/api_s/paypal-membership-success',
                cancell_url: '/api/api_s/paypal-membership-cancel'
            }


            let {error, success, paypal_id, link }=await createPaypalPayment(paypalObject);
            if (error) throw 'paypal payment creating error'
            if (success) {
                membership.payment_method='paypal';
                membership.paypal_token=paypal_id;
                await membership.save();
                return {
                    hasError :false,
                    success :true , 
                    link :link
                }
            }
        }
    } catch (error) {
        return {
            hasError: true,
            error: {
                errorCode: 3,
                errorName: 'creating membership id error',
                errorMassage: error
            }
        }
    }
}
