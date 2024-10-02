/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { ADMIN_EMAIL, FROM_EMAIL } from "../utils/env.js";
import { mailer } from "../utils/mailer.js";
import { log } from "../utils/smallUtils.js";

export async function Contact_us_api_Function(req,res) {
    log('contact')
    let {first_name , last_name ,email,phone,location,subject , massage} = req.body;
    if (!email || !last_name || !first_name || !location || !phone || !subject || !massage  ) return res.json({error:'Please Fill all the fields'})
    if ( typeof phone !=='number' ) return res.json({error:'Phone Number is Not Valid'})
    if (typeof email  !== 'string' || typeof last_name !== 'string'  ||typeof first_name!== 'string'  ||typeof location !=='string'  ||typeof subject!== 'string'   ||typeof massage !== 'string' ) return res.json({error:'Please Fill all the fields'})
    if ( first_name.length <3 ||  last_name.length <3 ) return res.json({error:'Name is Very Small'});
    if ( first_name.length >10 ||  last_name.length >10 ) return res.json({error:'Name is Very large'});
    if ( email.length <6 ||  email.length >45 ) return res.json({error:'email is not valid'});
    if ( location.length <12 ||  location.length >80 ) return res.json({error:'Location Does not fit'});
    if ( subject.length <12 ||  subject.length >100 ) return res.json({error:'subject Does not fit'});
    if ( massage.length <50  ) return res.json({error:'massage is Very Small'});
    if (  massage.length >1200 ) return res.json({error:'massage is Very large'});
    let newArray = [first_name , last_name ,email,phone,location,subject , massage]; 
    mailer.sendMail({
      from:FROM_EMAIL,
      to:newArray[2],
      subject:'Thanks ',
      html :`<div style=" padding: auto;
          margin: auto;
           width: fit-content; 
           padding: 2em 7px;
           width: 100%;
           flex-wrap: wrap;" >
            <h3 style="  color: #000;
              font-size: 18.6px;
              font-weight: 600;
              margin-bottom: 5px;
              text-transform: uppercase;
              font-family: Arial, Helvetica, sans-serif;">            
            Thanks For Contacting Us      
              </h3>
                 <p  class="main_text"  style=" width: 15px;
                  color: #666;
                  width: 450px;width: 450px;
                  text-wrap: wrap;
                  font-family: Arial, Helvetica, sans-serif; "  >
       Thanks For Contacting us A lot
             </p>
                <div  class="main_text"  style=" width: 17px;
                  color: rgb(235, 164, 34);
                  font-weight: 500;
                  display: flex;
                  flex-direction: row;
                  justify-content: left;
                  align-items: start;
                  column-gap: 2px;
                  text-transform: capitalize;
                  font-family: Arial, Helvetica, sans-serif;"  >
               Admin Is inform About Your Massage
              </div>
           </div>
           `
    })
     .then(e => 
      mailer.sendMail({
          from :FROM_EMAIL,
          to:ADMIN_EMAIL,
          subject :`${newArray[0]}  ${newArray[1]} wants to contact you`,
          html:
          `<div style=" padding: auto;
          margin: auto;
           width: fit-content; 
           padding: 2em 7px;
           width: 100%;
           flex-wrap: wrap;" >
              
              <h3 style="  color: #000;
              font-size: 20px;
              font-weight: 600;
              margin-bottom: 5px;
              text-transform: uppercase;
              font-family: Arial, Helvetica, sans-serif;">
              
              Info
              
              </h3>
              <div  class="main_text"  style=" width: 17px;
                  color: rgb(235, 164, 34);
                  font-weight: 500;
                  display: flex;
                  flex-direction: row;
                  justify-content: left;
                  align-items: start;
                  column-gap: 2px;
                  text-transform: capitalize;
                  font-family: Arial, Helvetica, sans-serif;"  >
                  Name
              </div>
      
             <p  class="main_text"  style=" width: 15px;
                  color: #666;
                  width: 450px;
                  text-wrap: wrap;
                  font-family: Arial, Helvetica, sans-serif; "  >
             ${newArray[0] + ' ' + newArray[1]} 
             </p>
              <div  class="main_text"  style=" width: 17px;
                  color: rgb(235, 164, 34);
                  font-weight: 500;
                  display: flex;
                  flex-direction: row;
                  justify-content: left;
                  align-items: start;
                  column-gap: 2px;
                  text-transform: capitalize;
                  font-family: Arial, Helvetica, sans-serif;"  >
                 Subject
              </div>
             <p  class="main_text"  style=" width: 15px;
                  color: #666;
                  width: 450px;
                  text-wrap: wrap;
                  font-family: Arial, Helvetica, sans-serif; "  >
             ${newArray[5]} 
             </p>
             <div  class="main_text"  style=" width: 17px;
                  color: rgb(235, 164, 34);
                  font-weight: 500;
                  display: flex;
                  flex-direction: row;
                  justify-content: left;
                  align-items: start;
                  column-gap: 2px;
                  text-transform: capitalize;
                  font-family: Arial, Helvetica, sans-serif;"  >
                Email
              </div>
             <p  class="main_text"  style=" width: 15px;
                  color: #666;
                  width: 450px;
                  text-wrap: wrap;
                  font-family: Arial, Helvetica, sans-serif; "  >
             ${newArray[2]} 
             </p>
              <div  class="main_text"  style=" width: 17px;
                  color: rgb(235, 164, 34);
                  font-weight: 500;
                  display: flex;
                  flex-direction: row;
                  justify-content: left;
                  align-items: start;
                  column-gap: 2px;
                  text-transform: capitalize;
                  font-family: Arial, Helvetica, sans-serif;"  >
                Phone
              </div>
             <p  class="main_text"  style=" width: 15px;
                  color: #666;
                  width: 450px;
                  text-wrap: wrap;
                  font-family: Arial, Helvetica, sans-serif; "  >
             ${newArray[3]} 
             </p>
              <div  class="main_text"  style=" width: 17px;
                  color: rgb(235, 164, 34);
                  font-weight: 500;
                  display: flex;
                  flex-direction: row;
                  justify-content: left;
                  align-items: start;
                  column-gap: 2px;
                  text-transform: capitalize;
                  font-family: Arial, Helvetica, sans-serif;"  >
                Location
              </div>
             <p  class="main_text"  style=" width: 15px;
                  color: #666;
                  width: 450px;
                  text-wrap: wrap;
                  font-family: Arial, Helvetica, sans-serif; "  >
             ${newArray[4]} 
             </p>
              <div  class="main_text"  style=" width: 17px;
                  color: rgb(235, 164, 34);
                  font-weight: 500;
                  display: flex;
                  flex-direction: row;
                  justify-content: left;
                  align-items: start;
                  column-gap: 2px;
                  text-transform: capitalize;
                  font-family: Arial, Helvetica, sans-serif;"  >
                Massage
              </div>
             <p  class="main_text"  style=" width: 15px;
                  color: #666;
                  width: 450px;
                  text-wrap: wrap;
                  font-family: Arial, Helvetica, sans-serif; "  >
             ${newArray[6]} 
             </p>
          </div>`
         })
     )
     .then(e => {
      res.json({success:true})
     })
     .catch(e => {
      log(e);
      res.json({error:'Unknown error,Is you email Correct?'})
     })
}