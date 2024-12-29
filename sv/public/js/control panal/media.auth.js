
{
    let container =document.querySelector(`#settings-conatiner`);
    const v=(htmlElementSelector) => {
        let simbolerror='You can not use <,>,{,},[,],",,$'+ "`," + '"' ;
        let el=container.querySelector(htmlElementSelector);
        if (!el) throw new Error(`can not find using ${htmlElementSelector}`);
        let value=el.value;
        if (!value) {
            el.style.outline='2px solid red';
            throw new Error('value is not present');
        }   
        return value
      }


    let mediaAuthStatuses={
        tiktok:false , 
        youtube:false,
        linkedin:false,
        facebook:false
    }
    //auth function
    let youtubeApis={
        updating:false,
        async login (e) {
            e.preventDefault();
            if (this.updating) return;
            try {
                this.updating=true;
                e.target.style.transition = 'all .6s ease';
                e.target.style.opacity = .65;
                let res = await fetch(window.location.origin + '/api/media-api/youtube/generate-youtube-access-token-code');
                if (res.status === 200) {
                    let { url } = await res.json();
                    window.location.replace(url);
                    return;
                } else {
                    res=await res.json();
                    throw res;
                }
            } catch (error) {
                console.log({ error });
                e.target.style.opacity = 1;
                e.target.style.background = 'red';
            } finally {
                this.updating=false;
            }
        },
        async logout(e) {
            e.preventDefault();
            if (this.updating) return
            try {
                this.updating=true;
                let res=await fetch(window.location.origin+'/api/media-api/youtube/log-out');
                if (res.status ===204) {
                    mediaAuthStatuses={
                        ...mediaAuthStatuses,
                        youtube :false
                    };
                    updatedAllButtons(mediaAuthStatuses);
                }
            } catch (error) {
                console.error(error);
            } finally {
                this.updating=false;
                // e.target.removeEventListener('click', this.logout) ;
            }
        }
    }

    let linkedinApis={
        updating :false,
        async login(event) {
            if (mediaAuthStatuses.linkedin) return
            event.preventDefault();
            window.location.replace('/api/media-api/linkedin/auth');
        },
        async logout(event) {
            event.preventDefault();
            if (!mediaAuthStatuses.linkedin) return
            if (this.updating) return
            try {
                this.updating=true;
                let { status } = await fetch(window.location.origin + `/api/media-api/linkedin/log-out`);
                let btn = event.target;
                if (status === 204) {
                    mediaAuthStatuses={
                       ...mediaAuthStatuses,
                       linkedin:false
                    }
                    updatedAllButtons(mediaAuthStatuses);
                }
            } catch (error) {
                console.log(error);
            } finally{
                this.updating=false;
            }
            
        }
    }

    let tiktokApis={
        updating :false,
        async login(event) {
            event.preventDefault();
            window.location.replace('/api/media-api/tiktok/auth');
        },
        async logout(event) {
            event.preventDefault();
            if (!mediaAuthStatuses.tiktok) return
            if (this.updating) return
            try {
                this.updating=true;
                let { status } = await fetch(window.location.origin + `/api/media-api/tiktok/log-out`);
                let btn = event.target;
                if (status === 204) {
                    mediaAuthStatuses={
                       ...mediaAuthStatuses,
                       tiktok:false
                    }
                    updatedAllButtons(mediaAuthStatuses);
                }
            } catch (error) {
                console.log(error);
            } finally{
                this.updating=false;
            }
            
        }
    }

    let facebookApis={
        updating:false,
        async login(event) {
            event.preventDefault();
            window.location.replace('/api/media-api/facebook/auth');
        },
        async logout(event){
            event.preventDefault();
            if (!mediaAuthStatuses.tiktok) return
            if (this.updating) return
            try {
                this.updating=true;
                let { status } = await fetch(window.location.origin + `/api/media-api/facebook/log-out` , {method :'DELETE'});
                let btn = event.target;
                if (status === 204) {
                    mediaAuthStatuses={
                       ...mediaAuthStatuses,
                       facebook:false
                    }
                    updatedAllButtons(mediaAuthStatuses);
                }
            } catch (error) {
                console.log(error);
            } finally{
                this.updating=false;
            }
        }
    }
    //Auth Status check
    let seen = false;
    let observer = new IntersectionObserver(async (ent) => {
        if (!seen && ent[0].isIntersecting) {
            let res = await fetch(window.location.origin + '/api/media-api/status');
            if (res.status === 200) {
                res = await res.json();
                if (res.facebook !== undefined) {
                    log('updated')
                    mediaAuthStatuses={
                        ...mediaAuthStatuses,
                        ...res
                    };
                    updatedAllButtons(mediaAuthStatuses);
                    
                }
            }
        }
    });

    async function updatedAllButtons(medias) {
        let { tiktok, youtube, linkedin, facebook } = medias;
        if (youtube) {
            // container.querySelector(`[yt_status_icon]`).className = 'fa-solid fa-check';
            let btn = container.querySelector(`[auth_btn_youtube]`);
            btn.innerHTML = 'Logout <i class="fa-solid fa-right-from-bracket" style="color:white" ></i>';
            btn.style.background = 'darkgrey';
            btn.addEventListener('click', youtubeApis.logout)
        }
        if (!youtube) {
            // container.querySelector(`[yt_status_icon]`).className = 'fa-solid fa-close';
            let btn = container.querySelector(`[auth_btn_youtube]`);
            btn.style.background = 'black';
            btn.innerHTML = 'Login';
            btn.addEventListener('click', youtubeApis.login)
        }
        if (linkedin) {
            // container.querySelector(`[linkedin_status_icon]`).className ='fa-solid fa-check';
            // container.querySelector(`[linkedin_status_icon]`).style.color='green'
            let btn = container.querySelector(`[auth_btn_linkedin]`);
            btn.innerHTML = 'Logout <i class="fa-solid fa-right-from-bracket" style="color:white" ></i>';
            btn.style.background = 'darkgrey';
            btn.addEventListener('click',linkedinApis.logout)
        }
        if (!linkedin) {
            // container.querySelector(`[linkedin_status_icon]`).className = 'fa-solid fa-close';
            let btn = container.querySelector(`[auth_btn_linkedin]`);
            btn.style.background = 'black';
            btn.innerHTML = 'Login';
            btn.addEventListener('click', linkedinApis.login);
        }
        if (tiktok) {
            // container.querySelector(`[tiktok_status_icon]`).className = 'fa-solid fa-check';
            let btn = container.querySelector(`[auth_btn_tiktok]`);
            btn.innerHTML = 'Logout <i class="fa-solid fa-right-from-bracket" style="color:white" ></i>';
            btn.style.background = 'darkgrey';
            btn.addEventListener('click',tiktokApis.logout);
        }
        if (!tiktok) {
            // container.querySelector(`[tiktok_status_icon]`).className = 'fa-solid fa-close';
            let btn = container.querySelector(`[auth_btn_tiktok]`);
            btn.innerHTML = 'Login';
            btn.style.background = '#000';
            btn.addEventListener('click',tiktokApis.login);
        }
        if (facebook) {
            // container.querySelector(`[facebook_status_icon]`).className = 'fa-solid fa-check';
            let btn = container.querySelector(`[auth_btn_facebook]`);
            btn.innerHTML = 'Logout <i class="fa-solid fa-right-from-bracket" style="color:white" ></i>';
            btn.style.background = 'darkgrey';
            btn.addEventListener('click',facebookApis.logout);
        }
        if (!facebook) {
            // container.querySelector(`[facebook_status_icon]`).className = 'fa-solid fa-close';
            let btn = container.querySelector(`[auth_btn_facebook]`);
            btn.innerHTML = 'Login';
            btn.style.background = '#000';
            btn.addEventListener('click',facebookApis.login);
        }
    }
    observer.observe(container);

  


  
}