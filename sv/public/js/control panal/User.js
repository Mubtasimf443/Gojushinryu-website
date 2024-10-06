/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/
{
    let userListContainer = document.querySelector('#list-of-user')
    let savingUser = false;
    let userIsSeen = false;
    let Observer = new IntersectionObserver(entry => {
        if (entry[0].target.id === 'list-of-user' && entry[0].isIntersecting) {
            if (!userIsSeen) {
                console.log(entry[0]);
                fetch(window.location.origin + '/api/api_s/find-user')
                    .then(res => res.json())
                    .then(({ error, success, User }) => {
                        if (error) {
                            console.log(error);
                            return alert('Failed To load User Data')
                        }
                        if (success && User) {
                            userListContainer.querySelector('[length]').innerHTML = User.length + userListContainer.querySelector('[length]').innerHTML;
                            let users = userListContainer.querySelector('.users');
                            if (User.length === 0) {
                                users.innerHTML = users.innerHTML + `<div class="user">
            <b> 
        There is No User
                </b> 
            </div>`
                                return
                            }
                            User.forEach(el => {
                                console.log(el.country);

                                users.innerHTML = users.innerHTML +
                                    `<div
            user-email="${el.email}"
            user-name="${el.first_name + " " + el.last_name}"
            user-country="${el.country}"
            user-phone="${el.phone}"
            user-id="${el.id}"
            user-banned="${el.banned ? 1 : 0}"
            class="user">
                   <img src="${el.thumb ?? '/img/avatar.png'}">     
                    <span class="name">
                        ${el.first_name + ' ' + el.last_name} 
                        </span>
                <div class="col">
                <b>Joined</b> <span> 
                ${el.joining_date ?? '...Date'}
                </span>
               </div>
                   <button
                   parant-div-id-user-id=${el.id}
                   class="user_list_action">
                     Action
                   </button>
             </div>`
                                return
                            });
                        }
                    })
                    .catch((e) => { alert('Failed To load User'); console.log(e) })
                    .finally(e => userIsSeen = true)
            }
        }

    }
    )


    Observer.observe(userListContainer)

    userListContainer.addEventListener('click', e => {
        if (e.target.className === 'user_list_action') {
            let popup = document.querySelector('#popup_user_action')
            popup.style.display = 'flex';
            let parantUserBox = document.querySelector(`[user-id="${e.target.getAttribute('parant-div-id-user-id')}"]`)
            let inputs = popup.querySelectorAll('input');
            inputs[0].value = parantUserBox.getAttribute('user-name');
            inputs[1].value = parantUserBox.getAttribute('user-email');
            inputs[2].value = parantUserBox.getAttribute('user-phone');
            inputs[3].value = parantUserBox.getAttribute('user-country');
            inputs[4].value = parantUserBox.getAttribute('user-id');
            let closeBtn = popup.querySelector('.popup-close-btn');
            let select = popup.querySelector('select');
            let saveBtn = popup.querySelector('.user-save-btn');
            saveBtn.style.opacity = .7;
            select.selectedIndex = parantUserBox.getAttribute('user-banned') ? 1 : 0;
            popup.setAttribute('updated', '0');
            //0 === false
            // 1===true

            closeBtn.addEventListener('click', e => savingUser ? popup.style.display = 'flex' : popup.style.display = 'none')

            function selectFunction(e) {

                let statement = document.querySelector(`[user-id="${inputs[4].value}"]`).getAttribute('user-banned') == select.selectedIndex;
                if (statement) {
                    alert(0)
                    popup.setAttribute('updated', '0');
                    saveBtn.style.opacity = .7;
                    return
                }
                alert(1)
                popup.setAttribute('updated', '1');
                saveBtn.style.opacity = 1;

                ;
            }

            async function saveBtnFunction(e) {
                let json= await  JSON.stringify({
                    email :  inputs[1].value 
                });
                let updated = popup.getAttribute('updated');
                if (updated == false) return
                savingUser = true;
                let url = window.location.origin + '/api/api_s' + select.selectedIndex ? '/' : '/remove-from-' + 'bann-user';
                fetch(url,{
                    method:'DELETE',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body : json
                })
                .then(e=>e.json())
                .then(({success,error})=>{
                    if (error) return alert(error)
                    if (success) {
                        document.querySelector(`[user-id="${inputs[4].value}"]`).setAttribute('user-banned',select.selectedIndex);
                        popup.style.display='none';
                    }
                })
                .catch(e => log(e))
                .finally(e => savingUser=false)
            }
            select.addEventListener('change', selectFunction)
            saveBtn.addEventListener('click', saveBtnFunction)
        }
    })


}
