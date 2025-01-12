/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

import { ADMIN_EMAIL, FROM_EMAIL } from "../utils/env.js";
import { mailer } from "../utils/mailer.js";


export async function sendCourseApplicationEmail({ student, courseName }) {
    try {
        const info = await mailer.sendMail({
            from: FROM_EMAIL, // Sender info
            to: ADMIN_EMAIL, // Grand Master's email address
            subject: `New Student Application for ${courseName}: ${student.name}`, // Subject line
            text: `A new student has applied to join the ${courseName} course.`, // Plain text body
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #4CAF50;">New Student Application</h2>
                    <p>Dear Grand Master,</p>
                    <p>A new student has applied to join the <strong>${courseName}</strong> course through the website. Here are the details of the applicant:</p>
                    <h3 style="color: #4CAF50;">Student Details:</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li><strong>Name:</strong> ${student.name}</li>
                        <li><strong>Address:</strong> ${student.road_no} &nbsp;${student.zipcode}, &nbsp;${student.city} , &nbsp;${student.district} , &nbsp;${student.country}</li>
                        <li><strong>Email:</strong> <a href="mailto:${student.email}" style="color: #4CAF50;">${student.email}</a></li>
                        <li><strong>Phone:</strong> ${student.phone}</li>
                        <li><strong>Course:</strong> ${courseName}</li>
                    </ul>
                    <p>Please review the application and take the necessary steps to welcome the student to the course.</p>
                    <p style="margin-top: 20px;">Best regards,<br>The <strong>Your Martial Arts School</strong> Team</p>
                    <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #777;"> This email is sent automatically from the website. Please do not reply directly to this email. </p>
                </div>
            ` // HTML body
        });

        console.log('Student application email sent:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending student application email:');
        console.error(error);
        return false;
    }
};
