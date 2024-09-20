/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/

{/*----------- scope start ----------*/
    //dom
let mainImage =document.getElementById('----m-image');
let LinksContainer = document.querySelector('#Links-container');
//function 
   


    /*----------- event delegation and  listener ----------*/
document.addEventListener('click',e =>{
    if (e.target.className === 'gly_img') return mainImage.setAttribute('src' ,e.target.src) ;
    if (e.target.className==='fa-solid fa-heart') return e.target.className = 'fa-regular fa-heart' ;
    if (e.target.className==='fa-regular fa-heart') return e.target.className = 'fa-solid fa-heart' ;
    if (e.target.className=== 'fa-solid fa-link') return LinksContainer.style.display='flex';
    if (e.target.parentNode.className === 'Links-container-close-btn' || e.target.className === 'fa-solid fa-copy' || e.target.className === 'Links-container-close-btn' || e.target=== LinksContainer ) return LinksContainer.style.display='none';

})

}/*-----------scope finished ----------*/
















