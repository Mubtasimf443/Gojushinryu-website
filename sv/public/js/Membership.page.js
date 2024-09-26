/* 
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
Insha Allah,  By Allahs Marcy,  I willearn success
*/






/*----------- form scope ----------*/
{
/*----------- global scope ----------*/
 var formStatus = 1; 

 /*----------- heading section ----------*/
 let headingSection = document.querySelector('#heading_section'); 
 let headingSection_icon_Box = headingSection.querySelectorAll('.i-box');
 let headingSection_hr_tag = headingSection.querySelectorAll('hr');
 
 /*----------- Form ----------*/
 let aplicantForm = document.querySelector('#Applicant-info-form');
 let QboxForm = document.querySelector('#question-info-form');
 let paymentForm = document.querySelector('#payment-info-form');
 let successForm = document.querySelector('#Success-massage-form');

 /*----------- Button's of Form ----------*/

 //aplicant info
 let applicationInfoContinueButton = document.querySelector('#applicant-form-btn');
 //quwstion and Answer
 let QboxBackBtn = document.querySelector("#q-box-back-btn");
 let QboxContinueBtn = document.querySelector("#q-box-cn-btn");
 //payment btn
 let paymentFormBackBtn = document.querySelector("#payment-back-btn");
 let paymentFormContinueBtn = document.querySelector("#payment-Continue-btn");
 //success massage
 let successGotItBtn = document.querySelector("#successGotItBtn");

 
  //input
  let FnameInput  = document.querySelector('#inp--f--name');
  let LnameInput  = document.querySelector('#inp--f--name');
 let emailInput = document.querySelector('#inp--email');
 let DOB_Input = document.querySelector('#inp--dob');//Date of birth
 let numInput = document.querySelector('#inp--num');
 let countryInput = document.querySelector('#inp--Country');
 let cityInput = document.querySelector('#inp--City');
 let districtInput = document.querySelector('#inp--District');
 let pCodeInput = document.querySelector('#inp--pcode');
 let dojuNameInput = document.querySelector('#inp--doju-name');
 let permanentDisabillityInput = document.querySelector('#inp--pr--disabillity');
 let previousInjuryInput = document.querySelector('#inp--previous-injury');


 //values
 let membershipValue ='Annual';
 let genderValue ='Male';
 let pre_membership_status_Value ='no';
 let experience_value ='Junior';
 let violance_charge_status_Value ='no';
 let permanent_Injury_status_Value='no';
 
/*----------- changing form  ----------*/
 function changeFormLayout(moveForward) {
  let transitionTime=500;
  if (moveForward===true){
    if (formStatus===1){
      formStatus=formStatus+1;
      // aplicantForm.style.left='-110%';
      QboxForm.style.right='0px';
      QboxForm.style.display='flex';
      // QboxForm.style.right='0%';
      // setTimeout(() => {
        aplicantForm.style.display='none';
      // }, transitionTime);
      return changeHeadingSectionLayout()
    }
    if (formStatus===2){
      formStatus=formStatus+1;
      QboxForm.style.display='none';
      paymentForm.style.right='0px';
      paymentForm.style.display='flex';
      return changeHeadingSectionLayout()
    }
    if (formStatus===3) {
      formStatus=formStatus+1;
      paymentForm.style.display='none';
      successForm.style.right='0px';
      successForm.style.display='flex';
      return changeHeadingSectionLayout()
    }
  }
  if(moveForward===false){
    if (formStatus===2){
      formStatus=formStatus-1;
      aplicantForm.style.display='flex';
      QboxForm.style.display='none';
      return changeHeadingSectionLayout()
    }
    if (formStatus===3){
      formStatus=formStatus-1;
      QboxForm.style.display='flex';
      paymentForm.style.display='none';
      return changeHeadingSectionLayout()
    }
  }
}
/*----------- changing heading ----------*/
function changeHeadingSectionLayout() {
  headingSection_hr_tag.forEach((e,i)=> {

    e.style.background=i<=(formStatus -2) ? "var(--main-cl)": 'rgba(0, 0, 0, 0.849)';
    e.style.border='none';
  });
  headingSection_icon_Box.forEach((e,i )=>{
    e.style.background= i<= (formStatus-1) ? "var(--main-cl)" :  'white';
    e.style.border= i<=(formStatus -1)? "2px solid var(--main-cl)" : '2px solid rgba(0, 0, 0, 0.849)';
    e.querySelector('i').style.color= i<=(formStatus-1 )? "white" : 'rgba(0, 0, 0, 0.849)';
  })
  
}
function changeMembership(target) {
  // document.querySelectorAll('.membership').forEach((element) => {
    // element.style.border=element.id === e.target.id ? '2px solid var(--main-cl)' : ' 2px solid rgba(0, 0, 0, 0.123)';
    // element.id === target.id ? element.setAttribute('default-membership','true') :element.setAttribute('default-membership','false') ;
    // membershipValue=target.getAttribute('membershipValue')
  // }); 
       target.getAttribute('default-membership') ==="true" ? target.setAttribute('default-membership','false') :target.setAttribute('default-membership','true') ;

}
function ChangeYesNoStatenent(target) {
  let yesNoDivFor = target.getAttribute('yes-no-div-for');
  let yesNoDivValue = target.getAttribute('yes-no-div-value');
  function changeCheckMark(forValue) {
    document.querySelectorAll(`[yes-no-div-for="${forValue}"]`).forEach(element => {
      let elementInnerChildDiv=element.querySelector('.check-div');
      elementInnerChildDiv.innerHTML=element.getAttribute('yes-no-div-value')=== yesNoDivValue ? '<i class="fa-solid fa-check"></i>' :'';
    });
  }
  if (yesNoDivFor==='genderValue') {
    genderValue = yesNoDivValue;
   return changeCheckMark('genderValue')
  }
  if (yesNoDivFor==='pre_membership_status_Value') {    
    pre_membership_status_Value = yesNoDivValue;
    return changeCheckMark('pre_membership_status_Value')
  }
  if (yesNoDivFor==='experience_value') {
    experience_value = yesNoDivValue;
    return changeCheckMark('experience_value')
  }
  
  if (yesNoDivFor==='violance_charge_status_Value') {
    violance_charge_status_Value = yesNoDivValue;
    return changeCheckMark('violance_charge_status_Value')
  }
  if (yesNoDivFor==='permanent_Injury_status_Value') {
    permanent_Injury_status_Value = yesNoDivValue;  
    return changeCheckMark('permanent_Injury_status_Value')
  }

}

/*----------- event delegation and  listener ----------*/
document.addEventListener('click',e => {
  //aplicant info continue btn
   if (e.target.id==='applicant-form-btn') return changeFormLayout(true);      
  //q form back btn
   if (e.target.id==='q-box-back-btn') return changeFormLayout(false);
  //q form continue btn
   if (e.target.id==='q-box-cn-btn') return changeFormLayout(true);
   //q form back btn
   if (e.target.id==='payment-back-btn') return changeFormLayout(false);
  //payment form continue btn
   if (e.target.id==='payment-Continue-btn') return changeFormLayout(true);
  //success go it btn
  if (e.target.id==='successGotItBtn') return window.location.replace('/')
  //membership
 if (e.target.className==='membership') return changeMembership(e.target);
  if (e.target.parentNode.className==='membership') return changeMembership(e.target.parentNode);
  if (e.target.parentNode.parentNode.className==='membership') return changeMembership(e.target.parentNode.parentNode);
 //  yes or no statements
  if (e.target.className==='yes-no-div') return ChangeYesNoStatenent(e.target);
  if (e.target.parentNode.className==='yes-no-div') return ChangeYesNoStatenent(e.target.parentNode);
  if (e.target.parentNode.parentNode.className ==='yes-no-div') return ChangeYesNoStatenent(e.target.parentNode.parentNode);

 })



}/*----------- form scope finished ----------*/































