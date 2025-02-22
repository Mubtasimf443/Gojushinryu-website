/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/

{
    let videos=[];
    let container = document.querySelector(`.video_sylabus`);
    let seen =false;
    let page = 1;
    let observer =new IntersectionObserver(async function (entry){
        try {
            if (entry[0].isIntersecting ===false || seen) return;
            seen=true;
            let res=await fetch(window.location.origin+'/api/api_s/sylabus/assets/video');
            if (res.status===200){
                videos=await res.json();
                // orgTable();
                displayVideos()
            }
        } catch (error) {
           console.log(error);
        }
    });
    function orgTable() {
        let videoContainer =container.querySelector(`[id="video-container"]`);
        videoContainer.innerHTML=null;
        for (let i = 0; i < videos.length; i++) (videoContainer.innerHTML += videos[i].code);
        videoContainer.querySelectorAll('iframe').forEach(function (element) {
            if (window.screen.availWidth < 968 ) element.setAttribute('height','350');
            if (window.screen.availWidth < 768 ) element.setAttribute('height','300');
            if (window.screen.availWidth < 500 ) element.setAttribute('height','250');
            if (window.screen.availWidth > 768 ) element.setAttribute('height','400');
            element.removeAttribute('width');
        });
    }
    observer.observe(container);
    function displayVideos(){
        let displayingVideos=[];
        for (let i = (page - 1) * 10; i < page * 10; i++) {
            const element = videos[i];
            if (!!element) displayingVideos.push(element);
        }
        let videoContainer =container.querySelector(`[id="video-container"]`);
        videoContainer.innerHTML=null;
        for (let i = 0; i < displayingVideos.length; i++) {
            videoContainer.innerHTML += displayingVideos[i]?.code ||  '';
        }
        for (let i = 0; i < videoContainer.querySelectorAll('iframe').length; i++) {
            const element =videoContainer.querySelectorAll('iframe')[i];
            if (window.screen.availWidth < 968 ) element.setAttribute('height','350');
            if (window.screen.availWidth < 768 ) element.setAttribute('height','300');
            if (window.screen.availWidth < 500 ) element.setAttribute('height','250');
            if (window.screen.availWidth > 768 ) element.setAttribute('height','400');
            element.removeAttribute('width');
        }

        if (page === 1 ) {
            container.querySelector('select').innerHTML = null;
            let loopFor = videos.length / 10 + 1;
            for (let i = 1; i < loopFor; i += 1) {
                container.querySelector('select').innerHTML += `<Option value="${i}" >Page ${i}</Option>`;
            }
        }
    }

    container.querySelector('select').addEventListener('change', function (event) {
        page = container.querySelector('select').selectedOptions[0].value;
        displayVideos()
    })
}