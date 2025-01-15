/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { log } from "string-player";
import { connectDB } from "./controllars/ConnectDb.js";
import catchError, { namedErrorCatching } from "./controllars/error.handle.js";
import request from "./controllars/fetch.js";
import { getSettings, setSettings, setSettingsAsArray, settingsAsArray } from "./controllars/settings.util.js";
import Facebook from "./controllars/media/facebook.js";
import { ADMIN_EMAIL, ADMIN_PHONE, FACEBOOK_APP_ID, FACEBOOK_APP_SECRET, FACEBOOK_REDIRECT_URI, FROM_EMAIL, LINKEDIN_KEY, LINKEDIN_REDIRECT_URI, LINKEDIN_SECRET, ORGANIZATION_NAME, TIKTOK_KEY, TIKTOK_REDIRECT_URI, TIKTOK_SECRET, WEBSITE_ORIGIN, YOUTUBE_KEY, YOUTUBE_REDIRECT_URI, YOUTUBE_SECRET } from "./env.js";
import {google} from 'googleapis'
import Linkedin from "./controllars/media/linkedin.js";
import Tiktok from "lib-tiktok-api";
import { ImageUrl } from "./controllars/imageUrl.js";
import express from 'express'
import { CourseEnrollments } from "./controllars/courseEnrollment.js";
import { mailer } from "./controllars/utils/mailer.js";
import { Settings } from "./controllars/settings.js";


export default  async function Main() {
    try {

        await updateYoutube();
        if ((new Date().getHours()) === 10 ) {
            await updateFacebook();
            await updateLinkedin();
            await updateTiktok();
        }

        await setSettingsAsArray({
            keys :["last_modification_date", "last_modification_date_as_date", "last_modification_date_as_Number", "last_modification_date_as_Day", 'last_modification_date_as_Hour', 'last_modification_date_as_minute'],
            values :[new Date().getDate(),new Date() , Date.now(),new Date().getDay(),new Date().getHours(), new Date().getMinutes()]
        });

    } catch (error) {
        console.error(error);
    }
}


async function updateYoutube() {
    try {
        let [status, token, refresh_token]=await settingsAsArray(['youtube_access_token_status', 'youtube_token' , 'youtube_refresh_token']);

        if (!status) throw 'their is no permision to post on youtube';
        
        let googleclient=new google.auth.OAuth2(YOUTUBE_KEY,YOUTUBE_SECRET,YOUTUBE_REDIRECT_URI);

        googleclient.setCredentials({
            access_token :token,
            refresh_token :refresh_token
        });
        let data=await googleclient.refreshAccessToken();
        if (data?.credentials?.access_token && data.credentials?.refresh_token) {
            await Settings.findOneAndUpdate({},{
                youtube_refresh_token:data.credentials.refresh_token,
                youtube_token:data?.credentials?.access_token,
                youtube_access_token_status :true
            })
            .then(e => log('youtube token updated at :'+( (new Date().getHours()  < 13) ? new Date().getHours()+ ' AM':(new Date().getHours()-12)+' PM' )));
            return ;
        } else if (data?.credentials?.access_token &&  !data.credentials?.refresh_token) {
            log('refresh token old is being use on youtube jobs')
            await Settings.findOneAndUpdate({},{
                youtube_refresh_token:refresh_token,
                youtube_token:data?.credentials?.access_token,
                youtube_access_token_status :true
            })
            .then(e => log('youtube token updated at '+(new Date().getHours()  < 13 ? new Date().getHours()+ ' AM':(new Date().getHours()-12)+' PM' ) ));
            return;
        } else if (!data?.credentials?.access_token &&  !data.credentials?.refresh_token) {
            log(data);
            throw {...data};
        };
    } catch (error) {
        async function deleteYoutube(error) {
            log(error);
            try {
                await Settings.findOneAndUpdate({},{
                    youtube_refresh_token:null,
                    youtube_token:null,
                    youtube_access_token_status :false
                })
                .then(e => log('youtube tokens deleted at'+log('youtube token updated at '+ (new Date().getHours()  < 13? new Date().getHours()+ ' AM':(new Date().getHours()-12)+' PM' )) ));
            } catch (error) {
                console.error(error);
            }
        }
        await deleteYoutube(error)
    }
}
async function updateTiktok(params) {
    try {
        let {access_token,refresh_token}=await Settings.findOne({}).then(
            function (set) {
                if (!set.tiktok_access_token_status) throw 'tiktok does not have a access token';
                if (!set.tiktok_access_token || !set.tiktok_refresh_token) throw 'tiktok does not have a access token or refresh_token';
                return {
                    refresh_token :set.tiktok_refresh_token,
                    access_token :set.tiktok_access_token
                }
            }
        )
        let tiktok=new Tiktok({
            key :TIKTOK_KEY,
            secret :TIKTOK_SECRET,
            redirect_uri :TIKTOK_REDIRECT_URI,
            scope :['user.info.basic','video.upload','video.publish']
        });
        let user =new tiktok.Account(access_token ,refresh_token);
        let data=await user.updateTokens({app_key :TIKTOK_KEY});
        if (data.message ==='success') {
            data =data.data;
            if (data.access_token && data.refresh_token  ) {
                let set =await getSettings();
                set.tiktok_access_token =data.access_token ;
                set.tiktok_refresh_token =data.refresh_token ;
                set.tiktok_access_token_status =true ;
                await set.save()
                log('tiktok tokens updated at ' +(new Date().getHours()  < 13? new Date().getHours()+ ' AM':(new Date().getHours()-12)+' PM' ));
                return;
            }
        }
        if (data.message ==='error') {
            if (data.data?.description && data.data?.error_code ) throw ({error : {code :data.data?.error_code ,description:data.data?.description  }});
            if (data.data?.description) throw ({error :{description  :data.data?.description }});
            if (data.data) throw ({error :{description  :data.data }});
            throw data;
        }
    } catch (error) {
        console.error(error);
        async function deleteTokens(params) {
            try {
                let set = await getSettings({});
                set.tiktok_access_token_status = false;
                set.tiktok_refresh_token = null;
                set.tiktok_access_token = null;
                await set.save();
                log(`tiktok tokens removed at ${(new Date().getHours() < 13 ? new Date().getHours() + ' AM' : (new Date().getHours() - 12) + ' PM')}`);
            } catch (error) {
                console.log(error);
            }
        }
        await deleteTokens();
    }
}
async function updateLinkedin(params) {
    try {
        let settings = await Settings.findOne({});
        if (!settings) throw 'their is no settings'
        if (!settings.linkedin_refresh_token || !settings.linkedin_access_token_status) namedErrorCatching('auth_error', 'there is no linkedin_refresh_token');

        let linkedin=new Linkedin({
            key:LINKEDIN_KEY,
            secret :LINKEDIN_SECRET,
            redirect_uri:LINKEDIN_REDIRECT_URI
        });
       
        let {access_token,refresh_token}=await linkedin.exchangeAccessToken(settings.linkedin_refresh_token);

        await Settings.findOneAndUpdate({}, {
            linkedin_access_token_status:true,
            linkedin_access_token :access_token,
            linkedin_refresh_token :refresh_token
        })
        .then(e => log('linkedin data updated at '+(new Date().getHours()  < 13? new Date().getHours()+ ' AM':(new Date().getHours()-12)+' PM' )))
        .catch(e => {throw 'linkedin error , bugs in linkedin.exchangeAccessToken'})
    } catch (error) {
        console.error(error);
        async function deleteLinkedinData(params) {
            await Settings.findOneAndUpdate({}, {
                linkedin_access_token :null,
                linkedin_access_token_status:false,
                linkedin_refresh_token :null,
                // linkedin_organization :null
            }).then(e => log('linkedin data deleted at' +(new Date().getHours()  < 13? new Date().getHours()+ ' AM':(new Date().getHours()-12)+' PM' )));
        }
        return ;
    }
}
async function updateFacebook() { 
    try {
        let [status, status_instagram, access_token, page_access_token, ig_id, page_id, user_id] = await settingsAsArray(['fb_access_token_status', 'instagram_access_token_status', 'fb_access_token', 'fb_page_access_token', 'instagram_user_id', 'fb_page_id', 'fb_user_id']);
        
        if (!access_token || !status) throw 'there is no access_token'
        let fb=new Facebook({
            client_id :FACEBOOK_APP_ID,
            client_secret :FACEBOOK_APP_SECRET,
            redirect_uri :FACEBOOK_REDIRECT_URI,
            scope :[]
        });
        let new__access_token=await fb.exchangeAccessToken(access_token);
        let new__user_id=await fb.getUserID(new__access_token);
        let new__P=await fb.getPages(new__user_id, new__access_token);
        let
            new_page_id = new__P.id,
            new__page_access_token = new__P.access_token;
        let P=new fb.Page({
            pageid :new_page_id,
            page_accessToken : new__page_access_token
        })
        let new__ig_id=await P.getLinkedInstagramAccounts();

        await Settings.findOneAndUpdate({}, {
            fb_access_token_status: true,
            instagram_access_token_status: true,
            fb_access_token: new__access_token,
            fb_page_access_token: new__page_access_token,
            fb_page_id: new_page_id,
            fb_user_id: new__user_id,
            instagram_user_id: new__ig_id,
            instagram_token: new__access_token
        })
        .then(e => log('facebook tokens updated at ' +  (new Date().getHours()  < 13? new Date().getHours()+ ' AM':(new Date().getHours()-12)+' PM' )));

    } catch (error) {
        console.error(error);
        async function deleteFacebook(params) {
            try {
                let settings=await Settings.findOneAndUpdate({}, {
                    fb_access_token_status :false ,
                    instagram_access_token_status :false,
                    fb_access_token :null,
                    fb_page_access_token :null ,
                    fb_page_id :null,
                    fb_user_id :null,
                    instagram_user_id :null,
                    instagram_token :null
                })
                .then(e => log('facebook tokens and data are removed at '+(new Date().getHours()  < 13? new Date().getHours()+ ' AM':(new Date().getHours()-12)+' PM' )))
                
            } catch (error) {
                console.error(error);
            }
        }
        await deleteFacebook();
    }
}

export async function deleteImageUrlsAfter24Hour(req=express.request,res=express.response){
    try {
        res.sendStatus(204);
        let urls = await ImageUrl.find({});
        for (let i = 0; i < urls.length; i++) {
            const id = urls[i].id;
            if ((Date.now() - id)  > (24 *60*60*1000)) {
                await ImageUrl.findByIdAndDelete(urls[i]._id)
                .then(el => console.log('deleted image url id is ' + el._id))
                .catch(el => console.error(el));
            }
        }
    } catch (error) {
        console.error(error);
    }
}

/* Course Enrollment jobs */


export async function requestCourseEnrollMentPayment(req=express.request,res=express.response) {
    try {
        let studentData = [];
        res.sendStatus(202);
        async function sendPaymentRequest(student = { email: undefined, name: undefined }, paymentLink , dueDate) {
            try {
                const info = await mailer.sendMail({
                    from: FROM_EMAIL, // Sender info
                    to: student.email, // Student's email address
                    subject: `Monthly Fee Payment Request - Due by ${dueDate}`, // Subject line
                    text: `Your monthly fee payment is due.`, // Plain text body
                    html: `
                            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                                <h2 style="color: #4CAF50;">Monthly Fee Payment Request</h2>
                                <p>Dear ${student.name},</p>
                                <p>We hope this message finds you well and you’re enjoying your journey in martial arts training at <strong>${ORGANIZATION_NAME}</strong>.</p>
                                <p>This is a gentle reminder that your monthly training fee is due by <strong>${dueDate}</strong>. Please use the link below to complete your payment:</p>
                                
                                <div style="margin: 20px 0; text-align: center;">
                                    <a href="${paymentLink}" style="background-color: #4CAF50; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                                        Pay Now
                                    </a>
                                </div>
            
                                <p>We value your commitment to your training and look forward to seeing your continued progress.</p>
                                
                                <p>If you have any questions or face any difficulties making the payment, feel free to contact us:</p>
                                <ul style="list-style: none; padding: 0;">
                                    <li>📧 Email: <a href="mailto:${ADMIN_EMAIL}" style="color: #4CAF50;">${ADMIN_EMAIL}</a></li>
                                    <li>📞 Phone:${ADMIN_PHONE}</li>
                                </ul>
            
                                <p>Thank you for being a part of our martial arts family!</p>
                                
                                <p>Best regards,<br>The <strong>${ORGANIZATION_NAME}</strong> Team</p>
                            </div>
                        `, // HTML body
                });
                // console.log('Monthly fee request email sent:', info.messageId);
            } catch (error) {
                console.error('Error sending monthly fee request email:');
                console.error(error);
            }
        }
        async function sendAdminNotification(studentsData =studentData) {
            try {
                let month =new Date().toLocaleString('default', { month: 'long' });
                let year = new Date().getFullYear();
                const tableRows = studentsData
                .map(student => `
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">#${student.id}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${student.name}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${student.email}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${student.courseName}</td>
                        <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">$${student.totalFees.toFixed(2)}</td>
                    </tr>
                `)
                .join('');
    
            const info = await mailer.sendMail({
                from: FROM_EMAIL, // Sender info
                to: ADMIN_EMAIL, // Admin's email address
                subject: `Monthly Payment Request Summary - ${month} ${year}`, // Subject line
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <h2 style="color: #4CAF50;">Monthly Payment Request Summary</h2>
                        <p>Dear Admin,</p>
                        <p>This is to inform you that payment request emails for <strong>${month} ${year}</strong> have been successfully sent to the following students:</p>
                        
                        <table style="border-collapse: collapse; width: 100%; margin-top: 20px; font-size: 14px;">
                            <thead>
                                <tr style="background-color: #f2f2f2;">
                                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">EnrollMent Id</th>
                                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Student Name</th>
                                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Email</th>
                                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Course Name</th>
                                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Total Fees</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
    
                        <p><strong>Total Students Notified:</strong> ${studentsData.length}</p>
    
                        <p>If you have any questions or require further details, please contact us:</p>
                        <ul style="list-style: none; padding: 0;">
                            <li>📧 Email: <a href="mailto:${ADMIN_EMAIL}" style="color: #4CAF50;">${ADMIN_EMAIL}</a></li>
                            <li>📞 Phone:${ADMIN_PHONE}</li>
                        </ul>
    
                        <p>Thank you for ensuring the smooth operation of our systems.</p>
                        
                        <p>Best regards,<br>The <strong>${ORGANIZATION_NAME}</strong> Automation Team</p>
                    </div>
                `, // HTML body
            });
    
                console.log('Admin notification email sent:', info.messageId);
            } catch (error) {
                console.error('Error sending admin notification email:' );
                console.error( error);
            }
        };
        let ernollments=await CourseEnrollments.find().where('activated').equals('true');
        let settings=await Settings.findOne({});
        if (ernollments.length===0) return;
        for (let i = 0; i < ernollments.length; i++) {
            let element = ernollments[i];

            let id = (new Date().getMonth() < 9 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + "-" + new Date().getFullYear()
           
            let existIndex= element.paymentsData.findIndex(function (element) {
                if (element.id ===id) return element;
            });
            if (existIndex === -1) {
                element.paymentsData.push({
                    id:id ,
                    month : new Date().toLocaleString('default', { month: 'long' }) ,
                    Year : new Date().getFullYear(),
                    date : new Date().getDate(),
                    paid: false,
                    payment_date :null,
                    paidAmount : null,
                    lastPaymentRequestSendDate :Date.now()
                });
                element.paymentThisMonth ={
                    isPaid :false
                }
                element = await element.save();
                let student ={ email: element.student_email, name: element.student_name };
                let current=new Date();
                let dueDate=new Date(current.getFullYear(), current.getMonth() , 10).toDateString();
                let paymentLink = WEBSITE_ORIGIN + '/api/api_s/course/enrollments/payment/this-month?id=' + element.id;
                await sendPaymentRequest(student, paymentLink, dueDate);
                console.log('This Month Payment Request Is Send To the user name :'+ element.student_name);
                studentData.push({
                    id : element.id,
                    name: element.student_name,
                    email: element.student_email,
                    courseName :element.course_name,
                    totalFees: element.course_price + (element.course_price * (settings.gst_rate / 100)),
                });
            }
            if (existIndex !== -1) {
                if (element.paymentsData[existIndex].paid === false && (Date.now() - element.paymentsData[existIndex].lastPaymentRequestSendDate) > (3 * 24 * 60 * 60 * 1000)) {
                    let student ={ email: element.student_email, name: element.student_name };
                    let current=new Date();
                    let dueDate=new Date(current.getFullYear(), current.getMonth() , 10).toDateString();
                    let paymentLink = WEBSITE_ORIGIN + '/api/api_s/course/enrollments/payment/this-month?id=' + element.id;
                    await sendPaymentRequest(student, paymentLink, dueDate);
                    element.paymentsData[existIndex].lastPaymentRequestSendDate = Date.now();
                    element.paymentThisMonth ={
                        isPaid :false
                    }
                    await element.save();
                    console.log('this month payment request is done at ' + new Date(Date.now()).toLocaleString());
                    studentData.push({
                        id: element.id,
                        name: element.student_name,
                        email: element.student_email,
                        courseName: element.course_name,
                        totalFees: element.course_price + (element.course_price * (settings.gst_rate / 100)),
                    });
                } else {
                    console.log('this month payment request is done at '+ new Date(element.paymentsData[existIndex].lastPaymentRequestSendDate).toLocaleString() );
                }
            }
        }
        studentData.length !== 0 && await sendAdminNotification(studentData);
    } catch (error) {
        console.error(error);
    }
}

export async function notifyAboutNotPaidStudents(req=express.request,res=express.response) {
    try {
        res.sendStatus(202);
        let studentData = [];
        let settings=await Settings.findOne({});
        let ernollments=await CourseEnrollments.find().where('activated').equals('true');
        for (let i = 0; i < ernollments.length; i++) {
            let element = ernollments[i];
            let id = (new Date().getMonth() < 9 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) + "-" + new Date().getFullYear()
            let existIndex= element.paymentsData.findIndex(function (element) {
                if (element.id ===id) return element;
            });
            if (existIndex !== -1) {
                if(element.paymentsData[existIndex].paid === false) {
                    studentData.push({
                        id :element.id,
                        name :element.student_name,
                        email :element.student_email,
                        courseName :element.course_name,
                        totalFees : element.course_price + (element.course_price * (settings.gst_rate / 100))
                    })
                } 
            }
        }
        const sendUnpaidFeesNotification = async ( unpaidStudents) => {
            try {
                // Generate table rows dynamically based on unpaid student data

                let month =new Date().toLocaleString('default', { month: 'long' });
                let year = new Date().getFullYear();
                const tableRows = unpaidStudents
                    .map(student => `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">#${student.id}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${student.name}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${student.email}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${student.courseName}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">$${student.totalFees.toFixed(2)}</td>
                        </tr>
                    `)
                    .join('');
        
                const info = await mailer.sendMail({
                    from: FROM_EMAIL, // Sender info
                    to: ADMIN_EMAIL, // Admin's email address
                    subject: `Unpaid Fees Report - ${month} ${year}`, // Subject line
                    html: `
                        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                            <h2 style="color: #FF5722;">Unpaid Fees Report</h2>
                            <p>Dear Admin,</p>
                            <p>The following students have not completed their fee payments for <strong>${month} ${year}</strong>. Please take the necessary actions:</p>
                            
                            <table style="border-collapse: collapse; width: 100%; margin-top: 20px; font-size: 14px;">
                                <thead>
                                    <tr style="background-color: #f2f2f2;">
                                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">EnrollMent Id</th>
                                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Student Name</th>
                                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Email</th>
                                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Course Name</th>
                                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Total Fees</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${tableRows}
                                </tbody>
                            </table>
        
                            <p><strong>Total Unpaid Students:</strong> ${unpaidStudents.length}</p>
        
                            <p>If you have any questions or require further assistance, feel free to contact us:</p>
                            <ul style="list-style: none; padding: 0;">
                                <li>📧 Email: <a href="mailto:support@yourmartialarts.com" style="color: #4CAF50;">support@yourmartialarts.com</a></li>
                                <li>📞 Phone: +1-800-123-4567</li>
                            </ul>
        
                            <p>Thank you for keeping track of student payments.</p>
                            
                            <p>Best regards,<br>The <strong>Your Martial Arts School</strong> Automation Team</p>
                        </div>
                    `, // HTML body
                });
        
                console.log('Unpaid fees notification email sent:', info.messageId);
            } catch (error) {
                console.error('Error sending unpaid fees notification email:', error);
            }
        };
        

        
        studentData.length !== 0 && await sendUnpaidFeesNotification(studentData);
        
    } catch (error) {
        console.error(error);
    }
}