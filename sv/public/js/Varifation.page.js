/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/
{
  
  var timerTime = 60;
  let timer = document.querySelectorAll('.vf-time')
  let inp_opt =document.getElementById('---inp--otp');
  var Varification_Success = false;
  
  
  (function TimerFunction() {
    timer.forEach(el => el.innerHTML = timerTime);
    if (timerTime <= 0) {
     let vf_timer_text= document.querySelector('.vf-timer-anchor');
      vf_timer_text.innerHTML = 'Time Is finished,You can not Varify,  Please Sign In again ';
      vf_timer_text.style.color = 'red';
      setTimeout(e => {
        window.location.replace('/sign-up')
      },4000) 
      return
    }
    if (Varification_Success) return
    setTimeout(e =>{
      timerTime--;
      TimerFunction()
    },1000)
  })();
}






