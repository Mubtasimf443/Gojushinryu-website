/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { sendMembershipMails } from "../mail/membership.mail.js";
import { Memberships } from "../models/Membership.js";
import { User as Users} from "../models/user.js";
import { T_PAYPAL_SECRET } from "../utils/env.js";
import { createPaypalPayment } from "../utils/payment/create.order.paypal.js";
import { repleCaracter } from "../utils/replaceCr.js";
import { Alert, log } from "../utils/smallUtils.js";
import { MakePriceString } from "../utils/string.manipolation.js";


export async function MembershipApidataCheckMidleware(req,res,next) {

    log('//purifier started')
    let memberships=[
        {
        name :'Goju shin Ryu Annual Membership',
        description :'Goju shin Ryu Annual Membership',
        quantity :1,
        price :75 ,
        unit_amount:{
            currency_code:'USD',
            value  :'75.00'
        }
        },
        {
        name :'Goju shin Ryu LifeTime Membership',
        description :'Goju shin Ryu LifeTime Membership',
        quantity :1,
        price :150,
        unit_amount:{
            currency_code:'USD',
            value :'150.00'
        }
        },
        {
        name :'School of Traditional Martial Art Annual Membership',
        description :'School of Traditional Martial Art Membership',
        quantity :1,
        price :75,
        unit_amount:{
            currency_code:'USD',
            value  :'75.00'
        }
        },
        {
        name :'School of Traditional Martial Art LifeTime Membership',
        description :'School of Traditional Martial Art LifeTime Membership',
        quantity :1,
        price :150,
        unit_amount:{
            currency_code:'USD',
            value :'150.00'
        }
        },
 
        ]
    let {
        fname ,
        lname ,
        email ,
        phone ,
        date_of_birth ,
        country ,
        city ,
        district ,
        postcode ,
        doju_Name,
        instructor,
        current_grade,
        violance_charge,
        permanent_disabillity,
        membership_expiring_date,
        previous_injury ,
        gender,
        is_previous_member,
        experience_level ,
        has_violance_charge,
        has_permanent_injury,
        membeship_array,
    }=req.body;



    try {
        let testArray=[
            fname ,
            lname ,
            email ,
            phone ,
            date_of_birth ,
            country ,
            city ,
            district ,
            postcode ,
            gender,
            doju_Name,
            instructor,
            current_grade,
            membeship_array.length,
            previous_injury ,
            is_previous_member,
            experience_level ,
            has_violance_charge,
            has_permanent_injury,
        ];
        let notFoundIndex= testArray.findIndex(el => !el)
        if (notFoundIndex !==-1) throw new Error("Please Complete the form");
        let userInfo = {};log('//nothing is emty')
        let paypalTotal=0;
        let paypalItems=[];

        //checkLavel 1
        if (gender!=='Male' && gender !=='Female' ) throw 'Gender is not correct'
        if (has_violance_charge!=='Yes' && has_violance_charge !=='No' ) throw 'Violance charge is not correct'
        if (has_permanent_injury!=='Yes' && has_permanent_injury !=='No' ) throw 'Violance charge is not correct'
        if (is_previous_member!=='Yes' && is_previous_member !=='No' ) throw 'Violance charge is not correct'
        if (experience_level!=='Senior' && experience_level !=='Junior' ) throw 'experience_level is not correct'     
       
        if (typeof postcode !=='number') throw new Error("postcode not correct");
        if (typeof phone !=='number') throw new Error("phone not correct");
        if (Number(phone).toString().toLowerCase()==='nan') throw new Error("phone not correct");
        if (Number(postcode).toString().toLowerCase()==='nan') throw new Error("postcode not correct");
        log('//checkLavel 1')


        //array check
        for (let i = 0; i < membeship_array.length; i++) {
            let {company,membership} = membeship_array[0];
           
            if (!membership || !company) throw 'Server error ,line 77'
            if (typeof company !=='string'|| typeof membership !== 'string') throw 'Server error ,line 78'
            if ( company !=='gojushinryu' &&  company !== 'school_of_traditional_martial_art') throw 'Server error ,line 79'
            if ( membership !=='Annual' &&  membership !== 'LifeTime') throw 'Server error ,line 80'
            company =company ==='gojushinryu'? 'Goju shin Ryu' : 'School of Traditional Martial Art';
            let membership_object =memberships.find(el => (el.name.includes(company) && el.name.includes(membership)) );
            if (typeof membership_object !== 'object' || !membership_object) throw new Error("membership_object problem");
            paypalTotal +=membership_object.price;
            membership_object.price =await MakePriceString(membership_object.price);
            paypalItems.push(membership_object);
            membeship_array.push({
                membership_company: company,
                membership_type:membership ,
                membership_name:membership_object.name
            })
            membership= membeship_array.shift() ;
            log('//array check')
        }

        //info
        //string
        userInfo.fname=await repleCaracter(fname);
        userInfo.lname=await repleCaracter(lname);
        userInfo.email=await repleCaracter(email);
        userInfo.date_of_birth=await repleCaracter(date_of_birth);
        userInfo.country=await repleCaracter(country);
        userInfo.city=await repleCaracter(city);
        userInfo.district=await repleCaracter(district);
        userInfo.doju_Name=await repleCaracter(doju_Name);
        userInfo.instructor=await repleCaracter(instructor);
        userInfo.current_grade=await repleCaracter(current_grade);
        userInfo.previous_injury =await repleCaracter(previous_injury);

        log('//string check')
        //number
        userInfo.postcode =postcode;
        userInfo.phone=phone;


        //conditional
        if (has_permanent_injury==='Yes') userInfo.permanent_disabillity=await repleCaracter(permanent_disabillity)
        if (has_violance_charge ==='Yes') userInfo.violance_charge=await repleCaracter(violance_charge);
        if (is_previous_member ==='Yes') userInfo.membership_expiring_date=await repleCaracter(membership_expiring_date);

        //object
        userInfo={...userInfo,  gender,  is_previous_member,  experience_level , has_violance_charge,  has_permanent_injury,  membeship_array}
        
        
        //request
        
        req.purified_user_info =userInfo;
        req.paypalTotal =await MakePriceString(paypalTotal);
        req.paypalItems=paypalItems;

        log('//moving to next')
        return next();
    } catch (error) {
        log(error);
        Alert(error,res)
    }

}
export async function paypalMembershipFunction(req,res) {
    try {
        let user_info=req.user_info;
        let paypalTotal=req.paypalTotal;
        let paypalItems=req.paypalItems;
        let purified_user_info=req.purified_user_info;
        let {membeship_array} =purified_user_info;
        let membershipDataBaseArray=[];

        for (let i = 0; i < membeship_array.length; i++) {
            let {membership_name,membership_type,membership_company} = membeship_array[i];
            let {
                fname ,
                lname ,
                email ,
                phone ,
                date_of_birth ,
                country ,
                city ,
                district ,
                postcode ,
                doju_Name,
                instructor,
                current_grade,
                previous_injury ,
                gender,
                
                is_previous_member,
                experience_level ,
                has_violance_charge,
                has_permanent_injury,
            } =purified_user_info;
           
           
           
            log('//schema creating')
            let membership= new Memberships({
                user_id:user_info._id,
                fname ,
                lname ,
                email ,
                phone ,
                date_of_birth ,
                country ,
                city ,
                district ,
                postcode ,
                doju_Name,
                instructor,
                current_grade,
                previous_injury ,
                gender,
                is_previous_member,
                experience_level ,
                has_violance_charge,
                has_permanent_injury,
                membership_name,
                membership_type,
                membership_company ,
                membership_exp_date:new Date(Date.now() +  365*24*60*60*60*1000)
            });
            //conditional
            if (has_permanent_injury==='Yes') membership.permanent_disabillity=purified_user_info.permanent_disabillity;
            if (has_violance_charge ==='Yes') membership.violance_charge=purified_user_info.violance_charge;
            if (is_previous_member ==='Yes') membership.previous_membership_expiring_date=purified_user_info.membership_expiring_date;
            
            log('//schema finished')
            let {membershipData,error}=await membership.save()
                .then(e =>{
                    log(e)
                    return  {
                        _id :e._id,
                        id:e.id,
                        membershipData:e
                    }
                })
                .catch(e => {
                    log(e);
                    return {error:e}
                })
            if (error) throw 'Can not create membership'
            if (membershipData)  membershipDataBaseArray.push(membershipData)
            log(paypalItems)
             
        }
        log('//paypal payment creating')
        let paypalObject ={
            items:paypalItems,
            total :paypalTotal,
            productToatal:paypalTotal,
            shipping:0,
            success_url :'/api/api_s/paypal-membership-success',
            cancell_url :'/api/api_s/paypal-membership-cancel'
        }
        log('//paypal payment starting')
        let {error,success,paypal_id ,link}=await createPaypalPayment(paypalObject);
        if (error) throw new Error("Paypal Error");
        if (success) {
           for (let i = 0; i < membershipDataBaseArray.length; i++) {
                let {_id} = membershipDataBaseArray[i];
                let membership= await Memberships.findById(_id)
                membership.paypal_token =paypal_id;
                await membership.save();
            }   
        }
        log('//paypal payment finish')
        return res.json({success,link})
    } catch (e) {
    log(e);
    return Alert(error,res)
    }

}
export async function membershipSuccessPaypalApi(req,res) {   
    let {token}=req.query;
    if (!token) return res.render('notAllowed');
    log({token})
    function status(data) {
      if (!data) return false
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
    status =status(token);
    if (!status) return res.render('notAllowed');

    let memberships =await Memberships.find({
        paypal_token :token
    })
    //membership mail
    sendMembershipMails(memberships[0]);
    for (let i = 0; i < memberships.length; i++) {
       let {_id,id,user_id,membership_type,membership_company,membership_name} = memberships[i];
       await Memberships.findByIdAndUpdate(_id,{activated:true}).then(e => {})
       let user= await Users.findById(user_id);
       if (user ) {
        let length=user.memberShipArray.length;
        if(!length) {
            user.memberShipArray=[{
                membership:membership_type,
                _id:_id,
                id:id,
                name:membership_name,
                Organization :membership_company
            }];
            user.isMember=true;
            await user.save();
         
        }
        if (length) {
            user.memberShipArray.push({
                membership:membership_type,
                _id:_id,
                id:id,
                name:membership_name,
                Organization :membership_company
            });
            user.isMember=true;
            user.city=user.city?user.city:memberships[i].city;
            user.district=user.district?user.district:memberships[i].district;
            user.postCode=user.postCode?user.postCode:memberships[i].postcode;
            await user.save()
        }
        
    }

    }
    res.render('/accounts/student')
}
export async function membershipCancellPaypalApi(req,res) {
   let {token}=req.query
   function status(data) {
    if (!data) return false
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
   status =status(token);
   if (!status) return res.redirect('notAllowed');
   Memberships.findOneAndDelete({
    paypal_token :token
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