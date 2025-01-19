/* 
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
Insha Allah,  By Allahs Marcy,  I willearn success
*/






/*----------- form scope ----------*/
{
  /*----------- global scope ----------*/
  var formStatus = 1;
  let coupon = '', 
  isValidCoupon = false;

  //variables 
  let processingPayment = false;

  /*----------- heading section ----------*/
  let headingSection = document.querySelector('#heading_section');
  let headingSection_icon_Box = headingSection.querySelectorAll('.i-box');
  let headingSection_hr_tag = headingSection.querySelectorAll('hr');

  /*----------- Form ----------*/
  let aplicantForm = document.querySelector('#Applicant-info-form');
  let QboxForm = document.querySelector('#question-info-form');
  let paymentForm = document.querySelector('#payment-info-form');
  let successForm = document.querySelector('#Success-massage-form');
 
  //input
  let FnameInput = document.querySelector('#inp--f--name');
  let LnameInput = document.querySelector('#inp--f--name');
  let emailInput = document.querySelector('#inp--email');
  let DOB_Input = document.querySelector('#inp--dob');//Date of birth
  let numInput = document.querySelector('#inp--num');
  let countryInput = document.querySelector('#inp--Country');
  let cityInput = document.querySelector('#inp--City');
  let districtInput = document.querySelector('#inp--District');
  let pCodeInput = document.querySelector('#inp--pcode');
  let dojuNameInput = document.querySelector('#inp--doju-name');
  let instructorInput = document.querySelector('#inp--Instructor');
  let currentGradeInput = document.querySelector('#inp--current-grade');
  let membership_expiring_date_input = document.querySelector('#membership-exp-date-inp');
  let previousViolanceChargeInput = document.querySelector('#inp--pr--violance-charge');
  var permanentDisabillityInput = document.querySelector('#inp--pr--disabillity');
  var previousInjuryInput = document.querySelector('#inp--previous-injury');
  let policy1Input = document.getElementById('policy-1-inp');
  let policy2Input = document.getElementById('policy-2-inp') ;
  
  var userInfo = {
    fname: '',
    lname: '',
    email: '',
    phone: '',
    date_of_birth: '',
    country: '',
    city: '',
    district: '',
    postcode: '',
    doju_Name: "",
    instructor: "",
    current_grade: "",
    violance_charge: "",
    permanent_disabillity: '',
    previous_injury: '',
    //defined
    gender: 'Male',
    is_previous_member: 'No',
    experience_level: 'Junior',
    has_violance_charge: "No",
    has_permanent_injury: 'No',
    membeship_array: [{
      company: 'school_of_traditional_martial_art',
      membership: "LifeTime"
    }],
    accapted: {
      role1: false,
      role2: false,
    }

  };


  /*----------- v function  ----------*/

 

  /*-----------  moving To QboxForm  ----------*/
  async function movingToQboxForm(params) {
    try {
      //String
      userInfo.fname = await v2(FnameInput);
      userInfo.lname = await v2(LnameInput);
      userInfo.email = await v2(emailInput);
      userInfo.country = await v2(countryInput);
      userInfo.city = await v2(cityInput);
      userInfo.district = await v2(districtInput);
      userInfo.postcode = await v2(pCodeInput);
      userInfo.instructor = await v2(instructorInput);
      userInfo.doju_Name = await v2(dojuNameInput);
      userInfo.postcode= await v2(pCodeInput);
     
      //number
      await v3(numInput).then(e => userInfo.phone = e).catch(e => { alert(e); throw new Error("Error"); })

      //Date
      userInfo.date_of_birth = await v4(DOB_Input);


      if (userInfo.membeship_array.length ===0) {
        userInfo.membeship_array[0]={
          company :  'school_of_traditional_martial_art',
          membership : 'LifeTime'
        }
        document.querySelector(`[membershipValue="LifeTime"]`).setAttribute('default-membership',true);
        return;
      }

      /*------------------------Form Change -------------------------------*/
      formStatus = formStatus + 1;
      aplicantForm.style.display = 'none';
      QboxForm.style.right = '0px';
      QboxForm.style.display = 'flex';
      return changeHeadingSectionLayout()
    } catch (error) {
      log(error)
    }

  }


  function calculateTotal(params) {
    let memberships = '';
    let cost = 0;
    if (!userInfo.membeship_array.length) throw 'You do not have any data'
    for (let i = 0; i < userInfo.membeship_array.length; i++) {
      let { membership, company } = userInfo.membeship_array[i];
      memberships = memberships + `${i === 0 ? '' : ' + '}${membership} (${company})`;
      cost += membership.toLowerCase() === 'annual' ? 75 : 250;
    }
    let taxRate = global_gst_rate / 100;
    let tax = cost * taxRate;

    setValue(`[payment_membership_total]`, (cost + tax).toFixed(2) + '$');
    setValue(`[payment_membership_cost]`, cost.toFixed(2) + '$');
    setValue(`[payment_membership_tax]`, tax.toFixed(2) + '$');
    setValue(`[payment_membership_type]`, memberships);

  }
  async function MoveToPaymentForm() {
    try {
      if (userInfo.is_previous_member.toLowerCase() === 'yes') userInfo.membership_expiring_date = await v4(membership_expiring_date_input)
      if (userInfo.is_previous_member.toLowerCase() === 'no') userInfo.membership_expiring_date = '';
      if (userInfo.has_permanent_injury.toLowerCase() === 'yes') userInfo.permanent_disabillity = await v2(permanentDisabillityInput);
      if (userInfo.has_violance_charge.toLowerCase() === 'yes') userInfo.violance_charge = await v2(previousViolanceChargeInput)
      userInfo.current_grade = await v2(currentGradeInput);
      userInfo.previous_injury = await v2(previousInjuryInput);
      if (!userInfo.accapted.role1 || !userInfo.accapted.role2) return
      formStatus = formStatus + 1;
      QboxForm.style.display = 'none';
      paymentForm.style.right = '0px';
      paymentForm.style.display = 'flex';
      calculateTotal()
      return changeHeadingSectionLayout()
    } catch (error) {
      log(error)
    }
  }

  /*----------- changing form  ----------*/
  function changeFormLayout(moveForward) {
    let transitionTime = 500;
    if (moveForward === true) {
      if (formStatus === 1) return movingToQboxForm()
      if (formStatus === 2) return MoveToPaymentForm();

      // return changeHeadingSectionLayout()

      if (formStatus === 3) {
        formStatus = formStatus + 1;
        paymentForm.style.display = 'none';
        successForm.style.right = '0px';
        successForm.style.display = 'flex';
        return changeHeadingSectionLayout()
      }
    }
    if (moveForward === false) {
      if (formStatus === 2) {
        formStatus = formStatus - 1;
        aplicantForm.style.display = 'flex';
        QboxForm.style.display = 'none';
        return changeHeadingSectionLayout()
      }
      if (formStatus === 3) {
        formStatus = formStatus - 1;
        QboxForm.style.display = 'flex';
        paymentForm.style.display = 'none';
        return changeHeadingSectionLayout()
      }
    }
  }
  /*----------- changing heading ----------*/
  function changeHeadingSectionLayout() {
    headingSection_hr_tag.forEach((e, i) => {

      e.style.background = i <= (formStatus - 2) ? "var(--main-cl)" : 'rgba(0, 0, 0, 0.849)';
      e.style.border = 'none';
    });
    headingSection_icon_Box.forEach((e, i) => {
      e.style.background = i <= (formStatus - 1) ? "var(--main-cl)" : 'white';
      e.style.border = i <= (formStatus - 1) ? "2px solid var(--main-cl)" : '2px solid rgba(0, 0, 0, 0.849)';
      e.querySelector('i').style.color = i <= (formStatus - 1) ? "white" : 'rgba(0, 0, 0, 0.849)';
    })

  }
  async function changeMembership(target) {
    let status = target.getAttribute('default-membership');
    let company = target.getAttribute('membershipOrganization');
    let membership = target.getAttribute('membershipValue');
    if (status === 'true') {
      userInfo.membeship_array = userInfo.membeship_array.filter(el => (el.company !== company && el.membership !== membership));
      target.setAttribute('default-membership', 'false')
      return
    }
    if (status === 'false') {
      let index = userInfo.membeship_array.findIndex(el => (el.company === company && el.membership === membership));
      if (index === -1) userInfo.membeship_array.push({ company, membership })
      target.setAttribute('default-membership', 'true');
      return
    }
  }
  function ChangeYesNoStatenent(target) {
    let yesNoDivFor = target.getAttribute('yes-no-div-for');
    let yesNoDivValue = target.getAttribute('yes-no-div-value');
    function changeCheckMark(forValue) {
      document.querySelectorAll(`[yes-no-div-for="${forValue}"]`).forEach(element => {
        let elementInnerChildDiv = element.querySelector('.check-div');
        elementInnerChildDiv.innerHTML = element.getAttribute('yes-no-div-value') === yesNoDivValue ? '<i class="fa-solid fa-check"></i>' : '';
      });
    }
    if (yesNoDivFor === 'genderValue') {
      userInfo.gender = yesNoDivValue.toString();
      return changeCheckMark('genderValue')
    }
    if (yesNoDivFor === 'pre_membership_status_Value') {
      userInfo.is_previous_member = yesNoDivValue;
      return changeCheckMark('pre_membership_status_Value')
    }
    if (yesNoDivFor === 'experience_value') {
      userInfo.experience_level = yesNoDivValue;
      return changeCheckMark('experience_value')
    }

    if (yesNoDivFor === 'violance_charge_status_Value') {
      userInfo.has_violance_charge = yesNoDivValue;
      document.querySelector('[display_if_violance_charge_yes]').style.display = yesNoDivValue.toLowerCase() === 'no' ? 'none' : 'flex'
      return changeCheckMark('violance_charge_status_Value')
    }
    if (yesNoDivFor === 'permanent_Injury_status_Value') {
      userInfo.has_permanent_injury = yesNoDivValue;
      return changeCheckMark('permanent_Injury_status_Value')
    }

  }


  /*---------------------------- Paypal membership function ----------------------------*/

  async function paypalMembershipFunction(e) {
    e.preventDefault();
    if (processingPayment) return;
    try {
      let jsonObject = await JSON.stringify({ ...userInfo, coupon: isValidCoupon ? coupon : undefined });
      processingPayment = true;
      document.getElementById('paypal-payment-btn').style.transition = 'all .5s ease';
      document.getElementById('paypal-payment-btn').style.opacity = .7;
      fetch(window.location.origin + '/api/l-api/paypal-membership-purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonObject
      })
        .then(data => data.json())
        .then(data => {
          log(data)
          if (data.error) return alert(data.error);
          if (data.success) return window.location.assign(data.link)
        })
        .catch(e => log(e))
        .finally(e => {
          processingPayment = false;
          document.getElementById('paypal-payment-btn').style.opacity = 1;
        })
    } catch (e) {
      log(e)
    }
  }


  /*---------------------------- credit card membership function   ----------------------------*/



  async function stripeMembershipFunction(e) {
    if (processingPayment) return;
    e.preventDefault();
    try {
      let jsonObject = await JSON.stringify({ ...userInfo, coupon: isValidCoupon ? coupon : undefined });
      // alert('working')
      document.getElementById('credit-card-payment-Continue-btn').style.transition = 'all .5s ease';
      document.getElementById('credit-card-payment-Continue-btn').style.opacity = .7;
      processingPayment = true
      await fetch(window.location.origin + '/api/l-api/stripe-membership-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonObject
      })
        .then(data => data.json())
        .then(data => {
          log(data)
          if (data.error) return alert(data.error);
          if (data.success) return window.location.assign(data.link)
        })
        .catch(e => log(e))
        .finally(e => {
          processingPayment = false;
          document.getElementById('credit-card-payment-Continue-btn').style.opacity = 1;
        })
    } catch (e) {
      log(e)
    }
  }

  /*----------- event delegation and  listener ----------*/
  document.addEventListener('click', function (e) {
    {
      //aplicant info continue btn
      if (e.target.id === 'applicant-form-btn') return changeFormLayout(true);
      //q form back btn
      if (e.target.id === 'q-box-back-btn') return changeFormLayout(false);
      //q form continue btn
      if (e.target.id === 'q-box-cn-btn') return changeFormLayout(true);
      //q form back btn
      if (e.target.id === 'payment-back-btn') return changeFormLayout(false);
      //payment form continue btn
      if (e.target.id === 'payment-Continue-btn') return changeFormLayout(true);
      //success go it btn
      if (e.target.id === 'successGotItBtn') return window.location.assign('/');
      //  yes or no statements
      if (e.target.className === 'yes-no-div') return ChangeYesNoStatenent(e.target);
      if (e.target.parentNode.className === 'yes-no-div') return ChangeYesNoStatenent(e.target.parentNode);
      if (e.target.parentNode.parentNode.className === 'yes-no-div') return ChangeYesNoStatenent(e.target.parentNode.parentNode);
    }
    //membership
    if (e.target.className === 'membership') return changeMembership(e.target);
    if (e.target.parentNode.className === 'membership') return changeMembership(e.target.parentNode);
    if (e.target.parentNode.parentNode.className === 'membership') return changeMembership(e.target.parentNode.parentNode);

  })

  policy1Input.addEventListener('change', e => {
    let status = e.target.getAttribute('status');
    userInfo.accapted.role1 = status === 'off' ? true : false;
    document.getElementById('q-box-cn-btn').style.opacity = (!userInfo.accapted.role1 || !userInfo.accapted.role2) ? .65 : 1;
    status = status === 'on' ? 'off' : 'on'
  })

  policy2Input.addEventListener('change', e => {
    let status = e.target.getAttribute('status');
    userInfo.accapted.role2 = status === 'off' ? true : false;
    document.getElementById('q-box-cn-btn').style.opacity = (!userInfo.accapted.role1 || !userInfo.accapted.role2) ? .65 : 1;
    status = status === 'on' ? 'off' : 'on'
    e.target.setAttribute('status', status)
  })


  document.getElementById('paypal-payment-btn').addEventListener('click', e => paypalMembershipFunction(e))
  document.getElementById('credit-card-payment-Continue-btn').addEventListener('click', e => stripeMembershipFunction(e))


  let couponsTimeOut;
  // document.querySelector('[enter_a_coupon]').addEventListener('keypress', setCoupon);
  // document.querySelector('[enter_a_coupon]').addEventListener('change', setCoupon);
  document.querySelector('[enter_a_coupon]').addEventListener('input', setCoupon);

  async function setCoupon(event) {
    if (!event.target?.value.trim()) return;
    coupon =event.target.value.trim();
    coupon.toUpperCase();
    event.target.value=coupon.toUpperCase();
    clearTimeout(couponsTimeOut);
    couponsTimeOut = setTimeout(async function () {
      let params = (new URLSearchParams({ code: coupon })).toString();
      let response = await fetch(window.location.origin + '/api/api_s/coupons/memberships/rate?' + params);
      if (response.status === 200) {
        isValidCoupon=true;
        let rate = (await response.json()).rate;
        let memberships = '';
        let cost = 0;
        if (!userInfo.membeship_array.length) throw 'You do not have any data'
        for (let i = 0; i < userInfo.membeship_array.length; i++) {
          let { membership, company } = userInfo.membeship_array[i];
          memberships = memberships + `${i === 0 ? '' : ' + '}${membership} (${company})`;
          cost += membership.toLowerCase() === 'annual' ? 75 : 250;
        }
        let taxRate = global_gst_rate / 100;
        cost = cost - (cost * rate);
        let tax = cost * taxRate;
        setValue(`[payment_membership_cost]`, cost.toFixed(2) + '$');
        setValue(`[payment_membership_tax]`, tax.toFixed(2) + '$');
        setValue(`[payment_membership_type]`, memberships);
        setValue(`[payment_membership_total]`, (cost + tax).toFixed(2) + '$');
        document.querySelector('[enter_a_coupon]').style.outline = '2px solid green';
        setTimeout(() => {
          document.querySelector('[enter_a_coupon]').style.outline = 'none';
        }, 2500);
        return;
      } else {
        isValidCoupon=false;
        let memberships = '';
        let cost = 0;
        if (!userInfo.membeship_array.length) throw 'You do not have any data'
        for (let i = 0; i < userInfo.membeship_array.length; i++) {
          let { membership, company } = userInfo.membeship_array[i];
          memberships = memberships + `${i === 0 ? '' : ' + '}${membership} (${company})`;
          cost += membership.toLowerCase() === 'annual' ? 75 : 250;
        }
        let taxRate = global_gst_rate / 100;
        let tax = cost * taxRate;
        setValue(`[payment_membership_cost]`, cost.toFixed(2) + '$');
        setValue(`[payment_membership_tax]`, tax.toFixed(2) + '$');
        setValue(`[payment_membership_type]`, memberships);
        setValue(`[payment_membership_total]`, (cost + tax).toFixed(2) + '$');
        document.querySelector('[enter_a_coupon]').style.outline = '1.3px solid orange';
        setTimeout(() => {
          document.querySelector('[enter_a_coupon]').style.outline = 'none';
        }, 2500);
        return;
      }
    }, 1000);

  }
}/*----------- form scope finished ----------*/


function log(e) { console.log(e) }
function v2(el) {
  let simbolerror = 'You can not use <,>,{,},[,],",,$' + "`," + '"';
  if (!el) throw new Error(`can not find using ${htmlElementSelector}`);
  let value = el.value;
  if (!value) {
    el.style.outline = '2px solid red';
    throw new Error('This feild is emty');
  }
  if (value.includes('<')) {
    el.style.outline = '2px solid red';
    throw new Error(simbolerror);
  }
  if (value.includes('>')) {
    el.style.outline = '2px solid red';
    throw new Error(simbolerror);
  }
  if (value.includes("'")) {
    el.style.outline = '2px solid red';
    throw new Error(simbolerror);
  }
  if (value.includes('"')) {
    el.style.outline = '2px solid red';
    throw new Error(simbolerror);
  }
  if (value.includes('`')) {
    el.style.outline = '2px solid red';
    throw new Error(simbolerror);
  }
  if (value.includes('{')) {
    el.style.outline = '2px solid red';
    throw new Error(simbolerror);
  }
  if (value.includes('}')) {
    el.style.outline = '2px solid red';
    throw new Error(simbolerror);
  }
  if (value.includes('[')) {
    el.style.outline = '2px solid red';
    throw new Error(simbolerror);
  }
  if (value.includes(']')) {
    el.style.outline = '2px solid red';
    throw new Error(simbolerror);
  }
  return value
}
async function v3(el) {
  let num = el.valueAsNumber;
  if (!el) {
    el.style.outline = '2px solid red';
    throw 'not a number'
  }
  if (Number(num).toString().toLowerCase() === 'nan') {
    el.style.outline = '2px solid red';
    throw 'not a number'
  }
  return num
}
async function v4(el) {
  if (!el) throw 'can not find date'
  let value = el.value;
  if (!value) {
    el.style.outline = '2px solid red';
    throw 'Please give the Date';
  }
  return el.valueAsDate.getDate() + '-' + el.valueAsDate.getMonth() + '-' + el.valueAsDate.getFullYear();

}
function setValue(params, value) {
  document.querySelector(params).setAttribute('value', value)
}