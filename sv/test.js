/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { ADMIN_EMAIL, ORGANIZATION_NAME, ADMIN_PHONE, FROM_EMAIL } from "./_lib/utils/env.js";
import { mailer } from "./_lib/utils/mailer.js";


async function sendAdminNoticeEmail({ recipientEmail, noticeTitle, noticeMessage }) {
    try {
       const info = await mailer.sendMail({
          from: FROM_EMAIL,
          to: recipientEmail,
          subject: noticeTitle,
          html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
             <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #ffaa1c; text-align: center;">${noticeTitle}</h2>
                <p>
                Dear Student,<br><br>
                ${noticeMessage}
                
                <br><br>Thank you.
                </p>
                <p>Best regards,<br>The ${ORGANIZATION_NAME} Team</p>
             </div>
          </div>
          `
       });
       console.log("Admin notice email sent:", info.messageId);
    } catch (error) {
       console.error("Error sending admin notice email:", error);
    }
 }
 
 // Example usage:
 sendAdminNoticeEmail({
    recipientEmail: ADMIN_EMAIL,
    noticeTitle: "Important Update from Admin",
    noticeMessage: "This is an official notice regarding your account activity. Please review the attached instructions and contact support if you have any questions."
 });
 