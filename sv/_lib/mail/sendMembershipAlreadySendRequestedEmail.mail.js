/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { ADMIN_EMAIL, ADMIN_PHONE, ORGANIZATION_NAME,FROM_EMAIL} from "../utils/env.js";
import { mailer } from "../utils/mailer.js";


export async function sendMembershipAlreadySendRequestedEmail(userEmail, userName, requestDate)  {
    try {
        const formattedDate = new Date(requestDate).toLocaleString();

        const info = await mailer.sendMail({
            from: FROM_EMAIL, // Sender info
            to: userEmail, // User's email address
            subject: "Membership Request Already Received,Please avoid requesting again and again", // Subject line
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #4CAF50;">Membership Request Already Received</h2>
                    <p>Dear ${userName},</p>
                    <p>We have already received your membership request on <strong>${formattedDate}</strong>, and it is currently under review by our admin team.</p>
                    
                    <p>As a reminder, you cannot submit another membership request while your current application is pending. Please allow us some time to process your request. Once the admin approves or responds to your application, you will be notified via email.</p>

                    <p>If you have any questions or need further assistance, please feel free to contact us:</p>
                    <ul style="list-style: none; padding: 0;">
                        <li>📧 Email: <a href="mailto:${ADMIN_EMAIL}" style="color: #4CAF50;">${ADMIN_EMAIL}</a></li>
                        <li>📞 Phone: ${ADMIN_PHONE}</li>
                    </ul>

                    <p>We appreciate your patience and look forward to welcoming you to our martial arts community!</p>

                    <p>Best regards,<br>The <strong>${ORGANIZATION_NAME}</strong> Team</p>
                </div>
            `, // HTML body
        });

        console.log('Membership already requested email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending membership already requested email:', error);
    }
};
