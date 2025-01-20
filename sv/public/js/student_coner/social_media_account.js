/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/




{
    let containar=document.querySelector('#social-media-section'),fb_timeout,ln_timeout,tw_timeout,ig_timeout;
    let
        fb_status = containar.querySelector(`[fb_status]`),
        ln_status = containar.querySelector(`[ln_status]`),
        tw_status = containar.querySelector(`[tw_status]`),
        ig_status = containar.querySelector(`[ig_status]`);
    let seen=false;
    let observer = new IntersectionObserver(async function (entries) {
        if (entries[0].isIntersecting && !seen) {
            seen = true;
            let response = await fetch(window.location.origin + '/api/api_s/user-social-media');
            if (response.status === 200) {
                let medias=await response.json();
                (medias.facebook) && (containar.querySelector(`[Facebook]`).value=medias.facebook);
                (medias.linkedin) && (containar.querySelector(`[Linkedin]`).value=medias.linkedin);
                (medias.twitter) && (containar.querySelector(`[Twitter]`).value=medias.twitter);
                (medias.instagram) && (containar.querySelector(`[Instagram]`).value=medias.instagram);
            }
        }
    });
    observer.observe(containar);
    

    containar.querySelector(`[Facebook]`).addEventListener('input', function (event) {
        let value=event.target.value;
        clearTimeout(fb_timeout);
        fb_status.innerHTML='Updating...';
        fb_status.style.color='orange';
        fb_timeout=setTimeout(async function()  {
            let response=await fetch(window.location.origin + '/api/api_s/user-social-media/facebook', {
                method:'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ account: value })
            });
            if (response.status===202){
                fb_status.innerHTML='Saved';
                fb_status.style.color='green';
                return;
            } else {
                fb_status.innerHTML='Failed';
                fb_status.style.color='red';
                return;
            }
        }, 1500);
    });

    containar.querySelector(`[Linkedin]`).addEventListener('input', function (event) {
        let value=event.target.value;
        clearTimeout(ln_timeout);
        ln_status.innerHTML='Updating...';
        ln_status.style.color='orange';
        ln_timeout=setTimeout(async function()  {
            let response=await fetch(window.location.origin + '/api/api_s/user-social-media/linkedin', {
                method:'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ account: value })
            });
            if (response.status===202){
                ln_status.innerHTML='Saved';
                ln_status.style.color='green';
                return;
            } else {
                ln_status.innerHTML='Failed';
                ln_status.style.color='red';
                return;
            }
        }, 1500);
    });

    containar.querySelector(`[Twitter]`).addEventListener('input', function (event) {
        let value=event.target.value;
        clearTimeout(tw_timeout);
        tw_status.innerHTML='Updating...';
        tw_status.style.color='orange';
        tw_timeout=setTimeout(async function()  {
            let response=await fetch(window.location.origin + '/api/api_s/user-social-media/twitter', {
                method:'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ account: value })
            });
            if (response.status===202){
                tw_status.innerHTML='Saved';
                tw_status.style.color='green';
                return;
            } else {
                tw_status.innerHTML='Failed';
                tw_status.style.color='red';
                return;
            }
        }, 1500);
    });

    containar.querySelector(`[Instagram]`).addEventListener('input', function (event) {
        let value=event.target.value;
        clearTimeout(ig_timeout);
        ig_status.innerHTML='Updating...';
        ig_status.style.color='orange';
        ig_timeout=setTimeout(async function()  {
            let response=await fetch(window.location.origin + '/api/api_s/user-social-media/instagram', {
                method:'PUT', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ account: value })
            });
            if (response.status===202){
                ig_status.innerHTML='Saved';
                ig_status.style.color='green';
                return;
            } else {
                ig_status.innerHTML='Failed';
                ig_status.style.color='red';
                return;
            }
        }, 1500);
    });


    
}