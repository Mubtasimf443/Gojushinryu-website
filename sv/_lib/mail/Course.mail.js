/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/


import { ADMIN_EMAIL, FROM_EMAIL } from "../utils/env.js"
import { mailer } from "../utils/mailer.js"
import { log } from "../utils/smallUtils.js"


export const course_purchase_user_email =async (to) => {
  try {
    await mailer.sendMail({
      from: FROM_EMAIL,
      to,
      subject: 'Course Buyed Successfully',
      text :'Thank You very much for boying course'
    }).then(() => {})
  } catch (error) {
    log({error})
  }
}


export const course_purchase_admin_email = async() => {
  try {
    await mailer.sendMail({
      from: FROM_EMAIL,
      to:ADMIN_EMAIL,
      subject: 'Course Purchase Happend',
      text :'A person Has Buyed Your Course,Please Visit Control Panal For Info'
    }).then(() => {})
  } catch (error) {
    log({error})
  }
  
}


export const product_purchase_event_happaned_user_email =async (to) => {
  try {
    await mailer.sendMail({
      from: FROM_EMAIL,
      to,
      subject: 'Your Order has Placed Order SuccessFully',
      text: 
      `You have place the order successfully. 

      Thank For buying Product From Goju Shin Ryu Shop`
    })
    .then(() => {})
    .catch(e => console.log(e))

  } catch (error) {
    
  }
 
}

export const product_purchase_event_happaned_amdin_email =async () => {
  try {
    await mailer.sendMail({
      from: FROM_EMAIL,
      to:ADMIN_EMAIL,
      subject: 'A product Purchase Happended',
      text: `A person buyed A product From GojuShinRyu Shop . Please Visit Control Panal To Check `
    })
    .then(() => {})
    .catch(e => console.log(e))
  } catch (error) {
    
  }
 
}









