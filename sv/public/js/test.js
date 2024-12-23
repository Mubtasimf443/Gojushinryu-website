/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allah,  By the marcy of Allah,  I will gain success
*/



let btn=document.querySelector('button');


// btn.onclick;
btn.addEventListener('click',testVideoUpload)

async function testVideoUpload() {
    fetch( window.location.origin+'/api/media-api/linkedin/upload/video', {
        method : 'POST',
        body : JSON.stringify({
            title : 'test images upload',
            video :'birds.mp4'
        }),
        headers : {
            'Content-Type' : 'application/json'
        }
    })
    .then(res=>{
        alert(`status is ${res.status}`);
        res.json();
    })
    .then(data=>console.log(data))
    .catch(err=>console.log(err));
}

