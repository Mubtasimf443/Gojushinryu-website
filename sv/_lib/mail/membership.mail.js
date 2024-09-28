/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah 
*/


const membership_success_user_email = (to,family) => {
  mailer.sendMail({
    from: MAIL_USER,
    to,
    subject: 'Congratulations for becoming a Member',
    text: `Well come to the family Of ${family} members`,
    html:`<h3>
     Congratulations
    </h3>
    <p>
      Well come to the family Of ${family} members
    </p>`
  })
  .then(()=> {}).catch(e => console.log(e))
}


const Membership_success_admin_email = (family) => {
  mailer.sendMail({
    from: MAIL_USER,
    to:ADMIN_Email, 
    subject: 'Membeship Happened',
    text: `An Member Added to ${family}`,
    html: `<h2>
    Congratulations
    </h2>
    <p>
      A Oerson Buyed the Membership,  Please Check The control Panal 
    </p>
    `
  })
}






