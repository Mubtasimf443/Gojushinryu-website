/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/



{
  
    //dom
    let eventUploadSection = document.querySelector('.event_upload_sec');
    let thumbInput =  eventUploadSection.querySelector('#upload_sec_event_tumb_img_inp');
    let thumbInputLabel = eventUploadSection.querySelector('[for="upload_sec_event_tumb_img_inp"]');
    let imgInputLabel = eventUploadSection.querySelector('[for="upload_sec_env_img_inp"]')
    let imgInput = eventUploadSection.querySelector('#upload_sec_env_img_inp');
    //values
    var Thumb = {};
    var images = [];
    
    
    thumbInput.addEventListener('change', async e => {
      if (e.target.files[0].type !=='image/png'
      && e.target.files[0].type!== 'image/jpg'
      && e.target.files[0].type !== 'image/jpeg'
      && e.target.files[0].type !== 'image/webp'
      ) return alert('Only Image are alowed');
      thumb = e.target.files[0];
      let url = await URL.createObjectURL(thumb);
      thumbInputLabel.style.background = 'url(' +url +')';
      thumbInputLabel.style.backgroundSize = 'cover';
      thumbInputLabel.style.backgroundPosition = 'center center';
      thumbInputLabel.style.backgroundRepeat = 'no-repeat';
      
    });
    
    imgInput.addEventListener('change',async e => {
      if (e.target.files[0].type !== 'image/png' 
        && e.target.files[0].type !== 'image/jpg' 
        && e.target.files[0].type !== 'image/jpeg'
        && e.target.files[0].type !== 'image/webp'
      ) return alert('Only Image are alowed');
    let imageExist = images.findIndex((el, index) => {
      if (el.name!== undefined) {
        if (el.name === e.target.files[0].name) {
          return el
        }
      } 
    })
    if (imageExist !== -1) return alert('image already added');
    images.push(e.target.files[0]);
    let url =await  URL.createObjectURL(images[images.length - 1]);
    let parentNode = imgInput.parentNode;
    let img= document.createElement('img');
    img.src = url ;
    img.style.width = '150px';
    img.style.height= '150px';
    img.style.borderRadius='7px';
    img.style.backgroundSize = 'cover'
    img.style.backgroundPosition = 'top center';
    imgInputLabel.remove();
    parentNode.appendChild(img);
    parentNode.appendChild(imgInputLabel)
    
    })
  }
{
    let gm_section=document.querySelectorAll('[gm_section]')


    function ChangeSection(index) {
        gm_section.forEach((el,ind) => (ind === index) ? el.style.display='flex': el.style.display='none');
    }


    document.addEventListener('click', e => {
        e.preventDefault() 
        // if (e.target.tagName === 'A' && e.target.parentNode.className === "gm-nav-main") 
        if (e.target.id === 'massage_href') return ChangeSection(0) ;
        if (e.target.id ==='events_href') return ChangeSection(1) ;
        if (e.target.id ==='notes_href') return ChangeSection(2) ;
        if (e.target.id ==='settings_href') return ChangeSection(3) ;
        if (e.target.id ==='upload-event-button') return ChangeSection(4) ;

    })
}
{//massage container
   //global in this scope
   let container = document.querySelector(`[class="chat-box-container"]`);
   let chatBox = container.querySelector('.chat-massage-cobtainer');
   var lastMassageId=0;
   
   
   //checkmassage function
   async function checkIfAnyMassage() {
    try {
    console.log('//check is any massage');
    let res=await fetch(window.location.origin + '/api/chat-api/check-grand-master-group-massage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            lastMassageId
        })
    });
    if (res.status === 200) {
        let {has_massage,massages} =await res.json();
        if (has_massage) {
            console.log({Yes:'//has massage'});
            lastMassageId=massages[massages.length-1].massage_time;
            for (let i = 0; i < massages.length; i++) {
                let {massage,massager_name}  = massages[i];
                if (massager_name !== gmName) {
                    let div = document.createElement('div');
                    div.className = 't-massage';
                    div.innerHTML = `
                    <div class="massage">
                    <b class="sender-name">${massager_name}</b>
                    <p class="sender-p">${massage}</p>
                    </div>
                    `;
                    chatBox.appendChild(div)
                }
            }
        }
    }
    } catch (error) {
        console.log(error);
    } finally { 
        setTimeout(() => checkIfAnyMassage(), 1000);
    }
   }

   //check Intersection
    let seen = false;

    let observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !seen) {
        seen = true;
        fetch(window.location.origin + '/api/chat-api/get-grand-master-group-massage')
            .then(res => {
                if (res.status === 200) {
                    return res.json()
                }
                return {}
            })
            .then( async ({ massages }) => {
                if (massages) {
                    for (let i = 0; i < massages.length; i++) {
                        const { massage_time, massager_name, massage } = massages[i];
                        console.log({ massage });

                        if (i === massages.length - 1) lastMassageId = massage_time;
                        if (massager_name === gmName) {
                            let div = document.createElement('div');
                            div.className = 'f-massage';
                            div.innerHTML = `
                            <div class="massage">
                            <b class="sender-name">You</b>
                            <p class="sender-p">${massages[i].massage}</p>
                            </div>
                            `;
                            chatBox.appendChild(div)
                        }
                        if (massager_name !== gmName) {
                            let div = document.createElement('div');
                            div.className = 't-massage';
                            div.innerHTML = `
                            <div class="massage">
                            <b class="sender-name">${massager_name}</b>
                            <p class="sender-p">${massages[i].massage}</p>
                            </div>
                            `;
                            chatBox.appendChild(div)
                        }
                    }

                    await checkIfAnyMassage()
                }
            })
            .catch(e => console.error(e))
    }})
    observer.observe(chatBox)


    
    //send massage functionality
    let fethingdata = false;
    let btn = container.querySelector('.send-chat-massage-containar-btn');
    btn.style.transition = 'all .4s ease';
    let textarea = container.querySelector('textarea');

    btn.addEventListener('click', e => {
        if (!textarea.value) return textarea.style.border = '2px solid red';
        if (!fethingdata) {
            try {
                textarea.setAttribute('disabled','true')
                btn.style.opacity = .7;
                fethingdata = true;
                fetch(window.location.origin + '/api/chat-api/add-grand-master-group-massage', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: gmName,
                        massage: textarea.value
                    })
                })
                    .then(e => {
                        if (e.status === 200) {
                            let div = document.createElement('div');
                            div.className = 'f-massage';
                            div.innerHTML = `
                            <div class="massage">
                            <b class="sender-name">You</b>
                            <p class="sender-p">${textarea.value}</p>
                            </div>
                            `;
                            chatBox.appendChild(div);
                            textarea.value=null;
                        }
                    })
            } catch (e) {
                console.log(e);       
            } finally {
                btn.style.opacity = 1;
                textarea.removeAttribute('disabled')
                fethingdata = false;
            }
        }
    })


    textarea.addEventListener('keypress', e => textarea.style.border = '.3px solid #ccc')
}