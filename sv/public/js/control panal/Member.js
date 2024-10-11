/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/
{

    let memberListContainer = document.querySelector('#list-of-member')  
    let memberIsSeen = false;
    let membersArray=[];
    let table =memberListContainer.querySelector('table');



    let Observer = new IntersectionObserver( entry => {
    
      if (entry[0].target.id ==='list-of-member' && entry[0].isIntersecting) {
        if (!memberIsSeen) {
            
          fetch(window.location.origin + '/api/api_s/find-member')
          .then( res => res.json())
          .then(({error, success, Member})=> {
            
            if (error) {
                console.log(error);
                return alert('Failed To load User Data')
            }
            
            if (success && Member) {
              let members = memberListContainer.querySelector('.members');
              membersArray=Member;

              for (let i = 0; i < membersArray.length; i++) {
                let {name,thumb ,memberShipArray} = membersArray[i];
                let date =(
                  new Date(memberShipArray[0].id).getDate()+'-'+new Date(memberShipArray[0].id).getMonth()+'-'+ new Date(memberShipArray[0].id).getFullYear()
                );
                let tr= document.createElement('tr');
                tr.innerHTML=`
                <td>
                <b>${i+1}</b>
                </td>
                <td>
                <img src="${thumb}" alt=""></td>
                <td>
                <strong>
                 ${name} 
                 </strong>
                 </td>
                 <td>
                 ${date}
                 </td>
                 <td> <button class="action">Details</button></td>
                
                `
                table.appendChild(tr)


              }
              

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
    