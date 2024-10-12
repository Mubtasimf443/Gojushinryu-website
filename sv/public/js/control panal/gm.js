/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allah,  By the marcy of Allah,  I will gain success
*/

{

let gmListContainer = document.querySelector('#list-of-gm');
let table=  gmListContainer.querySelector('table')

let GmIsSeen = false;
let Observer = new IntersectionObserver( entry => {
  
  if (entry[0].target.id ==='list-of-gm'  && entry[0].isIntersecting) {
    if (!GmIsSeen) {
      fetch(window.location.origin + '/api/api_s/find-grand-master')
      .then( res => res.json())
    .then((data)=> {
      console.log(data);
      
      let {error, success, gm}=data;
        if (error) return alert('Failed To load Grand Master Data')
        
        if (success) {
          for (let i = 0; i < gm.length; i++) {
            let {name ,organization,image,id} = gm[i];
            
            let tr= document.createElement('tr');
            tr.innerHTML=
            `
            <td width="16%">
            <img src="${image}">
            </td>
            <td width="28%" >${name}</td>
            <td width="40%" >${organization}</td>
            <td width="16%">
            <button gm_id="${id}" >Remove</button>
            </td>
            `
            table.appendChild(tr)
            
            function removeProduct(e) {
              let id = e.target.getAttribute('gm_id');

              let jsonObject = JSON.stringify({
                  id :Number(id)
              })

              fetch(window.location.origin +'/api/api_s/delete-grand-master-account' ,{
                  method:'DELETE',
                  headers:{
                      'Content-Type':'application/json'
                  },
                  body :jsonObject
              })
              .then(e => e.json())
              .then(e => console.log(e))

              table.querySelector(`[gm_id="${id}"]`).parentElement.parentElement.remove();
          }

          tr.querySelector('button').addEventListener('click',e => removeProduct(e) )

          }
        }
      })
     .catch( (e)=> {  throw e}
     )
    .finally( e => GmIsSeen=true   )
    }
  }
}
)


Observer.observe(gmListContainer)







gmListContainer.querySelector(`[upload_gm_btn]`).addEventListener('click',e => {
  let gmform =gmListContainer.querySelector('[class="form-section"]');
  let name =v(`[placeholder="name"]`)
  let username =v(`[placeholder="for login and should be unique"]`)
  let password =v(`[type="password"]`)
  let email =v(`[placeholder="email"]`)
  let organization=v(`[placeholder="Organiztaion"]`);
  let json= JSON.stringify({name,email,password,username,organization})

  fetch(window.location.origin +'/api/api_s/create-grand-master',{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body :json
  })
  .then( e => e.json())
  .then(({error,success}) => {
    if (error) return alert(error);
    if (success) return window.location.reload()
  })
  .catch(e => console.log(e))


})




const v=(htmlElementSelector) => {
  let simbolerror='You can not use <,>,{,},[,],",,$'+ "`," + '"' ;
  let el=gmListContainer.querySelector(htmlElementSelector);
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


const v2=(htmlElementSelector) => {
  let simbolerror='You can not use <,>,{,},[,],",,$'+ "`," + '"' ;
  let el=gmListContainer.querySelector(htmlElementSelector);
  if (!el) throw new Error(`can not find using ${htmlElementSelector}`);
  let value=el.valueAsNumber;
  if (!value) {
      el.style.outline='2px solid red';
      throw new Error(simbolerror);
  }
  if (Number(value).toString().toLowerCase()==='nan') {
      el.style.outline='2px solid red';
      throw new Error('Error : not a number');
  }
  return value
}



}
