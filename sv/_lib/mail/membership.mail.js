/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
*/

import { User } from "../models/user.js"
import { ADMIN_EMAIL, ADMIN_PHONE, BASE_URL, FROM_EMAIL, ORGANIZATION_NAME } from "../utils/env.js"
import { mailer } from "../utils/mailer.js"
import { log } from "../utils/smallUtils.js"
import {returnMailh2,  returnMailParagraph, returnMailTD2, returnMailTH2 } from "./components.js"




export const membership_success_Admin_email = (userInfo) => {
  try {
    mailer.sendMail({
      from: FROM_EMAIL,
      to:ADMIN_EMAIL, 
      subject: 'Membeship Happened',
      html: `
       <div style="min-width:  fit-content;background-color:whitesmoke;`+
      // `display: flex;flex-direction: column;justify-content: flex-start;align-items: center;`flex-wrap: wrap;
       `margin: 0px;padding: 35px 1em;row-gap: 17px;box-sizing: border-box;min-height:fit-content;">
     `+
     returnMailh2('View The Details of new member')
     +
     //returnMailParagraph('Wellcome to the family of Our Membership')
     +
     `<table 
     style="width: 550px;
     background-color:white;
     border-collapse: collapse;
     font-family: Arial;
     box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.027);
      ">`+
     returnMailTH2('Feild','Value')
     + returnMailTD2('name',userInfo.fname +userInfo.lname)
     + returnMailTD2('gender',userInfo.gender)
     + returnMailTD2('country',userInfo.country)
     + returnMailTD2('city',userInfo.city)
     + returnMailTD2('district',userInfo.district)
     + returnMailTD2('postcode',userInfo.postcode)
     + returnMailTD2('email',userInfo.email)
     + returnMailTD2('phone',userInfo.district)
     + returnMailTD2('doju_Name',userInfo.doju_Name)
     + returnMailTD2('instructor',userInfo.instructor)
     + returnMailTD2('current grade',userInfo.current_grade)
     + returnMailTD2('Previous Member?',userInfo.is_previous_member)
     + returnMailTD2('previous membership expiring date',userInfo.previous_membership_expiring_date)
     + returnMailTD2('experience level',userInfo.experience_level)
     + returnMailTD2('permanent disabillity ',userInfo.permanent_disabillity)
     + returnMailTD2('membership name',userInfo.membership_name)
     + returnMailTD2('membership type',userInfo.membership_type)
     + returnMailTD2('membership company ',userInfo.membership_company)
    
     +
  
     `</table>
     </div>
      `
    })
    .then(e =>console.log('//mail send to admin'))
    .catch(e => console.log(e))
  } catch (error) {
    console.log({
      error
    });
    
  }
}


export const membershipCongratulationsEmail = async (userEmail, userName,org, membership_type) => {
  try {
      const info = await mailer.sendMail({
          from: FROM_EMAIL, // Sender info
          to: userEmail, // User's email address
          subject: `Congratulations! You Are Now a Member of ${org}`, // Subject line
          html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                  <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1); text-align: center;">
                      <h2 style="color: #ffaa1c;">🎉 Congratulations, ${userName}! 🎉</h2>
                      <p>We are thrilled to welcome you as an official ${membership_type} member of <strong>${org}</strong></p>

                      <p>This marks the beginning of an incredible journey where you will learn, grow, and become a part of a respected martial arts legacy. Your dedication and passion for martial arts have earned you a place in our global community.</p>

                      <h3 style="color: #ffaa1c;">What's Next?</h3>
                      <p>✅ Access to exclusive training resources</p>
                      <p>✅ Learn from experienced masters</p>
                      <p>✅ Join seminars, tournaments, and special events</p>

                      <p>We encourage you to visit our website and explore opportunities for growth:</p>
                      <p><a href="${BASE_URL}/about-us/members" style="color: #ffaa1c; font-weight: bold;">Visit Our Website</a></p>

                      <p>If you have any questions or need assistance, feel free to contact us:</p>
                      <ul style="list-style: none; padding: 0;">
                          <li>📧 Email: <a href="mailto:${ADMIN_EMAIL}" style="color: #ffaa1c;">${ADMIN_EMAIL}</a></li>
                          <li>📞 Phone:${ADMIN_PHONE}</li>
                      </ul>

                      <p>Once again, congratulations! We look forward to seeing you grow and excel in your martial arts journey.</p>

                      <p><strong>Welcome to the family! 🥋</strong></p>
                      <p>Best regards,<br><strong>${ORGANIZATION_NAME}</strong></p>
                  </div>
              </div>
          `, // HTML body
      });

      console.log('Membership congratulations email sent:', info.messageId);
  } catch (error) {
      console.error('Error sending membership congratulations email:', error);
  }
};


export  function sendMembershipMails(user_info) {
  try {   
  membership_success_Admin_email(user_info)
  User.findById(user_info.user_id)
  .then(user=>{
      if (user){
       
         Membership_success_user_email(user.email)
      }
    })

  } catch (error) {
    log(error)
  }
}





export async function gmembershipFeeRequestMail({studentEmail, studentName, membershipType, membershipFee, paypalLink, stripeLink, dueDate }) {
  try {
    let
      FACEBOOK_URL = 'https://web.facebook.com/stmacanada',
      X_URL = "https://x.com/gojushinryu",
      INSTAGRAM_URL = "https://www.instagram.com/gojushinryu",
      LINKEDIN_URL = "https://www.linkedin.com/company/school-of-traditional-martial-arts";
    if (!dueDate) dueDate = (new Date((Date.now() + (7 * 24 * 60 * 60 * 1000))).toLocaleString());
    const info = await mailer.sendMail({
      from: FROM_EMAIL, // Update sender email as needed
      to: studentEmail,
      subject: `Membership Fee Payment Request - ${membershipType}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #ffaa1c; text-align: center;">Membership Fee Payment Request</h2>
            <p>Dear ${studentName},</p>
            <p>Thank you for choosing to be a part of <strong>${ORGANIZATION_NAME}</strong>. We are excited to have you as a member!</p>
            <p>Your membership fee for the <strong>${membershipType}</strong> is <strong>$${membershipFee.toFixed(2)}</strong> and is due on <strong>${dueDate}</strong>.</p>
            <p>Please use one of the payment options below to complete your payment:</p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${paypalLink}" style="background-color: #4CAF50; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;">
                Pay with PayPal
              </a>
              <a href="${stripeLink}" style="background-color: #007BFF; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Pay with Stripe
              </a>
            </div>
            <p>If you have any questions, please feel free to contact us:</p>
            <ul style="list-style: none; padding: 0;">
              <li>Email: <a href="mailto:${ADMIN_EMAIL}" style="color: #ffaa1c;">${ADMIN_EMAIL}</a></li>
              <li>Phone: ${ADMIN_PHONE}</li>
            </ul>
            <p>Thank you for your prompt attention to this matter. We look forward to a successful journey together.</p>
            <p>Best regards,<br>The ${ORGANIZATION_NAME} Team</p>
            <p style="text-align: center;">
              <a href="${BASE_URL}" style="color: #ffaa1c; text-decoration: none;">Visit our website</a>
            </p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
            <p style="text-align: center;">Follow us on social media:</p>
            <div style="text-align: center;">
              <a href="${FACEBOOK_URL}" style="margin: 0 5px; text-decoration: none; color: #3b5998;">Facebook</a> |
              <a href="${X_URL}" style="margin: 0 5px; text-decoration: none; color: #1da1f2;">X</a> |
              <a href="${INSTAGRAM_URL}" style="margin: 0 5px; text-decoration: none; color: #e1306c;">Instagram</a> |
              <a href="${LINKEDIN_URL}" style="margin: 0 5px; text-decoration: none; color: #0077b5;">LinkedIn</a>
            </div>
          </div>
        </div>
      `
    });

    console.log('Membership fee payment email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending membership fee payment email:', error);
  }
};


// Email to the Student: Payment Confirmation
export const membershipPaymentConfirmationToStudent = async ({studentEmail,studentName, membershipType, membershipFee}) => {
  try {
    // Format the payment date to a readable format
    const formattedPaymentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    let ORGANIZATION_NAME='Gojushinryu International Martial Arts';
    const info = await mailer.sendMail({
      from: FROM_EMAIL, // Update sender email as needed
      to: studentEmail,
      subject: `Payment Confirmation - ${membershipType}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${BASE_URL + '/img/i2.png'}" alt="${ORGANIZATION_NAME} Icon" style="max-width: 100px;" />
            </div>
            <h2 style="color: #ffaa1c; text-align: center;">Payment Confirmation</h2>
            <p>Dear ${studentName},</p>
            <p>Thank you for your payment of <strong>$${membershipFee.toFixed(2)}</strong> for the <strong>${membershipType}</strong> membership at <strong>${ORGANIZATION_NAME}</strong>.</p>
            <p>Your payment was successfully received on <strong>${formattedPaymentDate}</strong>, and your membership is now active.</p>
            <p>If you have any questions, please feel free to contact us:</p>
            <ul style="list-style: none; padding: 0;">
              <li>Email: <a href="mailto:${ADMIN_EMAIL}" style="color: #ffaa1c;">${ADMIN_EMAIL}</a></li>
              <li>Phone: ${ADMIN_PHONE}</li>
            </ul>
            <p style="text-align: center;">
              <a href="${BASE_URL}" style="color: #ffaa1c; text-decoration: none;">Visit our website</a>
            </p>
            <p>Thank you for being a valued member of <strong>${ORGANIZATION_NAME}</strong>.</p>
            <p>Best regards,<br>The ${ORGANIZATION_NAME} Team</p>
          </div>
        </div>
      `
    });

    console.log('Membership payment confirmation email sent to student:', info.messageId);
  } catch (error) {
    console.error('Error sending membership payment confirmation email to student:', error);
  }
};

// Email to the Admin: Payment Notification
export const membershipPaymentNotificationToAdmin = async ({ studentName, membershipType, membershipFee }) => {
  try {
    // Format the payment date to a readable format
    const formattedPaymentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    let ORGANIZATION_NAME='Gojushinryu International Martial Arts';
    const info = await mailer.sendMail({
      from:FROM_EMAIL,
      to: ADMIN_EMAIL, // Admin's email address (using ${ADMIN_EMAIL} if same variable)
      subject: `New Membership Payment Received - ${membershipType}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="${BASE_URL + '/img/i2.png'}" alt="${ORGANIZATION_NAME} Icon" style="max-width: 100px;" />
            </div>
            <h2 style="color: #ffaa1c; text-align: center;">Payment Received</h2>
            <p>Dear Admin,</p>
            <p>This is to notify you that <strong>${studentName}</strong> has successfully paid <strong>$${membershipFee.toFixed(2)}</strong> for the <strong>${membershipType}</strong> membership.</p>
            <p>Payment was received on <strong>${formattedPaymentDate}</strong>.</p>
            <p>Please verify the transaction in the system.</p>
            <p>If further action is needed, kindly follow up with the student.</p>
            <p>Best regards,<br>The ${ORGANIZATION_NAME} System</p>
          </div>
        </div>
      `
    });

    console.log('Membership payment notification email sent to admin:', info.messageId);
  } catch (error) {
    console.error('Error sending membership payment notification email to admin:', error);
  }
};
