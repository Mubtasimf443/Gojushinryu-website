/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
*/
import { MAIL_USER, ADMIN_EMAIL, FROM_EMAIL, ADMIN_PHONE, ORGANIZATION_NAME, BASE_URL } from '../utils/env.js';
import { mailer } from '../utils/mailer.js'
import { log } from '../utils/smallUtils.js';


export const user_varification_user_mail = async ({ to, otp, user }) => {
  try {
    await mailer.sendMail({
      from: FROM_EMAIL, 
      to, 
      subject: "Verify Your Email - OTP Confirmation", 
      html: `
                  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                      <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);">
                          <h2 style="color: #ffaa1c; text-align: center;">Email Verification</h2>
                          <p>Dear ${user},</p>
                          <p>Thank you for registering with <strong>${ORGANIZATION_NAME}</strong>. To complete your registration, please verify your email by entering the following OTP (One-Time Password):</p>
                          
                          <div style="text-align: center; font-size: 24px; font-weight: bold; color: #ffaa1c; margin: 20px 0;">
                              ${otp}
                          </div>
  
                          <p>This OTP is valid for <strong>1 minutes</strong>. If you did not request this verification, please ignore this email.</p>
  
                          <p>Need help? Contact our support team:</p>
                          <ul style="list-style: none; padding: 0;">
                        
                          <li>📧 Email: <a href="mailto:${ADMIN_EMAIL}" style="color: #ffaa1c;">${ADMIN_EMAIL}</a></li>
                              <li>📞 Phone: ${ADMIN_PHONE}</li>
                          </ul>
  
                          <p style="text-align: center;">Thank you for being part of our community!</p>
                          <p style="text-align: center;"><strong>${ORGANIZATION_NAME}</strong></p>
                      </div>
                  </div>
              `
    });
    return true;
  } catch (e) {
    console.log(e)
    return false
  }
}
export const user_sign_up_success_user_mail = async ({studentEmail, studentName}) => {
  try {
    // Format the request date to a readable format
    const formattedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const info = await mailer.sendMail({
      from:FROM_EMAIL,
      to: studentEmail,
      subject: "Your Student Account Request is Received",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${BASE_URL + '/img/i1.png'}" alt="${ORGANIZATION_NAME} Icon" style="max-width: 100px;" />
            </div>
            <h2 style="color: #ffaa1c; text-align: center;">Account Request Received</h2>
            <p>Dear ${studentName},</p>
            <p>Thank you for creating an account at <strong>${ORGANIZATION_NAME}</strong> on <strong>${formattedDate}</strong>.</p>
            <p>Your account request is currently under review by our admin team. Until your account is approved, you will not have access to student features (such as the syllabus and student corner).</p>
            <p>Please be patient, and we will notify you via email once your account is approved.</p>
            <p>If you have any questions, feel free to contact us:</p>
            <ul style="list-style: none; padding: 0;">
              <li>Email: <a href="mailto:${ADMIN_EMAIL}" style="color: #ffaa1c;">${ADMIN_EMAIL}</a></li>
              <li>Phone: ${ADMIN_PHONE}</li>
            </ul>
            <p>Thank you for your interest in <strong>${ORGANIZATION_NAME}</strong>.</p>
            <p>Best regards,<br>The ${ORGANIZATION_NAME} Team</p>
          </div>
        </div>
      `
    });
    console.log('Student registration received email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending student registration received email:', error);
  }
};
export const user_sign_up_success_admin_mail = async ( {studentName, studentEmail}) => {
  try {
    // Format the request date to a readable format
    const formattedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const info = await mailer.sendMail({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: "New Student Account Request - Review Needed",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${BASE_URL + '/img/i1.png'}" alt="${ORGANIZATION_NAME} Icon" style="max-width: 100px;" />
            </div>
            <h2 style="color: #ffaa1c; text-align: center;">New Student Account Request</h2>
            <p>Dear Admin,</p>
            <p>A new student account request has been submitted at <strong>${ORGANIZATION_NAME}</strong> on <strong>${formattedDate}</strong>.</p>
            <p><strong>Student Details:</strong></p>
            <ul style="list-style: none; padding: 0;">
              <li>Name: ${studentName}</li>
              <li>Email: ${studentEmail}</li>
            </ul>
            <p>Please review the account request and approve it to grant the student access to student features.</p>
            <p>If you have any questions or need additional details, please contact our support team.</p>
            <p>Best regards,<br>The ${ORGANIZATION_NAME} System</p>
          </div>
        </div>
      `
    });
    console.log('Admin review notification email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending admin review notification email:', error);
  }
};
export const studentAccountApprovalEmail = async ({studentEmail, studentName}) => {
  try {
    const info = await mailer.sendMail({
      from: FROM_EMAIL,
      to: studentEmail,
      subject: "Your Student Account is Approved!",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${BASE_URL + '/img/i2.png'}" alt="${ORGANIZATION_NAME} Icon" style="max-width: 100px;" />
            </div>
            <h2 style="color: #ffaa1c; text-align: center;">Account Approved</h2>
            <p>Dear ${studentName},</p>
            <p>We are pleased to inform you that your student account at <strong>${ORGANIZATION_NAME}</strong> has been approved.</p>
            <p>You now have full access to the student features, including the student corner and syllabus. Please visit your dashboard by clicking the link below:</p>
            <p style="text-align: center;">
              <a href="${BASE_URL + '/student-corner'}" style="color: #ffaa1c; text-decoration: none; font-weight: bold;">Visit Student Corner</a>
            </p>
            <p>If you have any questions, please feel free to contact us:</p>
            <ul style="list-style: none; padding: 0;">
              <li>Email: <a href="mailto:${ADMIN_EMAIL}" style="color: #ffaa1c;">${ADMIN_EMAIL}</a></li>
              <li>Phone: ${ADMIN_PHONE}</li>
            </ul>
            <p>Thank you for choosing <strong>${ORGANIZATION_NAME}</strong>. We wish you every success in your studies!</p>
            <p>Best regards,<br>The ${ORGANIZATION_NAME} Team</p>
          </div>
        </div>
      `
    });
    console.log('Student account approval email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending student account approval email:', error);
  }
};

export async function forget_Password_Otp_Mail(to, otp) {
  try {
    let mailSend = await mailer.sendMail({
      from: FROM_EMAIL,
      to,
      subject: 'Reset Password',
      text: 'Your Reset Password Otp is' + otp,
    })
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

