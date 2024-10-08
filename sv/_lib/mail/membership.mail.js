/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
*/

import { User } from "../models/user.js"
import { ADMIN_EMAIL, FROM_EMAIL } from "../utils/env.js"
import { mailer } from "../utils/mailer.js"
import { log } from "../utils/smallUtils.js"
import {returnMailh2,  returnMailParagraph, returnMailTD2, returnMailTH2 } from "./components.js"




export const membership_success_Admin_email = (userInfo) => {
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
}


export const Membership_success_user_email = (to) => {
  mailer.sendMail({
    from: FROM_EMAIL,
    to, 
    subject:  'Congratulations for becoming a Member',
    html: `
    <div style="min-width:  fit-content;background-color:white;`+
     //display: flex;flex-direction: column;justify-content: flex-start;align-items: center;flex-wrap: wrap;
    ` margin: 0px;padding: 35px 1em;row-gap: 12px;box-sizing: border-box;min-height: fit-content;">


     `

     + returnMailh2('Thanks For Becoming a Member')
     +
     returnMailParagraph('Wellcome to the family of Our Membership')
     +
     
     `</div>`
  }).then(e =>console.log('//mail send to user'))
}





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



