/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/

let fn_input =document.querySelector('#f-name-inp')
let ln_input =document.querySelector('#l-name-inp')
let em_input =document.querySelector('#email-inp')
let pn_input =document.querySelector('#phone-inp')
let subject_input =document.querySelector('#subject-inp')
let location_input =document.querySelector('#location-inp')
let mass_input =document.querySelector('#massage-inp')
let Btn = document.getElementById('Contact_us_api_btn');
var busy=false;

Btn.addEventListener('click', e => {
    if (busy ) return
    e.preventDefault();
    let first_name, last_name ,email, phone,subject , location, massage;
    first_name=fn_input.value ;
    last_name=ln_input.value ;
    email=em_input.value ;
    phone=pn_input.valueAsNumber;
    subject=subject_input.value ;
    location=location_input.value ;
    massage=mass_input.value ;
    console.log(first_name, last_name ,email, phone,subject , location, massage);
    let JsonObject= JSON.stringify({
        first_name, last_name ,email, phone,subject , location, massage
    });
    Btn.style.transition='all 1s ease';
    Btn.style.opacity=.7;
    busy=true;
    setTimeout(() => {
        Btn.style.opacity=1;
        busy=false;
    }, 5000);
    fetch(window.location.origin + '/api/api_s/contact',{
        method :'POST',
        headers:{
            'Content-Type':'application/json',            
        },
        body :JsonObject
    })
    .then( res => res.json() )
    .then(({error,success}) => {
        if (error ) {
            let errorMassageDom= document.getElementById('f_info_massage');
            errorMassageDom.style.color='red';
            errorMassageDom.style.fontSize='17.6px';
            errorMassageDom.innerText=error;
            Btn.style.opacity=1;
            busy=false;
            return
        }
        if (success) {
            Btn.style.background='green';
            Btn.innerHTML ='success <i class="fa-solid fa-round-check"></i>'
            Btn.style.color='#fff';
            let successMassageDom= document.getElementById('f_info_massage');
            successMassageDom.innerText='Thanks For Contacting Us';
            successMassageDom.style.color='green';
            successMassageDom.previousElementSibling.remove();
            successMassageDom.style.fontSize='23px';
            busy=false;
        }
    })
})



