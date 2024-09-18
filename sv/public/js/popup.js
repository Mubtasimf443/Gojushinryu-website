/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  */ 
/*Insha Allab,  By the marcy of Allah,  I will gain success
*/ 

const popup = document.getElementById('popup');
const popupIcon = popup.querySelector('img');
const popupTnxBtn = popup.querySelector('button');

window.addEventListener('load', () => {
  setTimeout(e => {
    popup.style.display = 'flex';popup.showModal();
  },3000 )
});



popup.addEventListener('style',e => console.log(e.target.style.background)
  )  


popupTnxBtn.addEventListener('click', e => {
  popup.close();
  popup.remove()
}
)


