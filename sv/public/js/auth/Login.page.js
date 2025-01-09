/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/

{
  let em = document.getElementById('---inp--em');//email
  let ps = document.getElementById('---inp--ps');//password
  let loginBtn = document.getElementById('login');
  let notice_text = document.querySelector('#notice_text');
  function negativeNotice(text) {
    notice_text.style.color = 'red';
    notice_text.style.fontSize = '19px';
    notice_text.innerHTML = text;
    notice_text.style.textTransform = 'capitalize';
  }

  var btnActive = true
  loginBtn.addEventListener('click', async (e) => {
    ;
    e.preventDefault();
    if (!btnActive) return negativeNotice(btnActive)

    let email = em.value;
    let password = ps.value;

    if (!email) return negativeNotice('email is not  define')
    if (email.trim().length < 5 || email.trim().length > 36) return negativeNotice('email is not valid');
    if (!email.toString().includes('@')) return negativeNotice('email is not valid');
    if (!email.toString().includes('.')) return negativeNotice('email is not valid');
    if (email.toString().includes('"')) return negativeNotice('email is not valid');
    if (email.toString().includes("'")) return negativeNotice('email is not valid');
    if (email.toString().includes('{')) return negativeNotice('email is not valid');
    if (email.toString().includes('}')) return negativeNotice('email is not valid');

    if (!password) return negativeNotice('password is not define');
    if (password.trim().length < 4 || password.trim().length > 25) return negativeNotice('password is not valid');
    if (password.toString().includes('"')) return negativeNotice('password is not valid');
    if (password.toString().includes("'")) return negativeNotice('password is not valid');
    if (password.toString().includes('{')) return negativeNotice('password is not valid');
    if (password.toString().includes('}')) return negativeNotice('password is not valid');

    loginBtn.style.opacity = .7;
    loginBtn.setAttribute('disabled', '')
    let jsonObj = await JSON.stringify({ email, password });
    btnActive = false;
    setTimeout(() => btnActive = true, 5000);//throtlin
    
    try {
      let response = await fetch(window.location.origin + '/api/auth-api/user/sign-in', {
        method: "POST",
        body: jsonObj,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      let { error, success } = await response.json();
      btnActive = true;
      loginBtn.style.opacity = 1;
      loginBtn.removeAttribute('disabled');
      if (error) return negativeNotice(error);
      if (success) { 
        if (redirectToMembershipPage === true && membership_type === 'gojushinryu') return window.location.assign('/membership-application/goju-shin-ryu');
        if (redirectToMembershipPage === true  ) return window.location.assign('/membership-application/school-of-traditional-martial-arts');
        if (redirectToCoursePage === true) return window.location.assign('/courses');
        if (redirectToCheckoutPage === true) return window.location.assign('/shop/checkout');
        return window.location.replace('/accounts/student');
      }
    } catch (error) {
      btnActive = true;
      loginBtn.style.opacity = 1;
      loginBtn.removeAttribute('disabled');
      console.log(error);
    }
  })

}


document.getElementById('sign-up-btn').onclick = function (event) {
  event.preventDefault();
  if (redirectToMembershipPage === true && membership_type === 'gojushinryu') return window.location.assign('/auth/sign-up?forwardto=membership_page&membership_type=gojushinryu');
  if (redirectToMembershipPage === true) return window.location.assign('/auth/sign-up?forwardto=membership_page');
  if (redirectToCoursePage === true) return window.location.assign('/auth/sign-up?forwardto=course_page');
  if (redirectToCheckoutPage === true) return window.location.assign('/auth/sign-up?forwardto=checkout_page');
  window.location.assign('/auth/sign-up')
}