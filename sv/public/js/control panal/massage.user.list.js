/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/
{
   let seen =false;
   let container= document.querySelector('.massage-list-box');
   let massages =document.querySelector('.massages');
   let massageList=[];
   let student_massages_container_for_live_massage= document.querySelector('#student_massages_container_for_live_massage') ;
   

   let observer =new IntersectionObserver(async entries => {
     if ( entries[0].isIntersecting && !seen) {
        seen=true;
        try {
            let res=await fetch(window.location.origin+'/api/chat-api/get-user-massage-list')

            if (res.status ===200 ) {
                let {userMassageList}=await res.json();
                console.log({userMassageList});
                if (userMassageList.length !==0) massageList=userMassageList

                for (let i = 0; i < userMassageList.length; i++) {
                    
                    let {student_image,not_seen_massage,seen_massage,student_ID} = userMassageList[i];
                    console.log({
                        student_image,not_seen_massage,seen_massage,student_ID
                    })

                    let currentMassage={};
                    if (not_seen_massage.length) {
                        currentMassage.name=not_seen_massage[not_seen_massage.length-1].name;
                        currentMassage.massage=not_seen_massage[not_seen_massage.length-1].massage;
                    }
                    if (!not_seen_massage.length) {
                        currentMassage.name=seen_massage[seen_massage.length-1].name;
                        currentMassage.massage=seen_massage[seen_massage.length-1].massage;
                    }


                    let div =document.createElement('div');
                    console.log(div);
                    div.style.display='flex';
                    div.className='massage';
                    div.setAttribute('student_id',student_ID);
                    div.innerHTML=`
                    <img src="${student_image ?? '/img/avatar.png'}"  class="massage-image">
                    <div class="massage-txt-div">
                    <b>${currentMassage.name}</b>
                    <span>
                    ${currentMassage.massage}
                    </span>
                    </div>
                    <div active class="massage-quantity">${not_seen_massage.length}</div>
                    `;
                    
                    massages.appendChild(div);
                    div.addEventListener('click', e => {
                        e.stopPropagation();
                        let student_ID=false;

                        if (e.target.parentNode.className==='massage') student_ID=e.target.parentNode.getAttribute('student_id')
                        if (e.target.className==='massage') student_ID=e.target.getAttribute('student_id')
                        if (e.target.parentNode.parentNode.className==='massage') student_ID=e.target.parentNode.parentNode.getAttribute('student_id')
                        student_ID=Number(student_ID);
                        let massageData= massageList.find(el => el.student_ID === student_ID);
                        if (!massageData) return
                        let {student_image,seen_massage,not_seen_massage} =massageData;
                        let name = not_seen_massage.length===0 ? seen_massage[0].name : not_seen_massage[0].name;
                        student_massages_container_for_live_massage.querySelector(`[massager_image]`).setAttribute('src',student_image)
                        student_massages_container_for_live_massage.querySelector(`[massager_name]`).innerHTML=name;
                        document.querySelectorAll(`[ct_section]`).forEach(el => el.style.display = 'none');
                        student_massages_container_for_live_massage.style.display='flex';
                        let massageContainer=student_massages_container_for_live_massage.querySelector('.chat-massage-cobtainer')
                        let massagesHtml='';

                        for (let i = 0; i < seen_massage.length; i++) {
                            let {name ,massage}=seen_massage[i];
                            massagesHtml=massagesHtml+`
                            <div class="t-massage">
                            <div class="massage">
                            <b class="sender-name">
                            ${name}
                            </b>
                            <p class="sender-p">
                            ${massage}
                            </p>
                            </div>
                            <span class="massage-time"></span>
                            </div>
                            `
                            
                        }

                        for (let i = 0; i < not_seen_massage.length; i++) {
                            let {name ,massage}=not_seen_massage[i];
                            massagesHtml=massagesHtml+`
                            <div class="t-massage">
                            <div class="massage">
                            <b class="sender-name">
                            ${name}
                            </b>
                            <p class="sender-p">
                            ${massage}
                            </p>
                            </div>
                            <span class="massage-time"></span>
                            </div>
                            `
                            
                        }


                        massageContainer.innerHTML=massagesHtml;
                        student_massages_container_for_live_massage.setAttribute('student_id',student_ID);







                    })
                    
                }
            }
        } catch (error) {
            
        }
        
     }
   })


observer.observe(massages)


}