/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/
{

  var timerTime = 60;
  let timer = document.querySelectorAll('.vf-time')
  let inp_opt = document.getElementById('---inp--otp');
  var Varification_Success = false;
  let vfbTN = document.querySelector('.vf-btn');

  (function TimerFunction() {
    timer.forEach(el => el.innerHTML = timerTime);
    if (timerTime <= 0) {
      let vf_timer_text = document.querySelector('.vf-timer-anchor');
      vf_timer_text.innerHTML = 'Time Is finished,You can not Varify,  Please Sign In again ';
      vf_timer_text.style.color = 'red';
      setTimeout(e => {
        window.location.replace('/auth/sign-up')
      }, 4000)
      return
    }
    if (Varification_Success) return
    setTimeout(e => {
      timerTime--;
      TimerFunction()
    }, 1000)
  })();


  
  vfbTN.addEventListener('click', e => {
    e.preventDefault();
    let value = Number(inp_opt.value);
    if (value.toString() === 'NaN') {
      alert('code is not valid');
      return
    }
    if (value < 99999 || value > 999999) {
      alert('code is not valid');
      return
    };
    let jsonObj = JSON.stringify({
      code: value
    });

    vfbTN.style.transition = 'all 1s ease';
    vfbTN.style.opacity = .6;
    fetch(window.location.origin + '/api/auth-api/user/sign-up-otp-varification', {
      method: "POST",
      headers: {
        'Content-Type': "application/json"
      },
      body: jsonObj
    })
      .then(async data => {
        let { error, success } = await data.json();
        vfbTN.removeAttribute('disabled');
        vfbTN.style.opacity = 1;
        if (error) return alert(error);
        if (success) {
          if (redirectToMembershipPage === 'true' && membership_type === 'gojushinryu') return window.location.assign('/membership-application/goju-shin-ryu');
          if (redirectToMembershipPage === 'true'  ) return window.location.assign('/membership-application/school-of-traditional-martial-arts');
          if (redirectToCoursePage === 'true') return window.location.assign('/courses');
          if (redirectToCheckoutPage === 'true') return window.location.assign('/shop/checkout');
          return window.location.replace('/accounts/student');
        }
      })
      .catch(e => {
        vfbTN.removeAttribute('disabled');
        vfbTN.style.opacity = 1;
      })
      .finally(e => vfbTN.style.opacity = 1)
  });

}





