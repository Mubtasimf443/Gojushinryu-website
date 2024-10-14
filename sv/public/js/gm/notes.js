/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/


var Notes=(() => {
   let n= localStorage.getItem('notes');
   if (!n) {
    n=[];
    localStorage.setItem('notes',JSON.stringify(n))
    return n
   } 
   if (n) {
    n = JSON.parse(n);
    return n
   }
})()


{//notes section
    let containar=document.querySelector('.notes-container');
    let seen=false;
    let observer=new IntersectionObserver(ent => {
        if (ent[0].isIntersecting && !seen) {
            seen =true;
            for (let i = 0; i < Notes.length; i++) {
                const {title,description,id} = Notes[i];
                let div=document.createElement('div');
                div.className='notes';
                div.setAttribute('n-id',id);
                div.innerHTML =`          
                <div class="notes">
                <div class="notes-div-1">
                <h2>${title}</h2>
                <div class="notes-icon"> 
                <button n-id="${id}">
                <i class="fa-solid fa-trash"></i>
                </button>
                </div>
                </div>
                <p>
                ${description}
                </p>
                </div>
                `;
                containar.appendChild(div);
                function deleteNotes(){
                    containar.querySelectorAll('.notes').forEach(el => {
                        if (el.getAttribute('n-id')==id) {
                            el.remove();
                            Notes= Notes.filter(el => {
                                if (el.id !== id) return el
                            });
                            localStorage.setItem('notes',Notes)
                        }
                    })
                }
                div.querySelector('button').addEventListener('click',deleteNotes)


            }
        }
    })
    observer.observe(containar)



    function removeAndResetNotes() {}
}



{//button
    let createnoteBtn=document.querySelector(`[id="upload-note-button"]`);
    createnoteBtn.addEventListener('click', e => document.getElementById('writeNotesPopup').style.display='flex' )
}


{//popup
   let popup_container=  document.querySelector(`[id="writeNotesPopup"]`);
   let create =popup_container.querySelector(`[create]`);
   let close =popup_container.querySelector(`[close]`);


   create.addEventListener('click', e => {
    let title =popup_container.querySelector('[id="notes-title-inp"]').value ;
    let description =popup_container.querySelector('[id="notes-description-inp"]').value;
    if (!title) return popup_container.querySelector('[id="notes-title-inp"]').style.outline ='2px solid red'
    if (!description) return popup_container.querySelector('[id="notes-description-inp"]').style.outline ='2px solid red'
    Notes.push({
        title,
        description,
        id:Date.now()
    })
    popup_container.style.display ='none';
    popup_container.querySelector('[id="notes-title-inp"]').value=null;
    popup_container.querySelector('[id="notes-description-inp"]').value=null;
    localStorage.setItem('notes',JSON.stringify(Notes))
   })

   close.addEventListener('click', e => popup_container.style.display = 'none' )
}