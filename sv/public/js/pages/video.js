/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
Insha Allab,  By the marcy of Allah,  I will gain success
*/

let seen = 0;
let seenAgo = false;
let seenAll = false;
let loadingElement = document.querySelector('.loading');
let gallary = document.querySelector('.video-grid');


let observer = new IntersectionObserver(async function (Entries) {
    if (Entries[0].isIntersecting) {
        if (seenAll || seenAgo) return;
        seenAgo = true;
        try {
            let response = await fetch(window.location.origin + '/api/api_s/assets/video/page?seen=' + seen);
            if (response.status === 200) {
                let videos = await response.json();
                seen += videos.length;
                for (let i = 0; i < videos.length; i++) {
                    gallary.innerHTML+=(` <div class="video-card">${decodeURIComponent(videos[i].iframe)} <div class="video-info"><h3>${videos[i].title}</h3> <p>${videos[i].description}</p></div> </div>`);
                }
               
                setTimeout(function () { seenAgo = false; }, 600);
                if (videos.length < 6) {
                    seenAll=true;
                    observer.disconnect();
                    loadingElement.remove();
                    return;
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
