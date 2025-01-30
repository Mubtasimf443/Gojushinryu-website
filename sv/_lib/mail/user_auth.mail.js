/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
*/
import { MAIL_USER, ADMIN_EMAIL, FROM_EMAIL, ADMIN_PHONE, ORGANIZATION_NAME } from '../utils/env.js';
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
export const user_sign_up_success_admin_mail = async e => {
  try {
    await mailer.sendMail({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: 'A User Have Join',
      text: 'A User Have Joined GojuShinRyu',
      html: '<h3>See User Details</h3> ' + 'please Check User Details in your Control Panal'
    })
  } catch (error) {
    console.log(error);
  }


}
export const user_sign_up_success_user_mail = async ({ to }) => {
  try {
    let mailSend = mailer.sendMail({
      from: FROM_EMAIL,
      to,
      subject: 'Congratulation',
      text: 'Congratulation for Joining GojuShinRyu please Visit your Accouts page  ',
    })
  } catch (e) {
    console.log(e)
    //  return false
  }
}
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