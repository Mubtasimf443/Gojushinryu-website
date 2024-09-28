/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
*/ 

import {MAIL_USER, ADMIN_MAIL} from './env.js';
export const user_varification_user_mail = async ({to, otp}) => {
  if (!to.toString().includes('@')) return false
  if (!to.toString().includes('.')) return false
  try {
    let mailSend = mailer.sendMail({
    from :MAIL_USER,
    to,
    subject :'GojuShinRyu SignUp Otp',
    text : 'Recieve your Varification Otp Code',
    html : '<h3>Your Varication Code</h3> <br>'+
    '<p>Your Otp Varication Code is  '+ otp+' </p><br>',
})
  } catch (e) {
    console.log(e)
    return false
  }
}
export const user_sign_up_success_admin_mail = async e => {
     mailer.sendMail({
      from: MAIL_USER,
      to: ADMIN_MAIL,
      subject : 'A User Have Join ',
      text: 'A User Have Joined GojuShinRyu',
      html: '<h3>See User Details</h3> <br>'+ 'please Check User Details in your Control Panal'
    }).then(() => {return}).catch(e => {
      console.log(e)
    })
}
export const user_sign_up_success_user_mail = async ({to}) => {
  if (!to.toString().includes('@')) return false
  if (!to.toString().includes('.')) return false
  try {
    let mailSend = mailer.sendMail({
    from :MAIL_USER,
    to,
    subject :'Congratulation',
    text : 'Congratulation for Joining GojuShinRyu please Visit your Student Corner  ',
})
  } catch (e) {
    console.log(e)
    return false
  }
}
