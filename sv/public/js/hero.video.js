/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/

let video = document.querySelector('video') ;
let heroSection = document.getElementById('Hero_section')

window.addEventListener('load',  e => {
    if ( window.innerWidth > 631) { 
        console.log('631');
        video.setAttribute( 'src','https://gojushinryu.com/video/7463.mp4');
        heroSection.style.height = video.style.height;
         return
        }
     video.setAttribute('src','https://gojushinryu.com/video/7463.mp4')
     heroSection.style.height = video.style.height;
     return
})
var tm ;
window.addEventListener('resize',  e => { 
    clearTimeout(tm)
    tm = setTimeout(() => {     
        if (  window.innerWidth > 631) { 
             video.setAttribute( 'src','/video/7463.mp4');
             return
            }    
         video.setAttribute('src','/video/mobile.mp4' );
        })   
})
