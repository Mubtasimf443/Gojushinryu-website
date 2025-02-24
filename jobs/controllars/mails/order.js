/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { FROM_EMAIL, ORGANIZATION_NAME, WEBSITE_ORIGIN ,ADMIN_PHONE , ADMIN_EMAIL} from "../../env.js";
import Orders from "../Order.js";
import { mailer } from "../utils/mailer.js";



export async function sendOrderCancellationEmailToUser({ email, userName, orderId }) {
    try {
      const formattedCancellationDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
  
      const info = await mailer.sendMail({
        from:FROM_EMAIL,
        to: email,
        subject: "Order Cancellation Notification",
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="${WEBSITE_ORIGIN + '/img/i1.png'}" alt="${ORGANIZATION_NAME} Icon" style="max-width: 100px;" />
              </div>
              <h2 style="color: #ffaa1c; text-align: center;">Order Cancelled</h2>
              <p>Dear ${userName},</p>
              <p>We regret to inform you that your order with Order ID <strong>${orderId}</strong> has been automatically cancelled.</p>
              <p>This cancellation occurred because payment was not received within 7 days, and we did not receive any response from you.</p>
              <p>The order was cancelled on <strong>${formattedCancellationDate}</strong>.</p>
              <p>If you have any questions, please contact us at:</p>
              <ul style="list-style: none; padding: 0;">
                <li>Email: <a href="mailto:${ADMIN_EMAIL}" style="color: #ffaa1c;">${ADMIN_EMAIL}</a></li>
                <li>Phone: ${ADMIN_PHONE}</li>
              </ul>
              <p>Thank you for your understanding.</p>
              <p>Best regards,<br>The <strong>${ORGANIZATION_NAME}</strong> Team</p>
            </div>
          </div>
        `
      });
  
      console.log("Order cancellation email sent to user:", info.messageId);
    } catch (error) {
      console.error("Error sending order cancellation email to user:", error);
    }
}


export async function sendWeeklyCancelledOrdersReportEmailToAdmin(cancelledOrders=[new Orders()]) {
    try {
      // Generate table rows for each cancelled order
      const rowsHtml = cancelledOrders.map(order => {
        const formattedDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        return `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${order.id}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${order.reciever.fname}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${formattedDate}</td>
          </tr>
        `;
      }).join("");
  
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <div style="max-width: 700px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #ffaa1c; text-align: center;">Weekly Cancelled Orders Report</h2>
            <p>Dear Admin,</p>
            <p>The following orders have been automatically cancelled this week due to non-payment (7 days timeout):</p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #f2f2f2;">
                  <th style="border: 1px solid #ddd; padding: 8px;">Order ID</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">Customer Name</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">Cancellation Date</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
            <p>You can view more details in the Control Panel.</p>
            <p><a href="${WEBSITE_ORIGIN}/control-panal" style="color: #ffaa1c; text-decoration: none;">Go to Control Panel</a></p>
            <p>Best regards,<br>The <strong>${ORGANIZATION_NAME}</strong> System</p>
          </div>
        </div>
      `;
  
      const info = await mailer.sendMail({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: "Weekly Cancelled Orders Report",
        html: emailHtml
      });
  
      console.log("Weekly cancelled orders report email sent to admin:", info.messageId);
    } catch (error) {
      console.error("Error sending weekly cancelled orders report email:", error);
    }
  }
  