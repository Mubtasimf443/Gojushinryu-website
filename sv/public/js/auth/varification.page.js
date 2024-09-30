/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/
{
  
  var timerTime = 60;
  let timer = document.querySelectorAll('.vf-time')
  let inp_opt =document.getElementById('---inp--otp');
  var Varification_Success = false;
  let vfbTN =document.querySelector('.vf-btn');
  
  (function TimerFunction() {
    timer.forEach(el => el.innerHTML = timerTime);
    if (timerTime <= 0) {
     let vf_timer_text= document.querySelector('.vf-timer-anchor');
      vf_timer_text.innerHTML = 'Time Is finished,You can not Varify,  Please Sign In again ';
      vf_timer_text.style.color = 'red';
      setTimeout(e => {
        window.location.replace('/auth/sign-up')
      },4000) 
      return
    }
    if (Varification_Success) return
    setTimeout(e =>{
      timerTime--;
      TimerFunction()
    },1000)
  })();

  vfbTN.addEventListener('click',e => {
    e.preventDefault();
    if (inp_opt.value.toString() === '') { 
      alert('code is not valid');
      return
    }
    let code =inp_opt.valueAsNumber;
    if (typeof code !== 'number') { 
      alert('code is not valid');
      return
    };
    if (code <99999 || code >999999) {
      alert('code is not valid');
      return 
    };
    let jsonObj=JSON.stringify({
      code
    });    
    vfbTN.style.opacity=.6;
    vfbTN.style.transition='all 1s ease';
    vfbTN.setAttribute('disabled','');
    fetch(window.location.origin +'/api/auth-api/user/sign-up-otp-varification',{
      method:"POST",
      headers:{
        'Content-Type':"application/json"
      },
      body:jsonObj
    }).then(async data=> {
      let {error,success} =await data.json();
      vfbTN.removeAttribute('disabled');
      vfbTN.style.opacity=1;
      if (error) return alert(error);
      if (success) return window.location.replace('/accounts/student')
    }).catch(e => {
      vfbTN.removeAttribute('disabled');
      vfbTN.style.opacity=1;
    })
   
  });

}





