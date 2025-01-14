/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { request, response } from "express";
import catchError, { namedErrorCatching } from "../utils/catchError.js";
import { CourseEnrollments } from "../models/courseEnrollment.js";
import { validate } from "string-player";
import { mailer } from "../utils/mailer.js";
import { FROM_EMAIL,ADMIN_EMAIL,ADMIN_PHONE,ORGANIZATION_NAME, BASE_URL } from "../utils/env.js";


export async function courseEnrollmentPaymentRequestApi(req=request , res = response) {
    try {
        let id=req.query.id;
        id=Number(id);
        if (id.toString().toLowerCase()=== 'nan') namedErrorCatching('parameter error', 'id is not a number');
        let enrollment = await CourseEnrollments.findOne({ id });
        if (validate.isNull(enrollment)) throw ('there is no such enrollment in  this id :' + id);

        let id2 = (new Date().getMonth() < 9 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + "-" + new Date().getFullYear();
        let existIndex = enrollment.paymentsData.findIndex(function name(element) {
            if (element.id === id2) return element;
        });

        if (existIndex === -1) {
            return res.status(400).json({message :'Before 1 of month , requesting is not allowed'});
        }
        if (enrollment.paymentsData[existIndex].paid === true){ 
            return res.status(400).json({ message: "Student Has Paid the fees" });
        }
        if ((Date.now() - enrollment.paymentsData[existIndex].lastPaymentRequestSendDate) < (24 * 60 * 60 * 1000)) {
            return res.status(400).json({ message: "You can not request for fees 2 times in a Day" });
        }

        enrollment.paymentThisMonth = { isPaid: false };

        enrollment.paymentsData[existIndex].lastPaymentRequestSendDate =Date.now();
        await enrollment.save();

        let student ={ email: enrollment.student_email, name: enrollment.student_name };
        let current=new Date();
        let dueDate=new Date(current.getFullYear(), current.getMonth() , 10).toDateString();
        let paymentLink = BASE_URL + '/api/api_s/course/enrollments/payment/this-month?id=' + enrollment.id;
        

        await sendPaymentRequest(student, paymentLink , dueDate);

        return  res.sendStatus(202);
    } catch (error) {
        catchError(res,error)
    }
}



async function sendPaymentRequest(student = { email: undefined, name: undefined }, paymentLink , dueDate) {
    try {
        const info = await mailer.sendMail({
            from: FROM_EMAIL, // Sender info
            to: student.email, // Student's email address
            subject: `Monthly Fee Payment Request - Due by ${dueDate}`, // Subject line
            text: `Your monthly fee payment is due.`, // Plain text body
            html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <h2 style="color: #4CAF50;">Monthly Fee Payment Request</h2>
                        <p>Dear ${student.name},</p>
                        <p>We hope this message finds you well and you’re enjoying your journey in martial arts training at <strong>${ORGANIZATION_NAME}</strong>.</p>
                        <p>This is a gentle reminder that your monthly training fee is due by <strong>${dueDate}</strong>. Please use the link below to complete your payment:</p>
                        
                        <div style="margin: 20px 0; text-align: center;">
                            <a href="${paymentLink}" style="background-color: #4CAF50; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                                Pay Now
                            </a>
                        </div>
    
                        <p>We value your commitment to your training and look forward to seeing your continued progress.</p>
                        
                        <p>If you have any questions or face any difficulties making the payment, feel free to contact us:</p>
                        <ul style="list-style: none; padding: 0;">
                            <li>📧 Email: <a href="mailto:${ADMIN_EMAIL}" style="color: #4CAF50;">${ADMIN_EMAIL}</a></li>
                            <li>📞 Phone:${ADMIN_PHONE}</li>
                        </ul>
    
                        <p>Thank you for being a part of our martial arts family!</p>
                        
                        <p>Best regards,<br>The <strong>${ORGANIZATION_NAME}</strong> Team</p>
                    </div>
                `, // HTML body
        });
        // console.log('Monthly fee request email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending monthly fee request email:');
        console.error(error);
    }
}