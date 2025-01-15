/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/

import { namedErrorCatching } from "../utils/catchError.js";
import { ADMIN_EMAIL, FROM_EMAIL } from "../utils/env.js";
import { mailer } from "../utils/mailer.js";


export async function sendOrderConfirmationEmail(buyerEmail, orderDetails, orderId , total_product_price)  {
    try {
        const shopName="GojushinRyu Shop";
        const info = await mailer.sendMail({
            from: FROM_EMAIL, // Sender info
            to: buyerEmail, // Buyer's email address
            subject: 'Your Order Confirmation - Order #' + orderId, // Subject line
            text: `Thank you for your order!`, // Plain text body
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #4CAF50;">Order Confirmation</h2>
                    <p>Dear Customer,</p>
                    <p>Thank you for shopping with <strong>${shopName}</strong>. We have received your order, and it is currently being processed.</p>
                    <p><strong>Order ID:</strong> ${orderId}</p>
                    <p><strong>Total Product Price:</strong> ${total_product_price}</p>
                    <h3 style="color: #4CAF50;">Order Details:</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${orderDetails.map(item => `<li style="margin-bottom: 8px;">✔️ ${item}</li>`).join('')}
                    </ul>
                    <p>We will notify you about the payment and shipping. If you have any questions or concerns, feel free to contact us at <a href="mailto:${ADMIN_EMAIL}">${ADMIN_EMAIL }</a>.</p>
                    <p style="margin-top: 20px;">Best regards,<br>The <strong>${shopName}</strong> Team</p>
                    <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #777;">
                        This email is sent from an unmonitored address. Please do not reply directly to this email.
                    </p>
                </div>
            `, 
        });
        
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export async function sendPaymentRequestEmail({buyerEmail, orderDetails, amountData, orderId, paypalLink, stripeLink}) {
        try {
        const shopName="GojushinRyu Shop";
        const info = await mailer.sendMail({
            from: FROM_EMAIL, // Sender info
            to: buyerEmail, // Buyer's email address
            subject: `Payment Request for Order #${orderId}`, // Subject line
            text: `Complete your payment`, // Plain text body
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #4CAF50;">Payment Request</h2>
                    <p>Dear Customer,</p>
                    <p>Thank you for placing an order with <strong> ${shopName}</strong>. Below are the details of your order:</p>
                    
                    <h3 style="color: #4CAF50;">Order Summary:</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr>
                                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ddd;">Product</th>
                                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ddd;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orderDetails.map(item => `
                                <tr>
                                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
                                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${item.price.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td style="padding: 8px; border-top: 2px solid #ddd; font-weight: bold;">Total Product Price:</td>
                                <td style="padding: 8px; border-top: 2px solid #ddd; font-weight: bold;">$${amountData.total_product_price}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border-top: 2px solid #ddd; font-weight: bold;">Tax:</td>
                                <td style="padding: 8px; border-top: 2px solid #ddd; font-weight: bold;">$${amountData.tax}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border-top: 2px solid #ddd; font-weight: bold;">Shipping Cost:</td>
                                <td style="padding: 8px; border-top: 2px solid #ddd; font-weight: bold;">$${amountData.shipping_cost}</td>
                            </tr>                 
                            <tr>
                                <td style="padding: 8px; border-top: 2px solid #ddd; font-weight: bold;">Total Amount:</td>
                                <td style="padding: 8px; border-top: 2px solid #ddd; font-weight: bold;">$${amountData.total}</td>
                            </tr>

                        </tfoot>
                    </table>

                    <p>To complete your payment, please use one of the following payment links:</p>
                    <ul style="list-style: none; padding: 0;">
                        <li style="margin-bottom: 10px;">
                            <a href="${paypalLink}" style="color: blue; text-decoration: none;">🔗 Pay with PayPal</a>
                        </li>
                        <li>
                            <a href="${stripeLink}" style="color: #000; text-decoration: none;">🔗 Pay with Stripe</a>
                        </li>
                    </ul>
                    
                    <p>If you have any questions or need assistance, feel free to contact us at <a href="mailto:${ADMIN_EMAIL}">${ADMIN_EMAIL}</a>.</p>
                    
                    <p style="margin-top: 20px;">Best regards,<br>The <strong>${shopName}</strong> Team</p>
                    
                    <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #777;">
                        This email is sent from an unmonitored address. Please do not reply directly to this email.
                    </p>
                </div>
            `, // HTML body
        });

        console.log('Email sent:', info?.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
        namedErrorCatching('mail-error', 'failed to send mail to the user')
    }
};

export async function sendShippingNotificationEmail({buyerEmail, orderId, trackingNumber, carrier, estimatedDelivery}) {
    try {
        const shopName="GojushinRyu Shop";
        const info = await mailer.sendMail({
            from: FROM_EMAIL, // Sender info
            to: buyerEmail, // Buyer's email address
            subject: `Your Order #${orderId} Has Been Shipped!`, // Subject line
            text: `Your order has been shipped and is on its way to you!`, // Plain text body
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #4CAF50;">Your Order is on Its Way!</h2>
                    <p>Dear Customer,</p>
                    <p>We’re excited to inform you that your order <strong>#${orderId}</strong> has been shipped and is on its way to you!</p>
                    
                    <h3 style="color: #4CAF50;">Shipping Details:</h3>   ` 
                    // <p><strong>Carrier:</strong> ${carrier}</p>
                  
                    +// <p><strong>Tracking Number:</strong> <a href="https://www.trackyourpackage.com/${trackingNumber}" style="color: #4CAF50;">${trackingNumber}</a></p>
                  
                    //<p><strong>Estimated Delivery:</strong> ${estimatedDelivery}</p>

                   `<p>Please note that the delivery timeframe is estimated to be 7-10 days from the shipping date. You can track your package using the link above.</p>
                    
                    <p>If you have any questions or need further assistance, feel free to contact us at <a href="mailto:${ADMIN_EMAIL}">${ADMIN_EMAIL}</a>.</p>
                    
                    <p style="margin-top: 20px;">Thank you for shopping with us. We hope you enjoy your purchase!</p>
                    <p>Best regards,<br>The <strong>${shopName}</strong> Team</p>
                    
                    <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #777;">
                        This email is sent from an unmonitored address. Please do not reply directly to this email.
                    </p>
                </div>
            `, // HTML body
        });

        // console.log('Shipping notification email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};


export async function sendAdminOrderNotification({ customerName, customerEmail, orderId, orderDetails, totalAmount}) {
    try {
        const shopName="GojushinRyu Shop";
        const info = await mailer.sendMail({
            from: FROM_EMAIL, // Sender info
            to:ADMIN_EMAIL , // Admin's email address
            subject: `New Order Placed - Order #${orderId}`, // Subject line
            text: `A new order has been placed on your site.`, // Plain text body
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #4CAF50;">New Order Notification</h2>
                    <p>Hello Admin,</p>
                    <p>A new order has been placed on your website. Here are the details:</p>
                    
                    <h3 style="color: #4CAF50;">Order Details:</h3>
                    <p><strong>Order ID:</strong> ${orderId}</p>
                    <p><strong>Customer Name:</strong> ${customerName}</p>
                    <p><strong>Customer Email:</strong> <a href="mailto:${customerEmail}" style="color: #4CAF50;">${customerEmail}</a></p>

                    <h3 style="color: #4CAF50;">Items Ordered:</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                        <thead>
                            <tr>
                                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ddd;">Product</th>
                                <th style="text-align: left; padding: 8px; border-bottom: 2px solid #ddd;">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orderDetails.map(item => `
                                <tr>
                                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
                                    <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${item.price}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td style="padding: 8px; border-top: 2px solid #ddd; font-weight: bold;">Total Amount:</td>
                                <td style="padding: 8px; border-top: 2px solid #ddd; font-weight: bold;">$${totalAmount}</td>
                            </tr>
                        </tfoot>
                    </table>

                    <p>Please take the necessary steps to process this order.</p>
                    
                    <p style="margin-top: 20px;">Best regards,<br>The <strong>${shopName}</strong> Team</p>
                    
                    <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #777;">
                        This email is sent automatically. Please do not reply directly to this email.
                    </p>
                </div>
            `, // HTML body
        });

        console.log('Admin notification email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending admin notification email:', error);
    }
};


export async function sendOrderCancellationEmail({buyerEmail, orderId, orderDetails, refundStatus, cancellationReason, contactInfo,total}) {
    try {
        const shopName="GojushinRyu Shop";
        const info = await mailer.sendMail({
            from: FROM_EMAIL, // Sender info
            to: buyerEmail, // Buyer's email address
            subject: `Order Cancellation Notification - Order #${orderId}`, // Subject line
            text: `Your order has been canceled.`, // Plain text body
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #FF0000;">Order Cancellation Notification</h2>
                    <p>Dear Customer,</p>
                    <p>We regret to inform you that your order <strong>#${orderId}</strong> has been canceled. Below are the details of the canceled order:</p>
                    
                    <h3 style="color: #FF0000;">Order Details:</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${orderDetails.map(item => `
                            <li style="margin-bottom: 8px;">✔️ ${item.name} - $${item.price}</li>
                        `).join('')}
                    </ul>

                    <p><strong>Total Amount:</strong> $${total}</p>
                    
                    <h3 style="color: #FF0000;">Reason for Cancellation:</h3>
                    <p> <b>Cancel Reason:&nbsp;</b> ${cancellationReason}</p>

                    <p>${refundStatus  ? 'A full refund has been initiated and will be credited to your original payment method within 5-7 business days.' : 'No charges were made for this order.'}</p>

                    <p>If you have questions about this cancellation or need assistance with your refund, please don’t hesitate to contact us:</p>
                    <ul style="list-style: none; padding: 0;">
                        <li>📧 Email: <a href="mailto:${contactInfo.email}" style="color: #4CAF50;">${contactInfo.email}</a></li>
                        <li>📞 Phone: ${contactInfo.phone}</li>
                    </ul>
                    
                    <p style="margin-top: 20px;">We sincerely apologize for any inconvenience caused and appreciate your understanding.</p>
                    <p>Best regards,<br>The <strong>${shopName}</strong> Team</p>
                    
                    <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #777;">
                        This email is sent automatically. Please do not reply directly to this email.
                    </p>
                </div>
            `, // HTML body
        });

        console.log('Order cancellation email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending order cancellation email:', error);
    }
};