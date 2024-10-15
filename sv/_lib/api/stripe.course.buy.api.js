/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { log } from "../utils/smallUtils.js";
import { repleCaracter } from "../utils/replaceCr.js";
import Course from "../models/Course.js";
import { CourseEnrollments } from "../models/courseEnrollment.js";
import { User } from "../models/user.js";
import { createStripeCheckOut } from "../Config/stripe.js";



export async function stripeCourseBuyAPiJs(req,res) {
    
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
        let testArray=[date_of_birth,postcode,district,country,city,course_id];
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
        await user.save();


        
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
        let stripe_line_items=[{
            price_data: {
                currency: 'usd',
                product_data: {
                    name: course.title.length >100 ? course.title.substring(0,100) +'...' :course.title
                },
                    unit_amount: Number(course.price)*100
            },
            quantity: 1
        }];



        
        let data = await createStripeCheckOut({
            line_items:stripe_line_items,
            success_url :'/api/api_s/stripe-course-purchase-success',
            cancel_url :'/api/api_s/stripe-course-purchase-cancel',
            amount_shipping : 0
        });




        if (!data) return res.json({error :'failed to make stripe checkout'})
        
        
        

        courseEnrollMent.payment_method ='stripe';
        courseEnrollMent.stripe_session_id = paypal_id;
        await courseEnrollMent.save()
        return res.status(200).json({
            success:true,
            link :data.url
        });



    } catch (error) {
       console.log({error :'server error ' +error});
       return res.json({error})
    }   
}





export async function courseBuySuccessStripeApi(req,res) {
    try {
        let {session_id}=req.query
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
        status =status(session_id);
        if (!status) return res.redirect('notAllowed');


        
        let enrollment = await CourseEnrollments.findOne({stripe_session_id :session_id}) ;
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
        await enrollment.save();
        return res.redirect('/accounts/student');


    } catch (error) {
        log({error});
        return res.json({
            error :'server error'
        })
    }
}



export async function courseBuyCancellStripeApi(req,res) {
    try {
        let {session_id}=req.query
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
        status =status(session_id);
        if (!status) return res.redirect('notAllowed');
        CourseEnrollments.findOneAndDelete({stripe_session_id :session_id})
        .then(e => res.redirect('/accounts/student'))
    } catch (error) {
        log({error});
        return res.json({
            error:'server error ' //error
        })
    }
}
