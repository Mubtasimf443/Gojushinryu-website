/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/
{
    let popup = document.querySelector('#popup_user_action');

    let userListContainer = document.querySelector('#list-of-user');
    let savingUser = false;
    let userIsSeen = false;
    let Observer = new IntersectionObserver(async function (entry) {
        if (entry[0].target.id === 'list-of-user' && entry[0].isIntersecting) {
            if (!userIsSeen) {
                let response = await fetch(window.location.origin + '/api/api_s/find-user');
                response = await response.json();
                let { error, success, User } = response;

                if (error) {
                    console.log(error);
                    return alert('Failed To load User Data');
                }
                if (success && User) {
                    userListContainer.querySelector('[length]').innerHTML = User.length + userListContainer.querySelector('[length]').innerHTML;
                    let users = userListContainer.querySelector('.users');
                    if (User.length === 0) {
                        users.innerHTML = users.innerHTML + `<div class="user"><b>There is No User</b></div>`;
                        return;
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
                            black-belt="${el.isBlackBelt ? true : false}"
                            class="user">
                            <img src="${el.thumb ||  '/img/avatar.png'}">     
                            <span class="name">
                            ${el.first_name + ' ' + el.last_name} 
                            </span>
                            <div class="col">
                            <b>Joined</b> 
                            <span>${new Date(el.joining_date).toLocaleDateString() ?? '...Date'}</span>
                            </div> <button parant-div-id-user-id="${el.id}" class="user_list_action">  Action </button>
                            </div>`;
                        return;
                    });
                }

            }
        }

    }
    )


    Observer.observe(userListContainer)

    userListContainer.addEventListener('click',
        e => {
            if (e.target.className === 'user_list_action') {
                
                popup.style.display = 'flex';
                let parantUserBox = document.querySelector(`[user-id="${e.target.getAttribute('parant-div-id-user-id')}"]`)
                let inputs = popup.querySelectorAll('input');
                inputs[0].value = parantUserBox.getAttribute('user-name');
                inputs[1].value = parantUserBox.getAttribute('user-email');
                inputs[2].value = parantUserBox.getAttribute('user-phone');
                inputs[3].value = parantUserBox.getAttribute('user-country');
                inputs[4].value = parantUserBox.getAttribute('user-id');
                let closeBtn = popup.querySelector('.popup-close-btn');
                let blackBeltButton = popup.querySelector(`[make_black_belt]`);
                let isBlackBelt= parantUserBox.getAttribute('black-belt');
                if (isBlackBelt === 'false') {
                    blackBeltButton.style.opacity=1;
                    blackBeltButton.setAttribute('user-id', parantUserBox.getAttribute('user-id'));
                    blackBeltButton.addEventListener('click', makeBlackBelt);
                    closeBtn.addEventListener('click',closePopupwithBlackBelt );
                    return;
                } else {
                    blackBeltButton.style.opacity=.65;
                    closeBtn.addEventListener('click', function (e) { popup.style.display = 'none' });
                    return;
                }
            }
        })

    async function makeBlackBelt(event = new Event('click')) {
        event.preventDefault();
        let id = event.target.getAttribute('user-id');
        fetch(window.location.origin + '/api/api_s/user/make-black-belt?' + (new URLSearchParams({ id })).toString(), { method: 'PUT' });
        popup.querySelector(`[make_black_belt]`).style.opacity=.65;
        userListContainer.querySelector(`.user[user-id="${id}"]`).setAttribute('black-belt','true');
        closePopupwithBlackBelt();
    }
    function closePopupwithBlackBelt(e) { 
        popup.style.display = 'none';
        popup.querySelector(`[make_black_belt]`).removeEventListener('click', makeBlackBelt);
        popup.querySelector('.popup-close-btn').removeEventListener('click',closePopupwithBlackBelt );

    }
}
