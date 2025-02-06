/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

import { log } from "string-player";
import { MAIL_USER, ADMIN_EMAIL, FROM_EMAIL, ADMIN_PHONE, BASE_URL } from '../utils/env.js';
import { mailer } from "../utils/mailer.js";

let ORGANIZATION_NAME = 'Gojushinryu International Martial Arts';

const ApplicationReceived1 = async ({ recipientEmail, applicantName }) => {
  try {
    const info = await mailer.sendMail({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: "Your Country Representative Application Received",
      html: `
         <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
           <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
             <div style="text-align: center; margin-bottom: 20px;">
               <img src="${BASE_URL + '/img/i2.png'}" alt="${ORGANIZATION_NAME} Icon" style="max-width: 100px;" />
             </div>
             <h2 style="color: #ffaa1c; text-align: center;">Application Received</h2>
             <p>Dear ${applicantName},</p>
             <p>We have received your application to become a <strong>Country Representative</strong> for <strong>${ORGANIZATION_NAME}</strong>.</p>
             <p>Our admin team will review your request shortly. You will be notified once a decision is made.</p>
             <p>Thank you for your interest in representing ${ORGANIZATION_NAME}.</p>
             <p>Best regards,</p>
             <p><strong>${ORGANIZATION_NAME} Team</strong></p>
           </div>
         </div>
       `,
    });

    console.log("Country Rep Application Received Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending application received email:", error);
  }
};

const ApplicationReceived2 = async ({ applicantName, applicantEmail, applicantPhone }) => {
  try {
    const info = await mailer.sendMail({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: "New Country Representative Application Received",
      html: `
         <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
           <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
             <h2 style="color: #ffaa1c; text-align: center;">New Application Received</h2>
             <p>Dear Admin,</p>
             <p>A new applicant has applied to become a <strong>Country Representative</strong>.</p>
             <p><strong>Applicant Details:</strong></p>
             <ul>
               <li><strong>Name:</strong> ${applicantName}</li>
               <li><strong>Email:</strong> ${applicantEmail}</li>
               <li><strong>Phone:</strong> ${applicantPhone}</li>
             </ul>
             <p>Please review the application and approve if eligible.</p>
             <p>Best regards,</p>
             <p><strong>${ORGANIZATION_NAME} Team</strong></p>
           </div>
         </div>
       `,
    });
    console.log("Admin Notified of Country Rep Application:", info.messageId);
  } catch (error) {
    console.error("Error notifying admin:", error);
  }
};

const CountryRepApprovalEmail = async ({ recipientEmail, applicantName, countryRepPage }) => {
  try {
    const info = await mailer.sendMail({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: "Congratulations! You Are Now a Country Representative",
      html: `
         <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
           <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
             <h2 style="color: #ffaa1c; text-align: center;">Congratulations!</h2>
             <p>Dear ${applicantName},</p>
             <p>We are pleased to inform you that your application to become a <strong>Country Representative</strong> for <strong>${ORGANIZATION_NAME}</strong> has been approved.</p>
             <p>You can now officially represent our organization. To learn more about your role, visit the <a href="${countryRepPage}" style="color: #ffaa1c;">Country Representative Page</a>.</p>
             <p>Welcome to ${ORGANIZATION_NAME}!</p>
             <p>Best regards,</p>
             <p><strong>${ORGANIZATION_NAME} Team</strong></p>
           </div>
         </div>
       `,
    });

    console.log("Country Rep Approval Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending approval email:", error);
  }
};

async function paymentRequest({ email, paypal_link, stripe_link, fees, gst, total }) {
  try {
    const info = await mailer.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: "Payment Request for Country Representative Fees",
      html: `
         <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
           <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
             <div style="text-align: center; margin-bottom: 20px;">
               <img src="${BASE_URL + '/img/i2.png'}" alt="${ORGANIZATION_NAME} Icon" style="max-width: 100px;" />
             </div>
             <h2 style="color: #ffaa1c; text-align: center;">Country Representative Payment Request</h2>
             <p>Dear Applicant,</p>
             <p>We are pleased to inform you that your request to become a <strong>Country Representative</strong> for <strong>${ORGANIZATION_NAME}</strong> has been received and is under process.</p>
             <p>To complete your registration as a Country Representative, please proceed with the required payment.</p>

             <h3 style="color: #ffaa1c;">Payment Details:</h3>
             <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
               <tr>
                 <td style="border: 1px solid #ddd; padding: 10px;"><strong>Country Representative Fees:</strong></td>
                 <td style="border: 1px solid #ddd; padding: 10px;">$${fees}</td>
               </tr>
               <tr>
                 <td style="border: 1px solid #ddd; padding: 10px;"><strong>GST (Tax):</strong></td>
                 <td style="border: 1px solid #ddd; padding: 10px;">$${gst}</td>
               </tr>
               <tr>
                 <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;"><strong>Total Amount:</strong></td>
                 <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">$${total}</td>
               </tr>
             </table>

             <h3 style="color: #ffaa1c;">Payment Links:</h3>
             <p>You can securely complete your payment using one of the following options:</p>
             <ul>
               <li><strong>PayPal:</strong> <a href="${paypal_link}" style="color: #ffaa1c;">Click here to pay via PayPal</a></li>
               <li><strong>Stripe:</strong> <a href="${stripe_link}" style="color: #ffaa1c;">Click here to pay via Stripe</a></li>
             </ul>

             <p>Once your payment is received, you will officially become a Country Representative of <strong>${ORGANIZATION_NAME}</strong> and gain access to exclusive resources.</p>

             <h3 style="color: #ffaa1c;">Need Help?</h3>
             <p>If you have any questions or need assistance, feel free to reach out to us:</p>
             <ul style="list-style: none; padding: 0;">
               <li>Email: <a href="mailto:${ADMIN_EMAIL}" style="color: #ffaa1c;">${ADMIN_EMAIL}</a></li>
               <li>Phone: ${ADMIN_PHONE}</li>
             </ul>

             <p>Thank you for your dedication to martial arts and for joining <strong>${ORGANIZATION_NAME}</strong>.</p>

             <p>Best regards,</p>
             <p><strong>${ORGANIZATION_NAME} Team</strong></p>
           </div>
         </div>
       `
    });

    console.log("Country Representative Payment Request Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending payment request email:", error);
  }
};

const sendCountryRepPaymentConfirmationEmail = async ({ recipientEmail, applicantName, paymentId }) => {
  try {
    const info = await mailer.sendMail({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: "Country Representative Payment Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #ffaa1c; text-align: center;">Payment Confirmed</h2>
            <p>Dear ${applicantName},</p>
            <p>We have received your payment for the <strong>Country Representative</strong> membership.</p>
            <p><strong>Payment ID:</strong> ${paymentId}</p>
            <p>Thank you for your support!</p>
            <p>Best regards,</p>
            <p><strong>${ORGANIZATION_NAME} Team</strong></p>
          </div>
        </div>
      `,
    });

    console.log("Country Rep Payment Confirmation Email sent:", info.messageId);
  } catch (error) {
    console.error("Error sending payment confirmation email:", error);
  }
};

const sendAdminCountryRepPaymentEmail = async ({ applicantName, paymentId }) => {
  try {
    const info = await mailer.sendMail({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: "Country Representative Payment Received",
      html: `
         <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
           <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
             <h2 style="color: #ffaa1c; text-align: center;">Payment Received</h2>
             <p>Dear Admin,</p>
             <p>The following applicant has successfully paid the <strong>Country Representative</strong> membership fee:</p>
             <p><strong>Name:</strong> ${applicantName}</p>
             <p><strong>Payment ID:</strong> ${paymentId}</p>
             <p>Please update their membership status accordingly.</p>
             <p>Best regards,</p>
             <p><strong>${ORGANIZATION_NAME} Team</strong></p>
           </div>
         </div>
       `,
    });

    console.log("Admin Notified of Country Rep Payment:", info.messageId);
  } catch (error) {
    console.error("Error notifying admin of payment:", error);
  }
};

let countryRepresentativesMails = {
  paymentRequest,
  ApplicationReceived1,
  ApplicationReceived2,
  CountryRepApprovalEmail,
  sendCountryRepPaymentConfirmationEmail,
  sendAdminCountryRepPaymentEmail,
};

export default countryRepresentativesMails;