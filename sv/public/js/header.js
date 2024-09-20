/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/

let header = document.querySelector('header');
 let headerIcon = document.querySelector('.hd-icon');
// let headerAnchor = header.querySelectorAll('a');
// let headerBtn = header.querySelector('button');
 //let hero= document.getElementById('Hero_section');
//let heroH1 = hero.querySelector('h1');
let headerNavIcon = header.querySelector('i');
let topBar=document.getElementById('top-bar');
let abs_dropdown = document.querySelector('#about_us_dropdown');
let aboutUsHeaderNav=document.getElementById('about-us-header-nav-div-link-anchor-div');



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

var mouseOutTimeOut;

aboutUsHeaderNav.addEventListener('mouseenter',e => {
  clearTimeout(mouseOutTimeOut)
  abs_dropdown.style.top='130px';
  setTimeout(() => {
    abs_dropdown.style.opacity=1;
  }, 100);
});

aboutUsHeaderNav.addEventListener('mouseout',e => {
  mouseOutTimeOut= setTimeout(() => {
    abs_dropdown.style.top='15px';
    abs_dropdown.style.opacity=0;
  }, 500);
});


abs_dropdown.addEventListener('mouseenter', e=>{
  clearTimeout(mouseOutTimeOut) ;
  abs_dropdown.style.top='130px';
  setTimeout(() => {
    abs_dropdown.style.opacity=1;
  }, 100);
  abs_dropdown.style.opacity=1;  
}) ;

abs_dropdown.addEventListener('mouseout',e =>{
  mouseOutTimeOut= setTimeout(() => {
    abs_dropdown.style.top='15px';
    abs_dropdown.style.opacity=0;
  }, 500);
})



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

// VisibilityObserver.observe(heroH1)