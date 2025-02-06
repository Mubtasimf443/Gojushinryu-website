/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import Mail from "nodemailer/lib/mailer/index.js";
import { CourseEnrollments } from "../courseEnrollment.js";
import Mails from "../mails/course.mails.js";
import Settings from "../settings.js";


/* Course Enrollment jobs */
export async function requestCourseEnrollMentPayment(req=express.request,res=express.response) {
    try {
        let studentData = [];
        res.sendStatus(202);
        let ernollments=await CourseEnrollments.find().where('activated').equals('true');
        let settings=await Settings.findOne({});
        if (ernollments.length===0) return;
        for (let i = 0; i < ernollments.length; i++) {
            let element = ernollments[i];
            let id = (new Date().getMonth() < 9 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + "-" + new Date().getFullYear()
            let existIndex= element.paymentsData.findIndex(function (element) {
                if (element.id ===id) return element;
            });
            if (existIndex === -1) {
                // If it does not exist , It means it is the first day of the Month
                element.paymentsData.push({
                    id:id ,
                    month : new Date().toLocaleString('default', { month: 'long' }) ,
                    Year : new Date().getFullYear(),
                    date : new Date().getDate(),
                    paid: false,
                    payment_date :null,
                    paidAmount : null,
                    lastPaymentRequestSendDate :Date.now()
                });
                element.paymentThisMonth = { isPaid: false }
                element = await element.save();
                let student ={ email: element.student_email, name: element.student_name };
                let current=new Date();
                let dueDate=new Date(current.getFullYear(), current.getMonth() , 25).toDateString();
                let paymentLink = WEBSITE_ORIGIN + '/api/api_s/course/enrollments/payment/this-month?id=' + element.id;
                await Mails.payment_request(student, paymentLink, dueDate);
                studentData.push({
                    id : element.id,
                    name: element.student_name,
                    email: element.student_email,
                    courseName :element.course_name,
                    totalFees: element.course_price + (element.course_price * (settings.gst_rate / 100)),
                });
            }
            if (existIndex !== -1) {
                if (element.paymentsData[existIndex].paid === false && (Date.now() - element.paymentsData[existIndex].lastPaymentRequestSendDate) > (3 * 24 * 60 * 60 * 1000)) {
                    let student ={ email: element.student_email, name: element.student_name };
                    let current=new Date();
                    let dueDate=new Date(current.getFullYear(), current.getMonth() , 10).toDateString();
                    let paymentLink = WEBSITE_ORIGIN + '/api/api_s/course/enrollments/payment/this-month?id=' + element.id;
                    await Mails.payment_request(student, paymentLink, dueDate);
                    element.paymentsData[existIndex].lastPaymentRequestSendDate = Date.now();
                    element.paymentThisMonth ={ isPaid :false}
                    await element.save();
                    console.log('this month payment request is done at ' + new Date(Date.now()).toLocaleString());
                    studentData.push({
                        id: element.id,
                        name: element.student_name,
                        email: element.student_email,
                        courseName: element.course_name,
                        totalFees: element.course_price + (element.course_price * (settings.gst_rate / 100)),
                    });
                } else {
                    console.log('this month payment request is done at '+ new Date(element.paymentsData[existIndex].lastPaymentRequestSendDate).toLocaleString() );
                }
            }
        }
        (studentData.length !== 0) && (await Mails.monthly_summary_to_admin(studentData));
    } catch (error) {
        console.error(error);
    }
}

export async function notifyAboutNotPaidStudents(req=express.request,res=express.response) {
    try {
        res.sendStatus(202);
        let studentData = [];
        let settings=await Settings.findOne({});
        let ernollments=await CourseEnrollments.find().where('activated').equals('true');
        for (let i = 0; i < ernollments.length; i++) {
            let element = ernollments[i];
            let id = (new Date().getMonth() < 9 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + "-" + new Date().getFullYear()
            let existIndex= element.paymentsData.findIndex(function (element) {
                if (element.id ===id) return element;
            });
            if (existIndex !== -1) {
                if(element.paymentsData[existIndex].paid === false) {
                    studentData.push({
                        id :element.id,
                        name :element.student_name,
                        email :element.student_email,
                        courseName :element.course_name,
                        totalFees : element.course_price + (element.course_price * (settings.gst_rate / 100))
                    })
                } 
            }
        }
       
        (studentData.length !== 0) && await Mails.unfaid_fees_notification_to_admin(studentData);
    } catch (error) {
        console.error(error);
    }
}