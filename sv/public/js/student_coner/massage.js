/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/
{

    let container=document.querySelector(`[class="chat-box-container"]`);
    let massageSendBtn=container.querySelector(`.send-chat-massage-containar-btn`)
    let textarea=container.querySelector(`[sendMassageTextArrea]`)
    let chatMassageContainer =container.querySelector('.chat-massage-cobtainer')

   
    // setTimeout(async() => {
    //     try {
    //        let res=await fetch(window.location.origin+ '/api/chat-api/get-admin-massage-status-and-massage');
        
    //        let {has_massage}=await res.json();
    //        if (!has_massage) return
    //     } catch (error) {
    //         console.log({error});
    //     }
    // }, 2000);



    massageSendBtn.addEventListener('click', async e => {

        if (!textarea.value) return textarea.style.border='2px solid red';
        textarea.style.border='0.3px solid rgba(0, 0, 0, 0.349)';
        try {
            massageSendBtn.style.opacity=.7;
            let res=await fetch(window.location.origin+'/api/chat-api/send-massage-to-admin-from-student',{
                headers:{
                    'Content-type':'application/json',
                },
                method:'POST',
                body:JSON.stringify({massage:textarea.value})
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
            massageSendBtn.style.opacity=1;
        }

    })



function checkMassage(url) {
    return setTimeout(async () => {
        try {
            let res=await fetch(window.location.origin+url) ;
            if (res.status===200) {
                let {seen_massage, massages}=await res.json();
                if (seen_massage) {
                    chatMassageContainer.innerHTML='';
                    for (let i = 0; i < seen_massage.length; i++) {
                        let {name,massage} = seen_massage[i];
                        let div=document.createElement('div');
                        div.className='t-massage';
                        div.innerHTML=`
                        <div class="massage">
                        <b class="sender-name">
                        ${name}
                        </b>
                        <p class="sender-p">
                        ${massage}
                        </p>
                        </div>
                        `;
                        chatMassageContainer.appendChild(div);
                    }
                }
                if (massages) {
                    for (let i = 0; i < massages.length; i++) {
                        let {name,massage} = massages[i];
                        let div=document.createElement('div');
                        div.className='t-massage';
                        div.innerHTML=`
                        <div class="massage">
                        <b class="sender-name">
                        ${name}
                        </b>
                        <p class="sender-p">
                        ${massage}
                        </p>
                        </div>
                        `;
                        chatMassageContainer.appendChild(div);
                        notifyUser({
                            title :'You have a new Massage',
                            body:massage,
                        })
                    }
                }
            }
            return checkMassage('/api/chat-api/get-admin-massage-status-and-massage')
        } catch (error) {
            console.error({error});
        }
    }, 1000);
}

checkMassage('/api/chat-api/get-admin-massage-what-is-seen')

async function f(url,body,method) {
   let res=await fetch(window.location.origin + url,{
    headers:{
        'Content-type':'application/json',
    },
    method:method ? method : 'POST',
    body:JSON.stringify(body)
   })
   let response = await res.json();

   return {response,res}
}


async function notifyUser({title,body}) {
    try {
        function notify(perm) {
           
            let n = new Notification(title,{
                    body,
                    icon:window.location.origin+'/img/link_icon.png'
            });
            n.addEventListener('click', e=> n.close() );
            n.addEventListener('show', e=> console.log(n))
            console.log(perm);
        }
        Notification.requestPermission().then(notify)
    } catch (error) {
      console.log(error);
        
    }
    
} 
notifyUser({title:'Hi',body:'How are you'})


}