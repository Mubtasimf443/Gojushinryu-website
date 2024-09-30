/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/

{
    let em = document.getElementById('---inp--em');//email
    let ps = document.getElementById('---inp--ps');//password
    let loginBtn=document.getElementById('login');
    let notice_text = document.querySelector('#notice_text');
    function negativeNotice(text) {
    notice_text.style.color ='red';
    notice_text.style.fontSize='19px';
    notice_text.innerHTML=text;
    notice_text.style.textTransform='capitalize';
    }
    var btnActive =true
    loginBtn.addEventListener('click',async(e) => {;
      e.preventDefault();
      if (!btnActive) return negativeNotice(btnActive)
      
      let email =em.value ;
      let password=ps.value;
      if (!password) return negativeNotice('password is not define')
      if (!email) return negativeNotice('email is not  define')
      if (email.trim().length < 5 || email.trim().length > 36) return negativeNotice('email is not valid');
      if (password.trim().length < 4 || password.trim().length > 25) return negativeNotice('email is not valid');
      if (!email.toString().includes('@')) return negativeNotice('email is not valid')
      if (!email.toString().includes('.')) return negativeNotice('email is not valid');
      if (email.toString().includes('"')) return negativeNotice('email is not valid')
    if (email.toString().includes("'")) return negativeNotice('email is not valid')
    if (email.toString().includes('{')) return negativeNotice('email is not valid')
    if (email.toString().includes('}')) return negativeNotice('email is not valid')
    if (password.toString().includes('"')) return negativeNotice('password is not valid')
    if (password.toString().includes("'")) return negativeNotice('password is not valid')
    if (password.toString().includes('{')) return negativeNotice('password is not valid')
    if (password.toString().includes('}')) return negativeNotice('password is not valid')
    loginBtn.style.opacity=.7;
    loginBtn.setAttribute('disabled','')
    let jsonObj =await JSON.stringify({email,password  });
    btnActive=false;
     
      setTimeout(() => {
        btnActive =true;//throtlin
      }, 5000);
    try {
      
    
    let response =await fetch(window.location.origin + '/api/auth-api/gm/sign-in',{
    method:"POST",
    body :jsonObj,
    headers:{
      'Content-Type':'application/json'
    }
    });
    let {error,success}=await response.json();
    btnActive=true;
    loginBtn.style.opacity=1;
    loginBtn.removeAttribute('disabled');
    if (error ) return negativeNotice(error);
    if (success) return window.location.replace('/accounts/student');
  } catch (error) {
    btnActive=true;
    loginBtn.style.opacity=1;
    loginBtn.removeAttribute('disabled');
    console.log(error);
    
  }
    })
  
  }