/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { FROM_EMAIL, ADMIN_EMAIL, ADMIN_PHONE, ORGANIZATION_NAME, WEBSITE_ORIGIN } from "../../env.js";
import { mailer } from "../utils/mailer.js";



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
async function sendAdminMonthlySummary(studentsData =studentData) {
    try {
        let month =new Date().toLocaleString('default', { month: 'long' });
        let year = new Date().getFullYear();
        const tableRows = studentsData
        .map(student => `
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">#${student.id}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${student.name}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${student.email}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${student.courseName}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">$${student.totalFees.toFixed(2)}</td>
            </tr>
        `)
        .join('');

    const info = await mailer.sendMail({
        from: FROM_EMAIL, // Sender info
        to: ADMIN_EMAIL, // Admin's email address
        subject: `Monthly Payment Request Summary - ${month} ${year}`, // Subject line
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #4CAF50;">Monthly Payment Request Summary</h2>
                <p>Dear Admin,</p>
                <p>This is to inform you that payment request emails for <strong>${month} ${year}</strong> have been successfully sent to the following students:</p>
                
                <table style="border-collapse: collapse; width: 100%; margin-top: 20px; font-size: 14px;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">EnrollMent Id</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Student Name</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Email</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Course Name</th>
                            <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Total Fees</th>
                        </tr>
                    </thead>
                    <tbody>${tableRows}</tbody>
                </table>

                <p><strong>Total Students Notified:</strong> ${studentsData.length}</p>

                <p>If you have any questions or require further details, please contact us:</p>
                <ul style="list-style: none; padding: 0;">
                    <li>📧 Email: <a href="mailto:${ADMIN_EMAIL}" style="color: #4CAF50;">${ADMIN_EMAIL}</a></li>
                    <li>📞 Phone:${ADMIN_PHONE}</li>
                </ul>

                <p>Thank you for ensuring the smooth operation of our systems.</p>
                
                <p>Best regards,<br>The <strong>${ORGANIZATION_NAME}</strong> Automation Team</p>
            </div>
        `, // HTML body
    });

        console.log('Admin notification email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending admin notification email:' );
        console.error( error);
    }
};

const sendUnpaidFeesNotification = async ( unpaidStudents) => {
    try {
        // Generate table rows dynamically based on unpaid student data

        let month =new Date().toLocaleString('default', { month: 'long' });
        let year = new Date().getFullYear();
        const tableRows = unpaidStudents
            .map(student => `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">#${student.id}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${student.name}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${student.email}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${student.courseName}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">$${student.totalFees.toFixed(2)}</td>
                </tr>
            `)
            .join('');

        const info = await mailer.sendMail({
            from: FROM_EMAIL, // Sender info
            to: ADMIN_EMAIL, // Admin's email address
            subject: `Unpaid Fees Report - ${month} ${year}`, // Subject line
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #FF5722;">Unpaid Fees Report</h2>
                    <p>Dear Admin,</p>
                    <p>The following students have not completed their fee payments for <strong>${month} ${year}</strong>. Please take the necessary actions:</p>
                    
                    <table style="border-collapse: collapse; width: 100%; margin-top: 20px; font-size: 14px;">
                        <thead>
                            <tr style="background-color: #f2f2f2;">
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">EnrollMent Id</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Student Name</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Email</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Course Name</th>
                                <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Total Fees</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>

                    <p><strong>Total Unpaid Students:</strong> ${unpaidStudents.length}</p>

                    <p>If you have any questions or require further assistance, feel free to contact us:</p>
                    <ul style="list-style: none; padding: 0;">
                        <li>📧 Email: <a href="mailto:${ADMIN_EMAIL}" style="color: #4CAF50;">${ADMIN_EMAIL}</a></li>
                    <li>📞 Phone:${ADMIN_PHONE}</li>
                    </ul>

                    <p>Thank you for keeping track of student payments.</p>
                    
                    <p>Best regards,<br>The <strong>${ORGANIZATION_NAME}</strong> Automation Team</p>
                </div>
            `, // HTML body
        });

        console.log('Unpaid fees notification email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending unpaid fees notification email:', error);
    }
};
const CourseMails = {
    payment_request: sendPaymentRequest,
    monthly_summary_to_admin :sendAdminMonthlySummary,
    unfaid_fees_notification_to_admin : sendUnpaidFeesNotification
};
export default CourseMails;