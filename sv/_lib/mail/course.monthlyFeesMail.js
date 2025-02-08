/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

import { ADMIN_EMAIL, ADMIN_PHONE, BASE_URL, FROM_EMAIL, ORGANIZATION_NAME } from "../utils/env.js";
import { mailer } from "../utils/mailer.js";



async function notifyAdminOfStudentPayment({ student_name, course_name, course_fees, gst, total, payment_id }) {
    try {
       const info = await mailer.sendMail({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: "Student Monthly Fee Payment Received",
          html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="${BASE_URL + '/img/i1.png'}" alt="${ORGANIZATION_NAME} Icon" style="max-width: 100px;" />
              </div>
              <h2 style="color: #ffaa1c; text-align: center;">Student Payment Received</h2>
              <p>Dear Admin,</p>
              <p>A student has successfully paid their monthly course fees. Below are the details:</p>
 
              <h3 style="color: #ffaa1c;">Payment Details:</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="border: 1px solid #ddd; padding: 10px;"><strong>Student Name:</strong></td>
                  <td style="border: 1px solid #ddd; padding: 10px;">${student_name}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 10px;"><strong>Course Name:</strong></td>
                  <td style="border: 1px solid #ddd; padding: 10px;">${course_name}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 10px;"><strong>Course Fees:</strong></td>
                  <td style="border: 1px solid #ddd; padding: 10px;">$${course_fees}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 10px;"><strong>GST (Tax):</strong></td>
                  <td style="border: 1px solid #ddd; padding: 10px;">$${gst}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;"><strong>Total Amount:</strong></td>
                  <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">$${total}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 10px;"><strong>Payment ID:</strong></td>
                  <td style="border: 1px solid #ddd; padding: 10px;">${payment_id}</td>
                </tr>
              </table>
 
              <p>This payment has been successfully processed.</p>
 
              <h3 style="color: #ffaa1c;">Need Help?</h3>
              <p>If you have any questions, feel free to reach out to us:</p>
              <ul style="list-style: none; padding: 0;">
                <li>Email: <a href="mailto:${ADMIN_EMAIL}" style="color: #ffaa1c;">${ADMIN_EMAIL}</a></li>
                <li>Phone: ${ADMIN_PHONE}</li>
              </ul>
 
              <p>Best regards,</p>
              <p><strong>${ORGANIZATION_NAME} Team</strong></p>
            </div>
          </div>
        `
       });
 
       console.log("Monthly Course Fee Payment Notification Email sent to Admin:", info.messageId);
    } catch (error) {
       console.error("Error sending admin notification email:", error);
    }
 };

async function sendStudentFeeConfirmation({ email, student_name, course_name, course_fees, gst, total, payment_id }) {
    try {
       const info = await mailer.sendMail({
          from: FROM_EMAIL,
          to: email,
          subject: "Payment Confirmation - Monthly Course Fees",
          html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="${BASE_URL + '/img/i1.png'}" alt="${ORGANIZATION_NAME} Icon" style="max-width: 100px;" />
              </div>
              <h2 style="color: #ffaa1c; text-align: center;">Payment Confirmation</h2>
              <p>Dear <strong>${student_name}</strong>,</p>
              <p>We have successfully received your monthly course fee payment for <strong>${course_name}</strong>.</p>
 
              <h3 style="color: #ffaa1c;">Payment Details:</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="border: 1px solid #ddd; padding: 10px;"><strong>Course Name:</strong></td>
                  <td style="border: 1px solid #ddd; padding: 10px;">${course_name}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 10px;"><strong>Course Fees:</strong></td>
                  <td style="border: 1px solid #ddd; padding: 10px;">$${course_fees}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 10px;"><strong>GST (Tax):</strong></td>
                  <td style="border: 1px solid #ddd; padding: 10px;">$${gst}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;"><strong>Total Amount:</strong></td>
                  <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">$${total}</td>
                </tr>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 10px;"><strong>Payment ID:</strong></td>
                  <td style="border: 1px solid #ddd; padding: 10px;">${payment_id}</td>
                </tr>
              </table>
 
              <p>Your payment has been successfully processed. If you have any questions or concerns, please contact us.</p>
 
              <h3 style="color: #ffaa1c;">Need Help?</h3>
              <p>If you need assistance, feel free to reach out to us:</p>
              <ul style="list-style: none; padding: 0;">
                <li>Email: <a href="mailto:${ADMIN_EMAIL}" style="color: #ffaa1c;">${ADMIN_EMAIL}</a></li>
                <li>Phone: ${ADMIN_PHONE}</li>
              </ul>
 
              <p>We appreciate your dedication to training at <strong>${ORGANIZATION_NAME}</strong>. Keep up the hard work!</p>
 
              <p>Best regards,</p>
              <p><strong>${ORGANIZATION_NAME} Team</strong></p>
            </div>
          </div>
        `
       });
 
       console.log("Monthly Course Fee Payment Confirmation Email sent to Student:", info.messageId);
    } catch (error) {
       console.error("Error sending student payment confirmation email:", error);
    }
 };


const MonthlyCourseEnrollmentFeesMails={
    confirmation:{
        notifyAdmin: notifyAdminOfStudentPayment,
        student :sendStudentFeeConfirmation
    }
};
export default MonthlyCourseEnrollmentFeesMails;