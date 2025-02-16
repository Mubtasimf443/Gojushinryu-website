/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allah,  By the marcy of Allah,  I will gain success
*/

{

  let gmListContainer = document.querySelector('#list-of-gm');
  let table = gmListContainer.querySelector('table')
  let grandMasters=[];
  let GmIsSeen = false;
  let Observer = new IntersectionObserver(entry => {

    if (entry[0].target.id === 'list-of-gm' && entry[0].isIntersecting) {
      if (!GmIsSeen) {
        fetch(window.location.origin + '/api/api_s/find-grand-master')
          .then(res => res.json())
          .then((data) => {
            console.log(data);

            let { error, success, gm } = data;
            if (error) return alert('Failed To load Grand Master Data')

            if (success) {
              grandMasters =gm;
              for (let i = 0; i < gm.length; i++) {
                let { name, organization, image, id,username } = gm[i];

                let tr = document.createElement('tr');
                tr.innerHTML = ( `
                        <td >
                        <img src="${image}">
                        </td>
                        <td >${name}</td>
                        <td>${organization}</td>
                        <td>${username}</td>
                        <td ><button gm_id="${id}" update>UPDATE</button></td>
                        <td ><button gm_id="${id}" remove>Remove</button></td>
                        `);
                table.appendChild(tr)

                function removeProduct(e) {
                  let id = e.target.getAttribute('gm_id');

                  let jsonObject = JSON.stringify({
                    id: Number(id)
                  })

                  fetch(window.location.origin + '/api/api_s/delete-grand-master-account', {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: jsonObject
                  })
                    .then(e => e.json())
                    .then(e => console.log(e))

                  table.querySelector(`[gm_id="${id}"]`).parentElement.parentElement.remove();
                }

                tr.querySelector('[remove]').addEventListener('click', e => removeProduct(e))
                tr.querySelector('[update]').addEventListener('click', OpenUpdatePopup);
              }
            }
          })
          .catch((e) => { throw e }
          )
          .finally(e => GmIsSeen = true)
      }
    }
  }
  )


  Observer.observe(gmListContainer)



  {
    let updatePopup = document.querySelector('#edit-grand-master-popup');
    let form =updatePopup.querySelector('form') ;
    let isUpdating=false;
    form.addEventListener('submit',async function (event) {
      try {
        event.preventDefault();
        if (isUpdating) {
          return alert('Please wait as Grand Master is Updating');
        }
        isUpdating =true;
        let name =  updatePopup.querySelector(`[name="name"]`).value;
        let email = updatePopup.querySelector(`[name="email"]`).value;
        let organization= updatePopup.querySelector('[name="organization"]').value;
        let username = updatePopup.querySelector(`[name="username"]`).value;
        let password =  updatePopup.querySelector(`[name="password"]`).value;
        form.style.opacity = .65;
        let response =await fetch(window.location.origin +'/api/api_s/update-grand-master-from-control-panal' , {
          method :"PUT",
          headers:{
            'Content-Type':'application/json',
          },
          body :JSON.stringify({ name , email , password , username , organization})
        });
        if (response.ok) {
          alert('successfully updated the grand master');
        } else {
          alert('Failed to update the grand master');
        }
      } catch (error) {
        console.log(error);
      } finally {
        form.style.opacity = 1;
        updatePopup.style.display = 'none';
        isUpdating =false;
      }

    });
  }

  function OpenUpdatePopup(event = new CustomEvent('click')) {
    try {
      event.preventDefault();
      let updatePopup = document.querySelector('#edit-grand-master-popup');
      console.log({grandMasters});
      
      let { name, email, organization, username } = grandMasters.find(function (element) {
        if (element.id == event.target.getAttribute('gm_id')) {
          return element;
        }
      });
      updatePopup.querySelector(`[name="name"]`).value= name;
      updatePopup.querySelector(`[name="email"]`).value= email;
      updatePopup.querySelector(`[name="organization"]`).value= organization;
      updatePopup.querySelector(`[name="username"]`).value= username;
      updatePopup.querySelector('form').setAttribute('gm-id', event.target.getAttribute('gm_id'));
      updatePopup.style.display='flex';
    } catch (error) {
      console.log(error);
    }
  }


  gmListContainer.querySelector(`[upload_gm_btn]`).addEventListener('click', async function (event = new Event('click')) {
    try {
      event.preventDefault()
      let [name, username, email, password, organization] = [
        v(`[placeholder="name"]`),
        v(`[placeholder="for login and should be unique"]`),
        v(`[placeholder="email"]`),
        v(`[type="password"]`),
        v(`[placeholder="Organiztaion"]`)
      ];
      event.target.style.opacity = .65;
      let response = await fetch(window.location.origin + '/api/api_s/create-grand-master', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, username, organization })
      });
      let { error, success } = await response.json();
      if (error) { 
        alert(error);
      }
      if (success) {
        alert('GRAND MASTER added SuccessFully');
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    } finally {
      event.target.style.opacity = 1;
    }
  })




  const v = (htmlElementSelector) => {
    let simbolerror = 'You can not use <,>,{,},[,],",,$' + "`," + '"';
    let el = gmListContainer.querySelector(htmlElementSelector);
    if (!el) throw new Error(`can not find using ${htmlElementSelector}`);
    let value = el.value;
    if (!value) {
      el.style.outline = '2px solid red';
      throw new Error('value is not present');
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


  const v2 = (htmlElementSelector) => {
    let simbolerror = 'You can not use <,>,{,},[,],",,$' + "`," + '"';
    let el = gmListContainer.querySelector(htmlElementSelector);
    if (!el) throw new Error(`can not find using ${htmlElementSelector}`);
    let value = el.valueAsNumber;
    if (!value) {
      el.style.outline = '2px solid red';
      throw new Error(simbolerror);
    }
    if (Number(value).toString().toLowerCase() === 'nan') {
      el.style.outline = '2px solid red';
      throw new Error('Error : not a number');
    }
    return value
  }



}
