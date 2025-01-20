/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
*/

import { ADMIN_EMAIL, ADMIN_PHONE, BASE_URL, FROM_EMAIL, ORGANIZATION_NAME } from "../utils/env.js";
import { mailer } from "../utils/mailer.js";



export default async function blackBeltNoticeMail(userEmail, userName) {
    try {
        let blackBeltPageUrl = BASE_URL + '/about-us/blackbelts';
        const info = await mailer.sendMail({
            from:FROM_EMAIL, // Sender info
            to: userEmail, // User's email address
            subject: "Congratulations on Achieving Your Black Belt!", // Subject line
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #4CAF50;">Congratulations on Achieving Your Black Belt!</h2>
                    <p>Dear ${userName},</p>
                    <p>We are thrilled to announce that you have officially been awarded the rank of <strong>Black Belt</strong> in <strong>${ORGANIZATION_NAME}</strong>. This is a significant milestone that reflects your dedication, discipline, and mastery of martial arts.</p>
                    
                    <p>Your journey to this achievement has been inspiring, and we are proud to have you as part of our community. As a Black Belt, you embody the principles of perseverance, respect, and excellence, and you now serve as a role model for others in our martial arts family.</p>

                    <p>To learn more about what it means to be a Black Belt in our organization and the opportunities available to you, please visit our <a href="${blackBeltPageUrl}" style="color: #4CAF50; text-decoration: none;">Black Belt Page</a>.</p>

                    <p>If you have any questions or wish to explore advanced techniques, certifications, or teaching opportunities, feel free to reach out to us:</p>
                    <ul style="list-style: none; padding: 0;">
                        <li>📧 Email: <a href="mailto:${ADMIN_EMAIL}" style="color: #4CAF50;">${ADMIN_EMAIL}</a></li>
                        <li>📞 Phone: ${ADMIN_PHONE}</li>
                    </ul>

                    <p>Once again, congratulations on this outstanding accomplishment. Welcome to the ranks of Black Belt!</p>

                    <p>Best regards,<br>The <strong>${ORGANIZATION_NAME}</strong> Team</p>
                </div>
            `, // HTML body
        });

        console.log('Black Belt achievement email with page link sent:', info.messageId);
    } catch (error) {
        console.error('Error sending Black Belt achievement email:', error);
    }
}