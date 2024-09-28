/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
*/ 

let primaryBtn = document.querySelector('[primarybtn]')
let secondaryBtn = document.querySelector('[sbtn]');
const InpPrefik ='---inp--'


primaryBtn.addEventListener('click',  async(e) => {
  e.preventDefault();
  let firstname = document.getElementById(InpPrefik+'fn').value;
  let lastname = document.getElementById(InpPrefik+'ln').value;
  let email = document.getElementById(InpPrefik+'em').value;
  let country = document.getElementById(InpPrefik+'country').value
  let password = document.getElementById(InpPrefik+'ps').value
  let cpassword = document.getElementById(InpPrefik+'cps').value;
  let phone = document.getElementById(InpPrefik+'num').valueAsNumber;
  if (email.trim().length  < 5 || email.trim().length  > 36) return alert('email should be min 5 and max 36 characters ')
  if (password.trim().length  < 5 || password.trim().length  > 20) return alert(
    'password should be min 5 and max 20 characters'
  );
  if (firstname.trim().length < 3 || firstname.trim().length > 16 ) return alert('firstname should be min 3 and max 16 characters ') ;
  if (lastname.trim().length < 3 || lastname.trim().length > 16 ) return alert('last should be min 3 and max 16 characters ') ;
  if (country.trim().length < 4 || firstname.trim().length > 25 ) return alert('not a valid country') ;
  if ( typeof phone !== 'number' ) return alert('not valid number') ;
  if  (password !== cpassword) return alert('Password Do not match')
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
 if (error) return alert(error);
 if (success === true)  return window.location.replace('/auth/otp-varification')
  return alert('unknown Error')
})







