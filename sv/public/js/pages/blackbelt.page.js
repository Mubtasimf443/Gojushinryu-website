/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/

let grid=document.querySelector('.team-grid');


 LoadWindow();


async function LoadWindow() {
    try {
        let response = await fetch(window.location.origin + '/api/api_s/find-black-belt-of-black-belt-page');
        if (response.status===200) {
            let members=(await response.json())?.blackBelts || [];
            (members.length!==0) && (grid.innerHTML=null);
            for (let i = 0; i < members.length; i++) {
                let m = members[i];
                let div = document.createElement('div'); 
                div.className = 'team-card';
                div.innerHTML=
                `
                    <img src="${ m.thumb || '/img/avatar.png' }" alt="Sam Monic">
                    <div class="team-info">
                        <h2>${m.name}</h2>
                        <p class="role">${m.country}</p>
                        <p class="description">${ m.bio?.length <= 100 ? m.bio : (m.bio.substring(0, 96) + '...') }</p>
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