/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/



const log= e => console.log(e)

{



    
    let gm_section=document.querySelectorAll('[ct_section]')
    let mainh2=document.querySelector('[main-h2]');

    function ChangeSection(index) {
        gm_section.forEach((el) => el.style.display='none');
    }
    document.addEventListener('click',async e => {
        if (e.target.parentNode.className ==="st-nav-main") { 
            e.preventDefault();
            await ChangeSection();
            ( function displayOn() {
                let d=  document.querySelector(`[targetedElement="${e.target.id}"]`)
                if (!d) {
                    alert("ERROR ,THE ERROR WILL BE UPDATED SOON");
                    gm_section[0].style.display="flex";
                    return
                }
                d.style.display="flex";
                mainh2.innerHTML=e.target.innerHTML;
                mainh2.querySelector('i').remove()
            })();
            
            // if (e.target.id ==='massage_href') return ChangeSection(0) ;
            // if (e.target.id ==='notification_href') return ChangeSection(1) ;
            // if (e.target.id ==='orders_href') return ChangeSection(2) ;
            // if (e.target.id ==='upload_post_href') return ChangeSection(3) ;
            // if (e.target.id ==='user_page_href') return ChangeSection(4) ;
        }
        if (e.target.tagName==='BUTTON') {
            
            if (e.target.className === 'gm-list-action') {
                console.log('a');
                
                document.querySelector('[id="popup_GM_action"]').style.display ='flex' ;return
            }
             else if (e.target.className==="popup-close-btn" && e.target.parentNode.className==='pp_btn_box'){
        
                let dom=e.target;
                for (let index = 1; index < 4;index= index+1) dom= dom.parentNode;
                dom.style.display='none';
                return
            } 
          
           
            
            
        }
    })
}
