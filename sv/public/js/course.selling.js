/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/

{/*----------- scope start ----------*/
    //dom
let mainImage =document.getElementById('----m-image');
let LinksContainer = document.querySelector('#Links-container');
//function 
   


    /*----------- event delegation and  listener ----------*/
document.addEventListener('click',e =>{
    if (e.target.className === 'gly_img') return mainImage.setAttribute('src' ,e.target.src) ;
    if (e.target.className==='fa-solid fa-heart') return e.target.className = 'fa-regular fa-heart' ;
    if (e.target.className==='fa-regular fa-heart') return e.target.className = 'fa-solid fa-heart' ;
    if (e.target.className=== 'fa-solid fa-link') return LinksContainer.style.display='flex';
    if (e.target.parentNode.className === 'Links-container-close-btn' || e.target.className === 'fa-solid fa-copy' || e.target.className === 'Links-container-close-btn' || e.target=== LinksContainer ) return LinksContainer.style.display='none';

})

}/*-----------scope finished ----------*/

{
    /*
    بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
    Insha Allab,  By the marcy of Allah,  I will gain success
    */

  var purchasing=false;
  let paypal_purchase_btn =document.querySelector(`[paypal_purchase_btn]`);

  
    
 /*----------- v function  ----------*/
 
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
function log(e) {console.log(e)}
function v2(el) {

  let simbolerror='You can not use <,>,{,},[,],",,$'+ "`," + '"' ;
 
  if (!el) throw new Error(`can not find using ${htmlElementSelector}`);
  let value=el.value;
  if (!value) {
      el.style.outline='2px solid red';
      throw new Error('This feild is emty');
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
  }
  if (value.includes('{')) {
      el.style.outline='2px solid red';
      throw new Error(simbolerror);
  }
  if (value.includes('}')) {
      el.style.outline='2px solid red';
      throw new Error(simbolerror);
  }
  if (value.includes('[')) {
      el.style.outline='2px solid red';
      throw new Error(simbolerror);
  }
  if (value.includes(']')) {
      el.style.outline='2px solid red';
      throw new Error(simbolerror);
  }
  return value
}
async function v3(e) {
  let el  =document.querySelector(e);
  let num=el.valueAsNumber;
  if (!el) {
    el.style.outline='2px solid red';
    throw 'not a number'
  }
  if (Number(num).toString().toLowerCase()==='nan') {
    el.style.outline='2px solid red';
    throw 'not a number'
  }
  return num
}
async function v4(el) {
  if (!el) throw 'can not find date'
  el.setAttribute('type','date');
  let value = el.value;
  if (!value) {
    el.style.outline='2px solid red';
    throw 'Please give the Date';
  }
  return el.valueAsDate.getDate()+'-' +el.valueAsDate.getMonth()+'-' + el.valueAsDate.getFullYear() ;
  
}
function setValue(params,value) {
  document.querySelector(params).setAttribute('value',value)
}

async function paypalpurchase(e) {
    if (purchasing) return
    try {
        // let name =await v(`[id="--inp-name"]`);
        // let email =await v(`[id="--inp-email"]`);
        // let phone =await v3( document.querySelector(`[id="--inp-phone"]`));
        let date_of_birth =await v4(document.querySelector(`[id="--inp-dob"]`));
        let postcode =await v3(`[id="--inp-postcode"]`);
        let district =await v(`[id="--inp-district"]`);
        let country =await v(`[id="--inp-country"]`);
        let city =await v(`[id="--inp-city"]`);

        let jsonObject=await JSON.stringify({date_of_birth,postcode,district,country,city,course_id : Number(course_id) });
        purchasing =true;
        paypal_purchase_btn.style.opacity =.65;
        fetch(window.location.origin +'/api/l-api/paypal-course-purchase-api',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body :jsonObject
        }) 
        .then(res=> res.json())
        .then(data => {
            log(data)
            let {notAUser,success ,error,link} =data
            if (notAUser) return window.location.assign('/auth/sign-in') ;
            if (success) return window.location.assign(link)
            if (error) return alert(error)
        })
        .catch(e => log(e))
        .finally(e => {
            paypal_purchase_btn.style.opacity=1;
            purchasing=false
        } )
    
    } catch (error) {
        log(error)
    }  
   
}


paypal_purchase_btn.addEventListener('click',e => paypalpurchase(e))


}















