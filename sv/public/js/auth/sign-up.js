/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
*/ 

let primaryBtn = document.querySelector('[primarybtn]')
let secondaryBtn = document.querySelector('[sbtn]');
const InpPrefik ='---inp--'
let notice_text = document.querySelector('#notice_text');
function negativeNotice(text) {
  notice_text.style.color ='red';
  notice_text.style.fontSize='19px';
  notice_text.innerHTML=text;
  notice_text.style.textTransform='capitalize';
}




primaryBtn.addEventListener('click',  async(e) => {
  e.preventDefault();
  let firstname = document.getElementById(InpPrefik+'fn').value;
  let lastname = document.getElementById(InpPrefik+'ln').value;
  let email = document.getElementById(InpPrefik+'em').value;
  let country = document.getElementById(InpPrefik+'country').value
  let password = document.getElementById(InpPrefik+'ps').value
  let cpassword = document.getElementById(InpPrefik+'cps').value;
  let phone = document.getElementById(InpPrefik+'num').valueAsNumber;  
  if (email.trim().length  < 5 || email.trim().length  > 36) return negativeNotice('email should be min 5 and max 36 characters ')
  if (password.trim().length  < 5 || password.trim().length  > 20) return negativeNotice(
    'password should be min 5 and max 20 characters'
  );
  if (firstname.trim().length < 3 || firstname.trim().length > 16 ) return negativeNotice('firstname should be min 3 and max 16 characters ') ;
  if (lastname.trim().length < 3 || lastname.trim().length > 16 ) return negativeNotice('last should be min 3 and max 16 characters ') ;
  if (country.trim().length < 4 || firstname.trim().length > 25 ) return negativeNotice('not a valid country') ;
  if ( typeof phone !== 'number' ) return negativeNotice('not valid number') ;
  if  (password !== cpassword) return negativeNotice('Password Do not match')
  let jsonObj = JSON.stringify({
    firstname:firstname.toString(),
    lastname:lastname.toString(),
    email : email.toString(), 
    password : password.toString(),
    phone,
    country
  })
  primaryBtn.style.opacity=.7;
  primaryBtn.setAttribute('disabled','');
  let respose =await fetch(window.location.origin +'/api/auth-api/user/sign-up',{
    headers:{
        'Content-Type':'application/json',
    },
    method:'POST',
    body:jsonObj
  });
 respose =await respose.json();
 let {error,success} =respose;
 primaryBtn.style.opacity=.7;
 primaryBtn.removeAttribute('disabled');
 if (error) return negativeNotice(error);
 if (success === true)  return window.location.replace('/auth/otp-varification')
  return negativeNotice('unknown Error')
})






