/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/



{
    let gm_section=document.querySelectorAll('[st_section]')


    function ChangeSection(index) {
        gm_section.forEach((el,ind) => (ind === index) ? el.style.display='flex': el.style.display='none');
    }


    document.addEventListener('click', e => {
        if (e.target.tagName === 'A') e.preventDefault() 
        if (e.target.id ==='massage_href') return ChangeSection(1) ;
        if (e.target.id ==='orders_href') return ChangeSection(4) ;
        if (e.target.id ==='info_href') return ChangeSection(2) ;
        if (e.target.id ==='settings_href') return ChangeSection(3) ;
        if (e.target.id ==='notification_href') return ChangeSection(0) ;
        if (e.target.parentNode.parentNode.id ==='massage_href') return ChangeSection(1) ;
        if (e.target.parentNode.parentNode.id ==='orders_href') return ChangeSection(4) ;
        if (e.target.parentNode.parentNode.id ==='info_href') return ChangeSection(2) ;
        if (e.target.parentNode.parentNode.id ==='settings_href') return ChangeSection(3) ;
        if (e.target.parentNode.parentNode.id ==='notification_href') return ChangeSection(0) ;
        if (e.target.parentNode.id ==='massage_href') return ChangeSection(1) ;
        if (e.target.parentNode.id ==='orders_href') return ChangeSection(4) ;
        if (e.target.parentNode.id ==='info_href') return ChangeSection(2) ;
        if (e.target.parentNode.id ==='settings_href') return ChangeSection(3) ;
        if (e.target.parentNode.id ==='notification_href') return ChangeSection(0) ;
        
    });

    document.getElementById('s-sec-profile-input').addEventListener('change',async e =>{
        if (e.target.files[0].type !== 'image/png' 
            && e.target.files[0].type !== 'image/jpg' 
            && e.target.files[0].type !== 'image/jpeg'
            && e.target.files[0].type !== 'image/webp'
          ) return alert('Only Image are alowed');
          thumb = e.target.files[0];
          let url = await URL.createObjectURL(thumb);
          let thumbInputLabel =e.target.parentNode;
          thumbInputLabel.style.background = 'url(' +url +')';
          thumbInputLabel.style.backgroundSize = 'cover';
          thumbInputLabel.style.backgroundPosition = 'center center';
          thumbInputLabel.style.backgroundRepeat = 'no-repeat';

    });
}


