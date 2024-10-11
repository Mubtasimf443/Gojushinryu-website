/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/

{ 
    let container=document.querySelector('#st-notification');
    let seen =false ;
    let massageContainer=container.querySelector('.Notification-massage-cobtainer')

    let observer=new IntersectionObserver(array=> {
        for (let i = 0; i < array.length; i++) {
            let {target,isIntersecting} = array[i];
            if (isIntersecting){
            let Function=() => {
                fetch(window.location.origin+'/api/api_s/remove-notification-form-database',{
                    headers:{
                        'Content-Type':'application/json'
                    },
                    method:'PUT',
                    body:JSON.stringify({
                        notificationId :Number(target.getAttribute('massage-id'))
                    })
                })
            }
            setTimeout(Function,35000);
        }
        }
    })


    setTimeout(async () => {
       let res= await fetch(window.location.origin +'/api/api_s/get-user-data')
       res =await res.json();
       if (!res.user) return
       let {notification} =res.user;
       log(notification)
       for (let i = 0; i < notification.length; i++) {
        const {id,title,massage} = notification[i];
        
        let div= document.createElement('div');
        let parentDiv=document.createElement('div')
        div.className='massage';
        div.setAttribute('massage-id',id)
        div.innerHTML=
        `
        <b>${title}</b>
        <p class="notification-paragrap">
          ${massage}
        </p>
        `;
        parentDiv.append(div)
        massageContainer.appendChild(parentDiv);
        observer.observe(div)
      }
    
    }, 1000);






var log=function(e) {console.log(e)}




}