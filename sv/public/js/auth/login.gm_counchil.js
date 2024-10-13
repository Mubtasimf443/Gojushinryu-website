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
    loginBtn.addEventListener('click',async(e) => {
      e.preventDefault();
      if (!btnActive) return negativeNotice(btnActive)
      let email =v(`[id="---inp--em"]`) ;
      let password=v(`[id="---inp--ps"]`);
      loginBtn.style.opacity=.7;
      loginBtn.setAttribute('disabled','')
      btnActive=false;
      try {
        let response =await fetch(window.location.origin + '/api/auth-api/gm/sign-in',{
          method:"POST",
          body :JSON.stringify({ email, password}),
          headers:{
            'Content-Type':'application/json'
          }});
          let {error,success}=await response.json();
          if (error ) return negativeNotice(error);
          if (success) return window.location.reload();
      } catch (error) {
        console.log(error);
      } finally {
        btnActive=true;
        loginBtn.style.opacity=1;
        loginBtn.removeAttribute('disabled');
      }
  })
  



//function
function v(htmlElementSelector) {
  let simbolerror='You can not use <,>,{,},[,],",,$'+ "`," + '"' ;
  let el=document.querySelector(htmlElementSelector);
  if (!el) throw new Error(`can not find using ${htmlElementSelector}`);
  let value=el.value;
  if (!value) {
      el.style.outline='2px solid red';
      throw new Error(simbolerror);
  }
  if (value.includes('<')) {
      el.style.outline='2px solid red';
      throw new Error(simbolerror);
  }
  if (value.includes('>')) {
      el.style.outline='2px solid red';
      throw new Error(simbolerror);
  }
  if (value.includes("'")) {
      el.style.outline='2px solid red';
      throw new Error(simbolerror);
  }
  if (value.includes('"')) {
      el.style.outline='2px solid red';
      throw new Error(simbolerror);
  }
  if (value.includes('`')) {
      el.style.outline='2px solid red';
      throw new Error(simbolerror);
  }if (value.includes('{')) {
      el.style.outline='2px solid red';
      throw new Error(simbolerror);
  }if (value.includes('}')) {
      el.style.outline='2px solid red';
      throw new Error(simbolerror);
  }
  if (value.includes('[')) {
      el.style.outline='2px solid red';
      throw new Error(simbolerror);
  }if (value.includes(']')) {
      el.style.outline='2px solid red';
      throw new Error(simbolerror);
  }
  return value
}


document.querySelectorAll('input').forEach(el => el.addEventListener('keydown', e => e.target.style.outline='none'))



  }
