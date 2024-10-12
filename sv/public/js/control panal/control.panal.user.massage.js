/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allah,  By the marcy of Allah,  I will gain success
*/


{
    let container= document.querySelector('#student_massages_container_for_live_massage') ;
    let btn =container.querySelector('.send-chat-massage-containar-btn');
    let textarea=container.querySelector(`[sendMassageTextArrea]`);
    let chatMassageContainer=container.querySelector(`[class="chat-massage-cobtainer"]`);


    btn.addEventListener('click',async e=> {
        if (!textarea.value) return textarea.style.border='2px solid red';
        textarea.style.border='0.3px solid rgba(0, 0, 0, 0.349)';
        try {
            let student_id=container.getAttribute('student_id');
            if (!student_id) return alert('emty');

            
            btn.style.opacity=.7;
            let res=await fetch(window.location.origin+'/api/chat-api/send-massage-to-student-from-admin',{
                headers:{
                    'Content-type':'application/json',
                },
                method:'POST',
                body:JSON.stringify({
                    massage:textarea.value ,
                    student_id :Number(student_id)
                })
            });
            
            if (res.status===200) {
                let div =document.createElement('div');
                div.className='f-massage';
                div.innerHTML=`
                <div class="massage">
                <b class="sender-name">You</b>
                <p class="sender-p">
                ${textarea.value}
                </p>
                </div>
                `
                chatMassageContainer.appendChild(div)
                textarea.value=null;
            }
        } catch (error) {
            console.log({error});
            
        } finally {
            btn.style.opacity=1;
        }
    })




    function checkNewMassage() {
        return setTimeout(async () => {
            let id=container.getAttribute('student_id');
           
            if (!id) {
                console.log('id is not defined');
                return checkNewMassage()
            }


            let respose=await fetch(window.location.origin +'/api/chat-api/check-user-has-send-massage-or-not',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    id:Number(id)
                })
            });  
            let r=await respose.json();
            

            let {massages}=r//res;
            console.log({massages});
            
            if (massages) {
                for (let i = 0; i < massages.length; i++) {
                    let {name, massage} = massages[i];
                    let d= document.createElement('div');
                    d.className='t-massage';
                    d.innerHTML=`
                    <div class="massage">
                    <b class="sender-name">
                    ${name}
                    </b>
                    <p class="sender-p">
                    ${massage}
                    </p>
                    </div>
                    `;
                    chatMassageContainer.appendChild(d);
                }
                return checkNewMassage()
            }
            if (!massages) return checkNewMassage()


        }, 1000);


    }

    checkNewMassage()


}