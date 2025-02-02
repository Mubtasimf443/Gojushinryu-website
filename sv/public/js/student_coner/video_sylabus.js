/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/

{
    let videos=[];
    let container = document.querySelector(`.video_sylabus`);
    let seen =false;
    let observer =new IntersectionObserver(async function (entry){
        try {
            if (entry[0].isIntersecting ===false || seen) return;
            seen=true;
            let res=await fetch(window.location.origin+'/api/api_s/sylabus/assets/video');
            if (res.status===200){
                videos=await res.json();
                orgTable();
            }
        } catch (error) {
           console.log(error);
        }
    });
    function orgTable() {
        let videoContainer =container.querySelector(`[id="video-container"]`);
        videoContainer.innerHTML=null;
        for (let i = 0; i < videos.length; i++) (videoContainer.innerHTML += videos[i].code);
    }
    observer.observe(container);
}