/* 
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
Insha Allah,  By Allahs Marcy,  I willearn success
*/


let seen = 0;
let seenAgo = false;
let seenAll = false;
let loadingElement = document.querySelector('.loading');
let gallary = document.querySelector('.gallery-grid');

let observer = new IntersectionObserver(async function (Entries) {
    if (Entries[0].isIntersecting) {
        if (seenAll || seenAgo) return;
        seenAgo = true;
        try {
            let response = await fetch(window.location.origin + '/api/api_s/assets/image/page?seen=' + seen);
            if (response.status === 200) {
                let images = await response.json();
                seen += images.length;
                for (let i = 0; i < images.length; i++) {
                    gallary.innerHTML+=(` <div class="gallery-item"> <img src="${images[i].url}" alt="Image 1"> </div>`);
                }
              
                setTimeout(function () { seenAgo = false; }, 600);
                  
                if (images.length<6){
                    seenAll=true;
                    observer.disconnect();
                    loadingElement.remove();
                }
            }
            if (response.status === 204) {
                seenAll=true;
                observer.disconnect();
                loadingElement.remove();
            }
        } catch (error) {
            seenAgo = false;
        }

    }
});
observer.observe(loadingElement);