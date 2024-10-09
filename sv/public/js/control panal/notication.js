
/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/
{
   let container = document.querySelector('#upload-Notification-conatiner')
   let btn =container.querySelector('[notification_btn]')
   let uplaoding;



   btn.addEventListener('click',e => {


    if (uplaoding) return
    let title =v(`[name="Title"]`);
    let massage =v(`[name="Description"]`);
    let type =container.querySelector('select').selectedOptions[0].value;
    // return alert(type)
    let url =window.location.origin+'/api/api_s';
    if (type ==='mail') url= url +'/mail-notification-to-user'
    if (type !=='mail') url= url +'/notification-to-user'
    btn.style.opacity=.65;
    uplaoding=true;


    fetch(url,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body :JSON.stringify({
            title,
            massage
        })
    })
    .then(e => e.json())
    .then(data => {
        let {error,success} =data;
        if (error) return alert(error)
        if (success) window.location.reload()
    })
    .catch(e => alert(e))
    .finally(e => {
        btn.style.opacity =1;
        uplaoding=false
    })

   })







   const v=(htmlElementSelector) => {
    let simbolerror='You can not use <,>,{,},[,],",,$'+ "`," + '"' ;
    let el=container.querySelector(htmlElementSelector);
    if (!el) throw new Error(`can not find using ${htmlElementSelector}`);
    let value=el.value;
    if (!value) {
        el.style.outline='2px solid red';
        throw new Error('value is not present');
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


















}