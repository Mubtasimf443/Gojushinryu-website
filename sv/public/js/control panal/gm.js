/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/

{

let gmListContainer = document.querySelector('#list-of-gm')

let GmIsSeen = false;
let Observer = new IntersectionObserver( entry => {
  
  if (entry[0].target.id ==='list-of-gm'  && entry[0].isIntersecting) {
    if (!GmIsSeen) {
      fetch(window.location.origin + '/api/api_s/find-grand-master')
      .then( res => res.json())
      .then(({error, success, gm})=> {
        if (error) return alert('Failed To load Grand Master Data')
        
        if (success && gm) {
          let grandMaster_s = gmListContainer.querySelector('.gm_s');
          if (gm.length === 0 )  {
            grandMaster_s.innerHTML = grandMaster_s.innerHTML + `<div class="gm_">
            <b> 
            There is No Grand Master
                </b> 
            </div>`
            return
          } 
          gm.forEach(el => {
            grandMaster_s.innerHTML = grandMaster_s.innerHTML +
            `<div gm_id="${el.id}" class="gm_">
                   <img src="${el.image}">     
                   <b>
                   ${el.first_name + ' ' + el.last_name} 
                   </b>
                   <button class="gm-list-action">
                     Action
                   </button>
             </div>`
            return
          });
        }
      })
     .catch( (e)=>  alert('Failed To load Grand Master Data')
     )
    .finally( e => GmIsSeen=true   )
    }
  }
}
)


Observer.observe(gmListContainer)
}
