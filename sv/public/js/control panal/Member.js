/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/
{

    let memberListContainer = document.querySelector('#list-of-member')  
    let memberIsSeen = false;
    let membersArray=[];
    let table =memberListContainer.querySelector('table');
    let popup =document.querySelector('#popup_for_membership_data')
    let fethingData=false ;

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

                let {name,thumb ,memberShipArray ,_id} = membersArray[i];
                let date =(
                  new Date(memberShipArray[0].id).getDate()+'-'+new Date(memberShipArray[0].id).getMonth()+'-'+ new Date(memberShipArray[0].id).getFullYear()
                );
                console.log(memberShipArray);
                
                let connectedBtn=Math.floor(Math.random()*1254894817219);
                let membershipcompnent=(()=> {
                  let a ='';
                  for (let i = 0; i < memberShipArray.length; i++) {
                    let {type,membership ,_id} = memberShipArray[i];
                    a =a+`<option 
                    c_btn="${connectedBtn}"
                    m_id="${_id}"
                    value="" >` + membership+'</option>'
                  }
                  return a
                })();
                let tr= document.createElement('tr');
                tr.innerHTML=`
                <td>
                <b>${i+1}</b>
                </td>
                <td>
                <img src="${thumb?? '/img/avatar.png'}" alt=""></td>
                <td>
                <strong>
                 ${name} 
                 </strong>
                 </td>

                 <td>
                 <select>${
                  membershipcompnent
                 }</select>
                 </td>
                 <td>
                 ${date}
                 </td>
                 <td> 
                 <button 
                 connencted_btn_id="${connectedBtn}"
                 member_id="${_id}"
                 membership_id="${memberShipArray[0]._id}"
                 class="action">
                 Details
                 </button>
                 </td>
                
                `
                table.appendChild(tr)

                tr.querySelector('button').addEventListener('click',async e => {
                  if (fethingData===true) return
                 
                  try {
                    e.target.style.opacity=.7

                    let _id=e.target.getAttribute('membership_id');
                    fethingData=true;
                    let res =await fetch(window.location.origin +'/api/api_s/find-membership-data' ,{
                      headers:{
                        'Content-Type':'application/json'
                      },
                      method:'POST',
                      body:JSON.stringify({
                        id:_id
                      })
                    })
                    let {data}=await res.json();
                    if (!data) {
                      e.target.style.background=red;
                      e.target.innerHTML='Error';
                    }
                    if (data) {
                      let {
                        membership_type,
                        membership_company,
                        membership_name,
                        fname ,
                        lname ,
                        email ,
                        phone ,
                        date_of_birth ,
                        country ,
                        city ,
                        district ,
                        postcode ,
                        gender,
                        doju_Name,
                        instructor,
                        current_grade,
                        previous_injury ,
                        is_previous_member,
                        experience_level ,
                        has_violance_charge,  
                        membership_expiring_date,
                        violance_charge,
                        permanent_disabillity  ,
                        has_permanent_injury        
                      } =data;
                      function sip(selector,value){//sip means set input value
                        try {
                          popup.querySelector(selector).setAttribute('value',value?value:'No Data')
                        }catch (e) {
                          console.log(e);
                          
                        }
                      }
                      sip(`[placeholder="membership_name"]`,membership_name)
                      sip(`[placeholder="membership_company"]`,membership_company)
                      sip(`[placeholder="membership_type"]`,membership_type)
                      sip(`[placeholder="fname"]`,fname)
                      sip(`[placeholder="lname"]`,lname)
                      sip(`[placeholder="email"]`,email)
                      sip(`[placeholder="phone"]`,phone)
                      sip(`[placeholder="Date of Birth"]`,date_of_birth)
                      sip(`[placeholder="country"]`,country)
                      sip(`[placeholder="City"]`,city)
                      sip(`[placeholder="district"]`,district)
                      sip(`[placeholder="postcode"]`,postcode)
                      sip(`[placeholder="gender"]`,gender)
                      sip(`[placeholder="doju_Name"]`,doju_Name)
                      sip(`[placeholder="instructor"]`,instructor)
                      sip(`[placeholder="current_grade"]`,current_grade)
                      sip(`[placeholder="previous_injury"]`,previous_injury)
                      sip(`[placeholder="experience_level"]`,experience_level)
                      sip(`[placeholder="is_previous_member"]`,is_previous_member)
                      sip(`[placeholder="has_violance_charge"]`,has_violance_charge)
                      sip(`[placeholder="membership_expiring_date"]`,membership_expiring_date)
                      sip(`[placeholder="violance_charge"]`,violance_charge)
                      sip(`[placeholder="permanent_disabillity"]`,permanent_disabillity)
                      sip(`[placeholder="has_permanent_injury"]`,has_permanent_injury)


                      popup.style.display='flex';
                    }

                  } catch (error) {
                    log(error);
                    e.target.style.background='red';
                    e.target.innerHTML='Error';
                  } finally {
                    fethingData= false;
                    e.target.style.opacity=1;
                  }
                })
                tr.querySelector('select').addEventListener('change',e => {
                  let id= e.target.selectedOptions[0].getAttribute('m_id');
                  let cbtnID=e.target.selectedOptions[0].getAttribute('c_btn')
                  console.log({
                    m_id:id
                  });
                  let btn= memberListContainer.querySelector(`[connencted_btn_id="${cbtnID}"]`)
                  btn.setAttribute('membership_id', id);
                })

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
    