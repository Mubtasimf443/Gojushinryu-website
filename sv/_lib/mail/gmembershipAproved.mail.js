/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
*/


import catchError from "../utils/catchError.js";
import { ADMIN_PHONE, BASE_URL, FROM_EMAIL ,ADMIN_EMAIL} from "../utils/env.js";
import { mailer } from "../utils/mailer.js";




export async function gmembershipAprovedStudent(userEmail,userName) {
    try {
        const info = await mailer.sendMail({
            from:FROM_EMAIL, // Sender info
            to: userEmail, // User's email address
            subject: "Membership Approved - Welcome to GojushinRyu International Martial Art", // Subject line
            html: `
                        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                            <h2 style="color: #4CAF50;">Membership Approved</h2>
                            <p>Dear ${userName},</p>
                            <p>Congratulations! Your membership request for <strong>GojushinRyu International Martial Art</strong> has been approved. We are thrilled to welcome you to our community!</p>
                            
                            <p>As a valued member, we would like to inform you about an exciting opportunity to represent your country as a <strong>Country Representative</strong>. This role allows you to promote and expand the reach of GojushinRyu in your region.</p>
                            
                            <p>To learn more and apply for the Country Representative position, please visit the following page:</p>
                            <p>
                                <a href="${BASE_URL+ '/become-a-country-representative'}" style="color: #4CAF50; text-decoration: none; font-weight: bold;">
                                    Become a Country Representative
                                </a>
                            </p>
        
                            <p>If you have any questions or need further assistance, feel free to contact us:</p>
                            <ul style="list-style: none; padding: 0;">
                                <li>📧 Email: <a href="mailto:${ADMIN_EMAIL}" style="color: #4CAF50;">${ADMIN_EMAIL}</a></li>
                                <li>📞 Phone: ${ADMIN_PHONE}</li>
                            </ul>
        
                            <p>We look forward to seeing your contributions as a part of the GojushinRyu family. Thank you for joining us on this journey!</p>
        
                            <p>Best regards,<br>The <strong>GojushinRyu International Martial Art</strong> Team</p>
                        </div>
                    `, // HTML body
        });

        console.log('Membership approval email sent:', info.messageId);

    } catch (error) {
        catchError(res, error)
    }
}
