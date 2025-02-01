/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/

let grid=document.querySelector('.team-grid');


setTimeout(() => LoadWindow(), 100); 

async function LoadWindow() {
    try {
        let response = await fetch(window.location.origin + '/api/api_s/find-members-of-member-page');
        if (response.status===200) {
            let members = (await response.json()) || [];
            (members.length!==0) && (grid.innerHTML=null);
            for (let i = 0; i < members.length; i++) {
                let m = members[i];
                let div = document.createElement('div'); 
                div.className = 'team-card';
                div.innerHTML=
                `
                    <img src="${ m.member_image || '/img/avatar.png' }" alt="Sam Monic">
                    <div class="team-info">
                        <h2>${m.fname + m.lname}</h2>
                        <p class="role">Member of ${m.membership_company_short}</p>
                        <p class="description">${m.fname + m.lname} from ${m.country} has Joined ${m.membership_company} Members</p>
                        <div class="social-icons">
                            <a href="${m.social_media_details?.facebook?.account ? decodeURIComponent(m.social_media_details?.facebook?.account): '#'}"><i class="fab fa-facebook"></i></a>
                            <a href="${m.social_media_details?.instagram?.account ?decodeURIComponent(m.social_media_details?.instagram?.account ): '#'}"><i class="fab fa-instagram"></i></a>
                            <a href="${m.social_media_details?.linkedin?.account ? decodeURIComponent(m.social_media_details?.linkedin?.account): '#'}"><i class="fab fa-linkedin"></i></a>
                            ${(m.social_media_details?.twitter?.account &&  ('<a href="' +decodeURIComponent(m.social_media_details?.twitter?.account)+ '"><i class="fab fa-twitter"></i></a>' )) || ''}
                        </div>
                    </div>
                `;
                grid.appendChild(div);
            }
        }
    } catch (error) {
        console.log(error);
    }
}