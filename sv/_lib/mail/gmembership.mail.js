/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
*/

import { ADMIN_PHONE, FROM_EMAIL ,ADMIN_EMAIL} from "../utils/env.js";
import { mailer } from "../utils/mailer.js";

export async function sendMembershipApplicationReceivedEmail(userEmail, userName)  {
    try {
        const info = await mailer.sendMail({
            from: FROM_EMAIL, // Sender info
            to: userEmail, // User's email address
            subject: "Your Membership Application Has Been Received", // Subject line
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #4CAF50;">Membership Application Received</h2>
                    <p>Dear ${userName},</p>
                    <p>Thank you for your interest in joining <strong>GojushinRyu International Martial Art</strong>. We have successfully received your membership application.</p>
                    
                    <p>Your application is currently under review by our admin team. Please allow us some time to carefully assess your submission. Once the review process is complete, we will notify you of the decision via email.</p>

                    <p>If you have any questions or need further assistance in the meantime, feel free to contact us:</p>
                    <ul style="list-style: none; padding: 0;">
                          <li>📧 Email: <a href="mailto:${ADMIN_EMAIL}" style="color: #4CAF50;">${ADMIN_EMAIL}</a></li>
                          <li>📞 Phone: ${ADMIN_PHONE}</li>
                    </ul>

                    <p>We appreciate your patience and look forward to welcoming you to our community!</p>

                    <p>Best regards,<br>The <strong>GojushinRyu International Martial Art</strong> Team</p>
                </div>
            `
            // HTML body
        });

        console.log('Membership application received email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending membership application received email:', error);
    }
};

export async function sendMembershipRequestNotificationToAdmin(studentName, studentEmail, studentPhone) {
    try {
        const formattedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const info = await mailer.sendMail({
            from:FROM_EMAIL, // Sender info
            to: ADMIN_EMAIL, // Admin's email address
            subject: "New Membership Request Received", // Subject line
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #4CAF50;">New Membership Request Received</h2>
                    <p>Dear Admin,</p>
                    <p>A new membership request has been submitted to <strong>GojushinRyu International Martial Art</strong>. Here are the details:</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Student Name</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${studentName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${studentEmail}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${studentPhone}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Request Date</td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${formattedDate}</td>
                        </tr>
                    </table>

                    <p>Please review the application at your earliest convenience. If you have any questions or need further information, please reach out to the student directly.</p>

                    <p>Best regards,<br>The <strong>GojushinRyu International Martial Art</strong> System</p>
                </div>
            `, // HTML body
        });

        console.log('Membership request notification sent to admin:', info.messageId);
    } catch (error) {
        console.error('Error sending membership request notification to admin:', error);
    }
};


export async function  GMembershipNotApprovedEmail(userEmail, userName) {
    try {
        const info = await mailer.sendMail({
            from: FROM_EMAIL, // Sender info
            to: userEmail, // User's email address
            subject: "Membership Request Not Approved", // Subject line
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #FF6347;">Membership Request Not Approved</h2>
                    <p>Dear ${userName},</p>
                    <p>We regret to inform you that your membership request for <strong>GojushinRyu International Martial Art</strong> has not been approved at this time.</p>

                    <p>We understand this may be disappointing, and we want to assure you that every application is carefully reviewed by our admin team. Unfortunately, your request did not meet the criteria for approval.</p>
                    
                    <p>If you would like to discuss this further or need clarification, please feel free to reach out to us:</p>
                    <ul style="list-style: none; padding: 0;">
                          <li>📧 Email: <a href="mailto:${ADMIN_EMAIL}" style="color: #4CAF50;">${ADMIN_EMAIL}</a></li>
                          <li>📞 Phone: ${ADMIN_PHONE}</li>
                    </ul>

                    <p>Thank you for your interest in GojushinRyu International Martial Art. We encourage you to stay connected and explore other ways to be part of our martial arts community.</p>

                    <p>Best regards,<br>The <strong>GojushinRyu International Martial Art</strong> Team</p>
                </div>
            ` // HTML body
        });

        console.log('Membership not approved email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending membership not approved email:', error);
    }
};

