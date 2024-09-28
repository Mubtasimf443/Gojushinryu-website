/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
By his marcy,  I will gain success
*/
const course_purchase_user_email = (to) => {
  mailer.sendMail({
      from: MAIL_USER,
      to,
      subject: 'Course Buyed Successfully',
      html: `<h3>
       You purchasing the course Has Become Success Full
      </h3><br>
      <p>
        Thank You For  Purchasing The course
      </p>`
    })
    .then(() => {}).catch(e => console.log(e))
}
const course_purchase_admin_email = (to) => {
  mailer.sendMail({
      from: MAIL_USER,
      to:Admin,
      subject: 'Course Purchase Happend',
      text :'A person Has Buyed Your Course,Please Visit Control Panal For Info'
    })
    .then(() => {})
    .catch(e => console.log(e))
}
export const product_purchase_event_happaned_user_email = (to) => {
  mailer.sendMail({
      from: MAIL_USER,
      to,
      subject: 'Place Order SuccessFull',
      text: 'You have place the order successfully.' + `
      Thank For buying Product From Goju Shin Ryu Shop`
    })
    .then(() => {})
    .catch(e => console.log(e))

}

export const product_purchase_event_happaned_amdin_email = () => {
  mailer.sendMail({
      from: MAIL_USER,
      to,
      subject: 'A product Purchase Happended',
      text: `A person buyed A product From GojuShinRyu Shop . Please Visit Control Panal To Check `
    })
    .then(() => {})
    .catch(e => console.log(e))
}









