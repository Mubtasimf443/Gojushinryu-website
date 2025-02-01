/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/
{
    let popup = document.querySelector('#popup_user_action');
    let userListContainer = document.querySelector('#list-of-user');
    let table=userListContainer.querySelector('table');
    let users=[];
    let seen=false;
    let Observer = new IntersectionObserver(async function (entry) {
        try {
            if (entry[0].isIntersecting === false || seen) return;
            seen = true;
            let response = await fetch(window.location.origin + '/api/api_s/find-user');
            if (response.status === 200) {
                users = await response.json();
                orgTable()
            }
        } catch (error) {
            console.log(error);
        }
    });
    Observer.observe(userListContainer)
    function orgTable() {
        table.querySelector('tbody').innerHTML=null;
        for (let i = 0; i < users.length; i++) {
            const s = users[i];
            let tr=(`  
            <tr>
               ${/* <td><img src="${s.thumb || '/img/avatar.png'}" alt=""></td>*/''}
                <td>${s.name}</td>
                <td>${s.email}</td>
                <td>${s.phone}</td>
                ${/*<td>${s.country}</td>*/''}
                <td>${s.isBlackBelt ? 'Yes' :('<button class="user-bb-btn" uid="'+s.id +'" > Make </button>')}</td>
                <td>${s.admin_approved ? 'Approved' : ('<button class="user-approve-btn" uid="'+s.id +'" > Approve </button>')}</td>
                <td ><button class="delete-u" uid="${s.id}">Del</button></td>
              </tr>
            `);
            table.querySelector('tbody').innerHTML+=tr;
        }
        table.querySelectorAll('.user-bb-btn').forEach(function (element) {
            element.addEventListener('click',makeBlackBelt )
        });

        table.querySelectorAll('.user-approve-btn').forEach(function (element) {
            element.addEventListener('click',makeStudentApprove );
        });
        table.querySelectorAll('.delete-u').forEach(function (element) {
            element.addEventListener('click',deleteSt );
        })
    }

    
    async function makeBlackBelt(event = new Event('click')) {
        event.preventDefault();
        let id = event.target.getAttribute('uid');
        fetch(window.location.origin + '/api/api_s/user/make-black-belt?' + (new URLSearchParams({ id })).toString(), { method: 'PUT' });
        for (let i = 0; i < users.length; i++) {
            if (users[i].id ==id) users[i].isBlackBelt=true;
        }
        orgTable();
    }
    
    
    async function makeStudentApprove(event = new Event('click')) {
        event.preventDefault();
        let id = event.target.getAttribute('uid');
        fetch(window.location.origin + '/api/api_s/user/approve-user?' + (new URLSearchParams({ id })).toString(), { method: 'PUT' });
        for (let i = 0; i < users.length; i++) {
            if (users[i].id ==id) users[i].admin_approved=true;
        }
        orgTable();
    }
    
    async function deleteSt(event = new Event('click')) {
        event.preventDefault();
        let id = event.target.getAttribute('uid');
        fetch(window.location.origin + '/api/api_s/delete-user-account?' + (new URLSearchParams({ id })).toString(), { method: 'delete' });
        users=users.filter(function(user){
            if (user.id != id) return user;
        })
        orgTable();
    }
}
