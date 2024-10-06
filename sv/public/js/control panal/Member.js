/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/
{

    let memberListContainer = document.querySelector('#list-of-member')  
    let memberIsSeen = false;
    let Observer = new IntersectionObserver( entry => {
    
      if (entry[0].target.id ==='list-of-member' && entry[0].isIntersecting) {
        if (!memberIsSeen) {
            console.log('user');
            
            console.log(entry[0]);
          fetch(window.location.origin + '/api/api_s/find-member')
          .then( res => res.json())
          .then(({error, success, Member})=> {
            
            if (error) {
                console.log(error);
                return alert('Failed To load User Data')
            }
            
            if (success && Member) {
            memberListContainer.querySelector('[length]').innerHTML=Member.length + memberListContainer.querySelector('[length]').innerHTML;
              let members = memberListContainer.querySelector('.members');

              if (Member.length === 0 )  {
                members.innerHTML = members.innerHTML + `<div class="member">
                <b> 
            There is No Member
                    </b> 
                </div>`
                return
              } 
              Member.forEach(el => {
                let membershipListComponent ;
                
                for (let index = 0; index < el.memberShipArray.length; index++) {
                    const {Type , Organization} = el.memberShipArray[index];
                    membershipListComponent = 
                    `<div membership>
                    <span>${Type} Membership</span>
                    <span>${Organization.substring(0,10)}</span>
                    </div>`
                }
                members.innerHTML = members.innerHTML +
                `<div user_id="${el.id ?? el.email}" class="member">
                       <img src="${ el.thumb ?? '/img/avatar.png'}">     
                        <span class="name">
                            ${el.first_name + '' + el.last_name} 
                            </span>
                    <div class="col">
                        <div class="membership_box"> 
                        ${membershipListComponent}
                   </div>
                   </div>
                       <button class="user_list_action">
                         Action
                       </button>
                 </div>`
                return
              });
            }
          })
         .catch( (e)=>{  alert('Failed To load User');console.log(e)
         }
         )
        .finally( e => memberIsSeen=true   )
        }
      }
    }
    )
    
    
    Observer.observe(memberListContainer)
    
    }
    