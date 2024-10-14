/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/
{
    let containar =document.querySelector('.events');
    let seen =false ;
    let observer =new IntersectionObserver(async ent => {
        if (ent[0].isIntersecting && seen===false)  {
            try {
                seen=true ;
                let res= await fetch(window.location.origin +'/api/api_s/get-gm-events',{
                    method :'POST',
                    headers :{
                        'Content-Type':'application/json'
                    },
                    body :JSON.stringify({
                        gm_id:gmID
                    })
                });
                if (res.status===200) {
                    let {events}=await res.json();
                    console.log({events});
                    
                    for (let i = 0; i < events.length; i++) {
                        let {thumb,title,Date}  = events[i];
                        let div =document.createElement('div');
                        div.className='event';
                        div.setAttribute('event-date',Date)
                        div.innerHTML =`
                        <div class="eventBoxf">
                        <img class="event-img" src="${thumb}" alt="">
                        <h4>${title}</h4>
                        </div>
                        <div class="icons">
                        <button event-date="${Date}">
                        <i class="fa-solid fa-trash"></i>
                        </button>
                        </div>
                        `;

                        containar.appendChild(div)


                        div.querySelector('button').addEventListener('click' ,async e => {
                            let date  =e.target.tagName==='I' ? e.target.parentNode.getAttribute('event-date') : e.target.getAttribute('event-date');
                            if (!date) return
                            try {
                                console.log({date});
                                
                              containar.querySelectorAll('.event').forEach(el => {
                                if (el.getAttribute('event-date') ==date) {el.style.opacity =.7; setTimeout(() => el.style.opacity=1, 3000); }
                              })

                              let res =await fetch(window.location.origin + '/api/api_s/delete-event',{
                                method :'DELETE',
                                headers :{
                                    'Content-Type':'application/json'
                                },
                                body :JSON.stringify({
                                    date:Number(date)
                                })
                              })
                              console.log({res});
                              if (res.status ===200 ) {
                                containar.querySelectorAll('.event').forEach(el => {
                                    if (el.getAttribute('event-date')==date) el.remove()
                                })
                              }

                            } catch (error) {
                                console.error({error});
                            }
                        })

                    }

                }
            } catch (error) {
                
            } finally {

            }
        }
    })



    observer.observe(containar);
}