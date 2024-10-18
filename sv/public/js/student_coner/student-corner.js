/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/

{

  let busy =false;
    let gm_section=document.querySelectorAll('[st_section]')
    function ChangeSection(index) {
        gm_section.forEach((el,ind) => (ind === index) ? el.style.display='flex': el.style.display='none');
    }
    async function ChangeUserDataRequest() {
      let simbolError ='you can not use < , > , * , $ , { , } , [ , ] , (, ) ';
      let name =document.getElementById('s-sec-name-inp').value ;
      let age =document.getElementById('s-sec-age-inp').valueAsNumber ;
      let bio =document.getElementById('s-sec-bio-inp').value ;
      let gender =document.getElementById('s-sec-gender-inp').value ;
      let country =document.getElementById('s-sec-country-inp').value ;
      let District =document.getElementById('s-sec-District-inp').value ;
      let city =document.getElementById('s-sec-city-inp').value ;
      let street =document.getElementById('s-sec-street-inp').value ;
      let postcode =document.getElementById('s-sec-post-code-inp').valueAsNumber ;
      if (!name )  return alert('name is not define');
      if (!age)  return alert('age is not define');
      if (!bio)  return alert('bio is not define');
      if (!gender)  return alert('gender is not define');
      if (!country)  return alert('counrty is not define');
      if (!District)  return alert('district is not define');
      if (!city)  return alert('city is not define');
      if (!street)  return alert('street is not define');
      if (!postcode)  return alert('postcode is not define or 0');
      if (typeof postcode !== 'number') return alert('post code Should Be a number');
      if (typeof age !== 'number') return alert('age Should Be a number');
      if (name.length >30)  return alert('name is to big');
      if (bio.length >120)  return alert('bio is to big');
      if (country.length >40)  return alert('country is to big');
      if (District.length >38)  return alert('district is to big');
      if (city.length >30)  return alert('city is to big');
      if (street.length >45)  return alert('street is to big');
      if (name.length <6)  return alert('name is to short');
      if (bio.length <60)  return alert(' bio is to short ,less than 60 charecters');
      if (country.length <3)  return alert('country is to short');
      if (District.length <4)  return alert('district is to short');
      if (city.length <4)  return alert('city is to short');
      if (street.length <8)  return alert('street is to short');
      if (postcode >10000) return alert('post code should be under 10000');
      if (postcode <600) return alert('post code should be greater than 600');
      if (gender.toLowerCase() !== 'male' && gender.toLowerCase() !== 'female')  return alert('male and female should be use in gender');
      if (name.includes('<'))  return alert(simbolError);
      if (bio.includes('<'))  return alert(simbolError);
      if (country.includes('<'))  return alert(simbolError);
      if (District.includes('<'))  return alert(simbolError);
      if (city.includes('<'))  return alert(simbolError);
      if (street.includes('<'))  return alert(simbolError);
      if (name.includes('>'))  return alert(simbolError);
      if (bio.includes('>'))  return alert(simbolError);
      if (country.includes('>'))  return alert(simbolError);
      if (District.includes('>'))  return alert(simbolError);
      if (city.includes('>'))  return alert(simbolError);
      if (street.includes('>'))  return alert(simbolError);
      if (name.includes('*'))  return alert(simbolError);
      if (bio.includes('*'))  return alert(simbolError);
      if (country.includes('*'))  return alert(simbolError);
      if (District.includes('*'))  return alert(simbolError);
      if (city.includes('*'))  return alert(simbolError);
      if (street.includes('*'))  return alert(simbolError);
      if (name.includes('{'))  return alert(simbolError);
      if (bio.includes('{'))  return alert(simbolError);
      if (country.includes('{'))  return alert(simbolError);
      if (District.includes('{'))  return alert(simbolError);
      if (city.includes('{'))  return alert(simbolError);
      if (street.includes('{'))  return alert(simbolError);
    if (name.includes('('))  return alert(simbolError);
    if (bio.includes('('))  return alert(simbolError);
    if (country.includes('('))  return alert(simbolError);
    if (District.includes('('))  return alert(simbolError);
    if (city.includes('('))  return alert(simbolError);
    if (street.includes('('))  return alert(simbolError);
    if (name.includes('['))  return alert(simbolError);
    if (bio.includes('['))  return alert(simbolError);
    if (country.includes('['))  return alert(simbolError);
    if (District.includes('['))  return alert(simbolError);
    if (city.includes('['))  return alert(simbolError);
    if (street.includes('['))  return alert(simbolError);
    if (!ImageUrlForChangeMaking && needsToUpdataProfileImage)  return alert('please Click the image to change,You Must Change The Image');
    let btn= document.getElementById('update-user-info-btn');
    btn.style.transition='all 1s ease';
    btn.style.opacity=.6;
    let jsonObject = JSON.stringify({
      name,age,gender,bio,District,city,country,street,postcode,ImageUrlForChangeMaking,needsToUpdataProfileImage
    }) ;
    fetch(window.location.origin +'/api/api_s/Update-User-Data' ,{
      headers :{
      'Content-type' :'application/json'
      } ,
      method:'PUT',
      body:jsonObject
    })
    .then( e => e.json())
    .then(({error ,success}) => {
      if (error) return alert(error);
      if (success) {
       btn.style.boxSizing='content-box'
       btn.style.background='green';
       let i= document.createElement('i');
       i.className='fa-solid fa-check';
       btn.innerText ='success';
       btn.style.border='2px solid green';
       btn.appendChild(i);
       setTimeout(() => {
        window.location.reload()
       }, 600000);
      }
    })
    .catch(e =>console.log(e))
    .finally(e=>btn.style.opacity=1)

    }
    async function ChangeUserPasswordRequest() {
      if (busy) return
      let password =document.getElementById('s-sec-password-inp').value ;
      if ( typeof name !== 'string')  return
      if (password.length >30)  return alert('password is to big');
      if (password.length <6) return alert('password is to small');
      let simbolError='you can not use < , > , * , $ , { , } , [ , ] , (, )';
      if (password.includes('['))  return alert(simbolError);
      if (password.includes(']'))  return alert(simbolError);
      if (password.includes('{'))  return alert(simbolError);
      if (password.includes('}'))  return alert(simbolError);
      if (password.includes('('))  return alert(simbolError);
      if (password.includes(')'))  return alert(simbolError);
      if (password.includes('&'))  return alert(simbolError);
      if (password.includes('`'))  return alert(simbolError);
      if (password.includes('"'))  return alert(simbolError);
      if (password.includes("'"))  return alert(simbolError);
      if (password.includes('|'))  return alert(simbolError);
      let btn=document.getElementById('s-sec-change-password-btn') ;
      btn.style.opacity=.6;
      busy=true;
      fetch(window.location.origin +'/api/api_s/Update-User-Password',{
        headers :{
        'Content-type' :'application/json'
        } ,
        method:'PUT',
        body:JSON.stringify({password})
      })
      .then( e => e.json())
      .then(({error ,success}) => {
        if (error) return alert(error);
        if (success) {
         btn.style.boxSizing='content-box'
         btn.style.background='green';
         let i= document.createElement('i');
         i.className='fa-solid fa-check';
         btn.innerText ='success';
         btn.style.border='2px solid green';
         btn.style.color='white';
         btn.appendChild(i);
        }
      })
      .catch(e =>console.log(e))
      .finally(
        e=>{btn.style.opacity=1;
        busy=false
      })
    }

    document.addEventListener('click', e => {
       if (e.target.id === 'update-user-info-btn') {e.preventDefault();return ChangeUserDataRequest();}
        if (e.target.tagName === 'A' && e.target.parentNode.className ==='st-nav-main') e.preventDefault() 
        if (e.target.id ==='massage_href') return ChangeSection(1) ;
        if (e.target.id ==='orders_href') return ChangeSection(4) ;
        if (e.target.id ==='info_href') return ChangeSection(2) ;
        if (e.target.id ==='settings_href') return ChangeSection(3) ;
        if (e.target.id ==='notification_href') return ChangeSection(0) ;
        if (e.target.id ==='membership_href') return ChangeSection(5) ;
        if (e.target.id ==='course_enrollments_href') return ChangeSection(6) ;
        if (e.target.parentNode.parentNode.id ==='massage_href') return ChangeSection(1) ;
        if (e.target.parentNode.parentNode.id ==='orders_href') return ChangeSection(4) ;
        if (e.target.parentNode.parentNode.id ==='info_href') return ChangeSection(2) ;
        if (e.target.parentNode.parentNode.id ==='settings_href') return ChangeSection(3) ;
        if (e.target.parentNode.parentNode.id ==='notification_href') return ChangeSection(0) ;
        if (e.target.parentNode.parentNode.id ==='membership_href') return ChangeSection(5) ;
        if (e.target.parentNode.parentNode.id ==='course_enrollments_href') return ChangeSection(6) ;
        if (e.target.parentNode.id ==='massage_href') return ChangeSection(1) ;
        if (e.target.parentNode.id ==='orders_href') return ChangeSection(4) ;
        if (e.target.parentNode.id ==='info_href') return ChangeSection(2) ;
        if (e.target.parentNode.id ==='settings_href') return ChangeSection(3) ;
        if (e.target.parentNode.id ==='notification_href') return ChangeSection(0) ;
        if (e.target.parentNode.id ==='membership_href') return ChangeSection(5) ;
        if (e.target.parentNode.id ==='course_enrollments_href') return ChangeSection(6) ;
        if (e.target.id ==='s-sec-change-password-btn') return ChangeUserPasswordRequest()
    });
    document.getElementById('s-sec-profile-input').addEventListener('change',async e =>{
        if (e.target.files[0].type !== 'image/png' 
            && e.target.files[0].type !== 'image/jpg' 
            && e.target.files[0].type !== 'image/jpeg'
            && e.target.files[0].type !== 'image/webp'
          ) return alert('Only Image are alowed');

          thumb =  e.target.files[0];
        //   let url = await URL.createObjectURL(thumb);
           let form =new FormData();
          await form.append('img', thumb)
          let thumbInputLabel =e.target.parentNode;
          thumbInputLabel.style.backgroundImage='url("'+window.location.origin +'/img/gif.gif' +'")';
          thumbInputLabel.style.backgroundSize = 'contain';
          thumbInputLabel.style.backgroundPosition = 'center center';
          thumbInputLabel.style.backgroundRepeat = 'no-repeat';
          fetch(window.location.origin +'/api/api_s/upload-image-for-10-minutes',{
            method :'POST',
            body :form
          })
          .then(data => data.json()
          .then(({success ,error,link})=> {
            if (error) return alert(error);
            if (success) {
            thumbInputLabel.style.backgroundImage='url("'+link+'")';
            thumbInputLabel.style.backgroundSize = 'cover';
            thumbInputLabel.style.backgroundPosition = 'center center';
            thumbInputLabel.style.backgroundRepeat = 'no-repeat';
            ImageUrlForChangeMaking=link;
            needsToUpdataProfileImage=true;
            }
          })
          .catch(e =>console.log(e)))
          .catch(e => {
            console.log(e);
            
          })
    });

    
}


