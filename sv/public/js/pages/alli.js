/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/


window.addEventListener('DOMContentLoaded', async function () {
    try {
        let response=await fetch(window.location.origin + '/api/api_s/allience-grand-master');
        if (response.status===200) {
            let Masters =await response.json();
            this.document.querySelector('.container_1').innerHTML='';
            for (let i = 0; i < Masters.length; i++) {
                const master = Masters[i];
                let div=this.document.createElement('div');
                div.classList.add('child_container');
                div.innerHTML=(`
                    <div class="ali_box">
                        <img src="${master.image}" alt="${master.name}">
                        <img src="${master.organizationLogo}" alt="${master.title}">
                        <a href="/grand-master-info/${master.createdAt}">${master.name}</a>
                        <span>
                            <a href="${master.OrganizationLink}"> ${master.title} </a>
                        </span>
                    </div>
                `);
                this.document.querySelector('.container_1').appendChild(div);
            }
            this.document.querySelector('.container_2').removeAttribute('style');
        } else {
            
        }
        
    } catch (error) {
        console.error(error);
    }
});