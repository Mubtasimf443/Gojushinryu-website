/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allah,  By the marcy of Allah,  I will gain success
*/


let aboutUsSlider = document.getElementById('abs-slider');
var slideNum = 1;

window.addEventListener('load',e => {
   makeBlur()
});




function makeBlur() {
    setTimeout(() => {
    aboutUsSlider.style.transition='all .5s ease';
    aboutUsSlider.style.filter='blur(2.5px)';
    setTimeout(e=>{
        slideNum= slideNum+1;
        aboutUsSlider.setAttribute('src','/img/abs-slide/slide'+slideNum +'.jpg');
        if (slideNum===35) slideNum=0;
        aboutUsSlider.style.filter='blur(0px)';
       return makeBlur()
    },250)
    },1600);
}







