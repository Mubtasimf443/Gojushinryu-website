/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import Course from "../models/Course.js";
import { CourseEnrollments } from "../models/courseEnrollment.js";
import { User } from "../models/user.js";
import { createPaypalPayment } from "../utils/payment/create.order.paypal.js";
import { repleCaracter } from "../utils/replaceCr.js";
import { Alert, log } from "../utils/smallUtils.js";
import { MakePriceString } from "../utils/string.manipolation.js";



export async function courseBuyPaypalApi(req,res) {
    let DbOnject;
    try {
        let {
            date_of_birth,
            postcode,
            district,
            country,
            city,
            course_id
        } =req.body;
   
        
        let user_info=req.user_info;//user check midleware
        let testArray=[ date_of_birth,postcode,district,country,city,course_id];
        let emtytestPassResult=testArray.findIndex(el => !el);
        if (emtytestPassResult !== -1) throw new Error("emtytest failed");
        log('// emtytestPassResult === true')

        if (typeof course_id !== 'number')throw 'course id is not a number 1 ' +course_id;
        if (typeof postcode !== 'number')throw 'postcode id is not a number ' +postcode;
        if (Number(postcode).toString() ==='NaN') throw 'postcode is not a number ' +postcode;
        if (Number(course_id).toString() ==='NaN') throw 'course id is not a number 2 ' +course_id;
        log('//number test pass')

        date_of_birth=await repleCaracter(date_of_birth);
        district=await repleCaracter(district);
        city=await repleCaracter(city);
        country=await repleCaracter(country);


        let user =await User.findById(user_info._id);
        user.country =  user.country ? user.country:country;
        user.city=user.city ? user.city:city;
        user.district=user.district ? user.district:district;
        user.postCode = user.postCode ? user.postCode :postcode ;
        user.save();


        let course=await Course.findOne({id : course_id});
        if (!course) throw 'Can not find course'

        let price =await MakePriceString(course.price);

    
        log('//database CourseEnrollments')
        let courseEnrollMent =new CourseEnrollments({
            // name:course.title,
            course_id :course._id ,
            student_id :user_info._id,
            Date : new Date(),
            course_price:course.price,
            student_city :city,
            student_country :country ,
            student_district :district ,
            student_postcode :postcode ,
        });
        courseEnrollMent=await courseEnrollMent.save()



        let paypalItemsObject={};
        let paypalItemsArray =[];
        paypalItemsObject.name =course.title.length >100? course.title.substring(0,100):course.title,
        paypalItemsObject.description =course.description.length >100? course.description.substring(0,100):course.description,
        paypalItemsObject.quantity=1 ;
        paypalItemsObject.unit_amount={ 
            currency_code:'USD',
            value : price
        }

        log('//price '+ price)
        paypalItemsArray.push(paypalItemsObject);

        let {error,success,paypal_id,link } = await createPaypalPayment({
            items:paypalItemsArray,
            total:price ,
            productToatal:price ,
            shipping:0,
            success_url :'/api/api_s/paypal-course-buy-success',
            cancell_url :'/api/api_s/paypal-course-buy-cancell'
        })



        if (error) throw error
        if (success) {
            courseEnrollMent.payment_method ='paypal';
            courseEnrollMent.paypal_token=paypal_id;
            await courseEnrollMent.save()
            return res.status(201).json({success,link})
        }







    } catch (e) {
        log(e)
        res.status(400).json({error :"failed to make paypal payment"})
    }
   

}







export async function courseBuySuccessPaypalApi(req,res) {
    try {
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


    let enrollment = await CourseEnrollments.findOne({paypal_token :token}) ;
    if (!enrollment ) throw 'There is no membership data '
    enrollment.paid=true ;
    enrollment.activated=true;
    let user =await User.findById(enrollment.student_id);
    if (!user) throw 'There is no user data '
    user.enrolled_course.push({
        id:enrollment.course_id,
        paid :true,
        courseEnrollMentID :enrollment._id
    });
    await user.save();
    await enrollment.save()
    return res.redirect('/accounts/student')

    
    } catch (error ) {
        log(error)
        res.redirect('/')
    }
}




export async function courseBuyCancellPaypalApi(req,res) {
  try {
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
    CourseEnrollments.findOneAndDelete({paypal_token :token})
    .then(e => res.redirect('/accounts/student'))

  } catch (error) {
    log (error);
    res.redirect('/')
  }
    
}


