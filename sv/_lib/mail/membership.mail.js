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



