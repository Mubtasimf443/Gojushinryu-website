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
        if (e.target.tagName === 'A') e.preventDefault() 
        if (e.target.id ==='massage_href') return ChangeSection(0) ;
        if (e.target.id ==='events_href') return ChangeSection(1) ;
        if (e.target.id ==='notes_href') return ChangeSection(2) ;
        if (e.target.id ==='settings_href') return ChangeSection(3) ;
        if (e.target.id ==='upload-event-button') return ChangeSection(4) ;

        
    })
}
















