/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/


import { request, response } from "express";
import catchError, { namedErrorCatching } from "../utils/catchError.js";
import { isnota, tobe, validate } from "string-player";
import { createABugDb } from "../model_base_function/Bugs.js";
import { CourseEnrollments } from "../models/courseEnrollment.js";
import { mailer } from "../utils/mailer.js";
import { ADMIN_EMAIL, ADMIN_PHONE, FROM_EMAIL, ORGANIZATION_NAME } from "../utils/env.js";
import { repleCaracter } from "../utils/replaceCr.js";
import { settingsAsString } from "../model_base_function/Settings.js";



export async function coursePurchaseSuccessPaypal(req = request, res = response) {
    try {
        let paypal_token = req.query.token;
        if (!paypal_token || isnota.string(paypal_token)) namedErrorCatching('parameter error', 'token is emty');
        if (!tobe.max(paypal_token, 300)) namedErrorCatching('parameter error', 'token is too large');
        paypal_token = await repleCaracter(paypal_token);
        let courseEnrollment = await CourseEnrollments.findOne({ paypal_token });
        if (courseEnrollment === null) throw ({ error: 'There is no courseEnrollment in the database' });

        if ( courseEnrollment.activated === true &&  courseEnrollment.paid === true) {
            let gst_rate = await settingsAsString('gst_rate');
            if (typeof gst_rate !== 'number') gst_rate = 5;
            gst_rate = gst_rate / 100;
            let total = courseEnrollment.course_price + (courseEnrollment.course_price * gst_rate);
            if ((Date.now() - courseEnrollment.apply_date) > (24 * 60 * 60 * 1000)) {
                courseEnrollment.stripe_session_id && delete courseEnrollment.stripe_session_id;
                courseEnrollment.paypal_token && delete courseEnrollment.paypal_token;
                await courseEnrollment.save();
            }
            return res.send(successPage(`#${courseEnrollment.id}`, courseEnrollment.course_name, total));
        }

        courseEnrollment.activated = true;
        courseEnrollment.paid = true;
        courseEnrollment.paymentsData.push({
            id: (new Date().getMonth() < 9 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + "-" + new Date().getFullYear(),
            month : new Date().toLocaleString('default', { month: 'long' }) ,
            Year : new Date().getFullYear(),
            date : new Date().getDate(),
            paid: true,
            payment_date : Date.now(),
            paidAmount : courseEnrollment.course_price.toFixed(2)
        });
        courseEnrollment.paymentThisMonth={
            isPaid :true,
            paidDate :new Date()
        }
        courseEnrollment = await courseEnrollment.save();

        let gst_rate=await settingsAsString('gst_rate');
        if (typeof gst_rate !== 'number') gst_rate=5;
        gst_rate=gst_rate/100;
        let { student_name, student_email, course_name, course_price, apply_date } = courseEnrollment;
        await sendCoursePurchaseEmailToStudent(student_email, student_name, course_name, Number(course_price), new Date(apply_date), courseEnrollment.id);
        await sendCoursePurchaseEmailToAdmin(student_name, student_email, course_name, Number(course_price), new Date(apply_date));
        return res.send(successPage(`#${courseEnrollment.id}`, course_name, (course_price + (course_price * gst_rate))));
    } catch (error) {
        console.error(error);
        if (validate.isObject(error)) {
            let id = await createABugDb('course payment success error paypal', JSON.stringify(error));
            return res.status(400).render('massage_server', { title: 'Sorry Failed complete paypal order', body: 'Because of a unknown server error , We was failed to complete the order , please show this bug id if you need refund. Id :#' + id });
        }
        else return res.status(400).render('massage_server', {title :'failed to purchase the course' , body :"Because of an unknown reason we are failed to purchase the course "});
    }
}
export async function coursePurchaseCancelPaypal(req = request, res = response) {
    try {
        let paypal_token = req.query.token;
        if (!paypal_token || isnota.string(paypal_token)) namedErrorCatching('parameter error', 'token is emty');
        if (!tobe.max(paypal_token, 300)) namedErrorCatching('parameter error', 'token is too large');
        paypal_token = await repleCaracter(paypal_token);
        let courseEnrollment = await CourseEnrollments.findOne({ paypal_token });
        if (courseEnrollment !== null) await CourseEnrollments.findOneAndDelete({ paypal_token });

        return res.redirect('/home')
    } catch (error) {
        console.error(error);
        if (typeof error === 'object') await createABugDb('course payment cancel error paypal', JSON.stringify(error)).catch(error => console.error(error));
        if (typeof error === 'string') await createABugDb('course payment cancel error paypal', error).catch(error => console.error(error));
        res.redirect('/home');
    }
}
export async function coursePurchaseSuccessStripe(req = request, res = response) {
    try {
        let stripe_session_id = req.query.session_id;
        if (!stripe_session_id || isnota.string(stripe_session_id)) namedErrorCatching('parameter error', 'token is emty');
        if (!tobe.max(stripe_session_id, 300)) namedErrorCatching('parameter error', 'token is too large');
        stripe_session_id = await repleCaracter(stripe_session_id);

        let courseEnrollment = await CourseEnrollments.findOne({ stripe_session_id });
        if (courseEnrollment === null) throw ({ error: 'There is no courseEnrollment in the database' });

        if ( courseEnrollment.activated === true &&  courseEnrollment.paid === true) {
            let gst_rate = await settingsAsString('gst_rate');
            if (typeof gst_rate !== 'number') gst_rate = 5;
            gst_rate = gst_rate / 100;
            let total = courseEnrollment.course_price + (courseEnrollment.course_price * gst_rate);

            if ((Date.now() - courseEnrollment.apply_date) > (24 * 60 * 60 * 1000)) {
                courseEnrollment.stripe_session_id && delete courseEnrollment.stripe_session_id;
                courseEnrollment.paypal_token && delete courseEnrollment.paypal_token;
                await courseEnrollment.save();
            }

            return res.send(successPage(`#${courseEnrollment.id}`, courseEnrollment.course_name, total));
        }

        courseEnrollment.activated = true;
        courseEnrollment.paid = true;
        courseEnrollment.paymentsData.push({
            id: (new Date().getMonth() < 9 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + "-" + new Date().getFullYear(),
            month : new Date().toLocaleString('default', { month: 'long' }) ,
            Year : new Date().getFullYear(),
            date : new Date().getDate(),
            paid: true,
            payment_date : Date.now(),
            paidAmount : courseEnrollment.course_price.toFixed(2)
        });
        courseEnrollment.paymentThisMonth={
            isPaid :true,
            paidDate :new Date()
        }
        courseEnrollment = await courseEnrollment.save();

        let { student_name, student_email, course_name, course_price, apply_date, } = courseEnrollment;
        let gst_rate=await settingsAsString('gst_rate');
        if (typeof gst_rate !== 'number') gst_rate=5;
        gst_rate=gst_rate/100;
        await sendCoursePurchaseEmailToStudent(student_email, student_name, course_name, Number(course_price), new Date(apply_date) ,courseEnrollment.id);
        await sendCoursePurchaseEmailToAdmin(student_name, student_email, course_name, Number(course_price), new Date(apply_date));
        return res.send(successPage(`#${courseEnrollment.id}`, course_name, (course_price + (course_price * gst_rate))));
    } catch (error) {
        console.error(error);
        if (validate.isObject(error)) {
            let id = await createABugDb('course payment success error paypal', JSON.stringify(error));
            return res.status(400).render('massage_server', { title: 'Sorry Failed complete paypal order', body: 'Because of a unknown server error , We was failed to complete the order , please show this bug id if you need refund. Id :#' + id });
        }
        else return res.status(400).render('massage_server', 'failed to purchase a course');
    }
}
export async function coursePurchaseCancelStripe(req = request, res = response) {
    try {
        let stripe_session_id = req.query.session_id;
        if (!stripe_session_id || isnota.string(stripe_session_id)) namedErrorCatching('parameter error', 'token is emty');
        if (!tobe.max(stripe_session_id, 300)) namedErrorCatching('parameter error', 'token is too large');
        stripe_session_id = await repleCaracter(stripe_session_id);
        let courseEnrollment = await CourseEnrollments.findOne({ stripe_session_id });
        if (courseEnrollment !== null) await CourseEnrollments.findOneAndDelete({ stripe_session_id });

        return res.redirect('/home')
    } catch (error) {
        console.error(error);
        if (typeof error === 'object') await createABugDb('course payment cancel error paypal', JSON.stringify(error)).catch(error => console.error(error));
        if (typeof error === 'string') await createABugDb('course payment cancel error paypal', error).catch(error => console.error(error));
        res.redirect('/home');
    }
}


function successPage(enrollment_id, course_name, paid) {
    return (`
        <!DOCTYPE html>
<html lang="en">

<head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <link rel="stylesheet" href="/css/root.css">
     <link rel="icon" href="/img/6060.png" type="image/png">
      <script defer src="/js/tags.js"> </script>
     <title>Purchase Successful</title>
     <style>
          /* Base Reset */
          * {
               margin: 0;
               padding: 0;
               box-sizing: border-box;
          }

          body {
               font-family: 'Arial', sans-serif;
               background: linear-gradient(135deg, #4caf50, #2c3e50);
               color: #fff;
               display: flex;
               justify-content: center;
               align-items: center;
               min-height: 100vh;
               overflow: hidden;
          }

          .success-container {
               text-align: center;
               background: #ffffff;
               color: #2c3e50;
               padding: 40px;
               border-radius: 20px;
               box-shadow: 0px 15px 30px rgba(0, 0, 0, 0.2);
               max-width: 600px;
               width: 90%;
               animation: fadeIn 1.2s ease;
          }

          @keyframes fadeIn {
               from {
                    opacity: 0;
                    transform: translateY(-20px);
               }

               to {
                    opacity: 1;
                    transform: translateY(0);
               }
          }

          .success-icon {
               font-size: 4rem;
               color: #4caf50;
               margin-bottom: 20px;
          }

          h1 {
               font-size: 2.5rem;
               margin-bottom: 10px;
          }

          p {
               font-size: 1.2rem;
               line-height: 1.6;
               margin-bottom: 20px;
          }

          .info-box {
               background: #4caf50;
               color: #fff;
               padding: 15px;
               border-radius: 10px;
               margin-bottom: 20px;
          }

          .cta-buttons {
               display: flex;
               justify-content: center;
               gap: 20px;
          }

          .cta-buttons a {
               text-decoration: none;
               background: #4caf50;
               color: #fff;
               padding: 12px 25px;
               border-radius: 5px;
               font-size: 1rem;
               font-weight: bold;
               transition: background 0.3s ease;
          }

          .cta-buttons a:hover {
               background: #388e3c;
          }

          footer {
               margin-top: 20px;
               font-size: 0.9rem;
               color: #bbb;
          }

          footer a {
               color: #4caf50;
               text-decoration: none;
          }

          footer a:hover {
               text-decoration: underline;
          }
     </style>
</head>

<body>
     <div class="success-container">
          <div class="success-icon">✔️</div>
          <h1>Purchase Successful!</h1>
          <p>Congratulations! Your course purchase has been completed successfully. We're excited to have you on board
               for this learning journey.</p>

          <div class="info-box">
               <p><strong>Order Details:</strong></p>
               <p>Course Name: <span id="course-name">${course_name}</span></p>
               <p>EnrollMent ID: <span id="transaction-id">${enrollment_id}</span></p>
               <p>Amount Paid: <span id="amount-paid">${typeof paid === 'number' ? paid.toFixed(2) : paid}</span></p>
          </div>

          <div class="cta-buttons">
               <a href="/home">Go Back</a>
               <a href="/courses">Browse More Courses</a>
          </div>

          <footer>
               <p>Need help? <a href="/contact">Contact Support</a></p>
          </footer>
     </div>
</body>

</html>
`);
}

async function sendCoursePurchaseEmailToStudent(studentEmail, studentName, courseName, coursePrice, purchaseDate , EnrollMentID) {
    try {
        const info = await mailer.sendMail({
            from: FROM_EMAIL, // Sender info
            to: studentEmail, // Student's email address
            subject: `Congratulations on Enrolling in ${courseName}!`, // Subject line
            text: `Your course purchase was successful.`, // Plain text body
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #4CAF50;">Course Purchase Confirmation</h2>
                    <p>Dear ${studentName},</p>
                    <p>Congratulations! Your enrollment in the <strong>${courseName}</strong> course has been successfully completed.</p>

                    <h3 style="color: #4CAF50;">Purchase Details:</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li><strong>Course Name:</strong> ${courseName}</li>
                        <li><strong>EnrollMent ID:</strong> #${EnrollMentID}</li>
                        <li><strong>Price:</strong> $${coursePrice.toFixed(2)}</li>
                        <li><strong>Purchase Date:</strong> ${purchaseDate.toLocaleDateString()}</li>
                    </ul>

                    <p>You can access your course materials by logging into your account on our website.</p>
                    <p>If you have any questions, feel free to contact us at:</p>
                    <ul style="list-style: none; padding: 0;">
                        <li>📧 Email: <a href="mailto:${ADMIN_EMAIL}" style="color: #4CAF50;">${ADMIN_EMAIL}</a></li>
                        <li>📞 Phone:<a href="tel:${ADMIN_PHONE}" style="color: #4CAF50;">${ADMIN_PHONE}</a></li>
                    </ul>

                    <p>Thank you for choosing <strong>${ORGANIZATION_NAME}</strong>. We’re excited to have you on this journey!</p>

                    <p>Best regards,<br>The <strong>${ORGANIZATION_NAME}</strong> Team</p>
                </div>
                `, // HTML body
        });

        console.log('Course purchase email sent to student:', info.messageId);
    } catch (error) {
        console.error('Error sending course purchase email to student:', error);
    }
};
async function sendCoursePurchaseEmailToAdmin(studentName, studentEmail, courseName, coursePrice, purchaseDate) {
    try {
        const info = await mailer.sendMail({
            from: FROM_EMAIL, // Sender info
            to: ADMIN_EMAIL, // Admin's email address
            subject: `New Course Purchase: ${courseName} by ${studentName}`, // Subject line
            text: `A new course purchase has been made on the website.`, // Plain text body
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #4CAF50;">New Course Purchase Notification</h2>
                    <p>Dear Admin,</p>
                    <p>A new course purchase has been made on the website. Below are the details:</p>

                    <h3 style="color: #4CAF50;">Purchase Details:</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li><strong>Student Name:</strong> ${studentName}</li>
                        <li><strong>Student Email:</strong> <a href="mailto:${studentEmail}" style="color: #4CAF50;">${studentEmail}</a></li>
                        <li><strong>Course Name:</strong> ${courseName}</li>
                        <li><strong>Price:</strong> $${coursePrice.toFixed(2)}</li>
                        <li><strong>Purchase Date:</strong> ${purchaseDate.toLocaleDateString()}</li>
                    </ul>

                    <p>Please ensure the student has been granted access to the course materials and assist them if needed.</p>

                    <p>Best regards,<br>The <strong>${ORGANIZATION_NAME}</strong> Website Team</p>
                </div>
                `, // HTML body
        });

        console.log('Course purchase email sent to admin:', info.messageId);
    } catch (error) {
        console.error('Error sending course purchase email to admin:', error);
    }
};