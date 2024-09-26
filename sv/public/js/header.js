/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/

{
let header = document.querySelector('header');
 let headerIcon = document.querySelector('.hd-icon');
// let headerAnchor = header.querySelectorAll('a');
// let headerBtn = header.querySelector('button');
 //let hero= document.getElementById('Hero_section');
//let heroH1 = hero.querySelector('h1');
// let mouseoutEventTimerTime =2000;
// let mouseoutInTimerTime=500;
let headerNavIcon = header.querySelector('i');
let topBar=document.getElementById('top-bar');
let abs_dropdown = document.querySelector('#about_us_dropdown');
let aboutUsHeaderNav=document.querySelector('#about-us-header-nav-div-link-anchor-div');



headerIcon.setAttribute('src' ,'/img/header_icon1.png') ;

function loadH3(params) { 
  
      let h3=  document.createElement('h3');
      h3.innerText = 'Book Your First Class Free / School of  Traditional Martial Arts' ;
      topBar.appendChild(h3);
      h3.style.right='-50vw';
      setTimeout(e=> {

        // h3.style.transition='all 21s ease';
        // h3.style.right='130vw';
      },50);
      setTimeout(e=> h3.remove(),21000);
      setTimeout(loadH3, 10000);
}
window.addEventListener('load',e => {
    loadH3();
});

// var mouseOutTimeOut;
// var mouseTimeOutForAboutUsDropDown;
// aboutUsHeaderNav.querySelector('a').addEventListener('mouseup',e => {
//   // clearTimeout(mouseTimeOutForAboutUsDropDown);
//   mouseTimeOutForAboutUsDropDown=setTimeout(() => {
//     clearTimeout(mouseOutTimeOut)
//     abs_dropdown.style.top='30px';
//    setTimeout(() => {
//      abs_dropdown.style.opacity=1;
//    }, 200);
//    abs_dropdown.style.zIndex=10;
//   }, 120);
// });

// aboutUsHeaderNav.addEventListener('mousedown',e => {
//  clearTimeout(mouseOutTimeOut)

//   mouseOutTimeOut= setTimeout(() => {
//     abs_dropdown.style.top='-100px';
//     abs_dropdown.style.opacity=0;
//     abs_dropdown.style.zIndex=-1000;
//   }, 4000);

// });


// abs_dropdown.addEventListener('mouseenter', e=>{
//    clearTimeout(mouseOutTimeOut) ;
//   //  setTimeout(() => {
//     abs_dropdown.style.transition="none";
//     abs_dropdown.style.top='30px';
//     abs_dropdown.style.opacity=1;
//     // alert('m ent absd')
//   // }, 100);
//   abs_dropdown.style.zIndex=1000;

// }) ;

// abs_dropdown.addEventListener('mouseout',e =>{
//   mouseOutTimeOut= setTimeout(() => {
//     abs_dropdown.style.top='-100px';
//     abs_dropdown.style.opacity=0.4;
//     abs_dropdown.style.zIndex=-1000;
//   }, 3000);
// })



// let VisibilityObserver = new IntersectionObserver(entries => {
//     if (entries[0].isIntersecting) {
//         header.style.backgroundColor = 'transparent';
//         headerAnchor.forEach(anchor =>{ 
//             anchor.style.fontWeight=500;
//             anchor.style.color ='#fff';
//         });
//         headerIcon.setAttribute('src','/img/header_icon1.png');
//         headerNavIcon.style.color= 'white';
//         return
//     }
//     if (!entries[0].isIntersecting) {
//         header.style.backgroundColor =  'transparent';;
//         headerAnchor.forEach(anchor => {
//             anchor.style.fontWeight=600;
//             anchor.style.color ='#000';
//         });
//         headerIcon.setAttribute('src' ,'/img/header_icon1.png');
//         headerNavIcon.style.color= 'black';
        
//         return
//     }
// })
}
// VisibilityObserver.observe(heroH1)