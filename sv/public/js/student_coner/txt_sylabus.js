/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/

{
    let container =document.querySelector(`#text-sylabus`);
    let seen =false;
    let notes =[];
    let currentNotesPage=1;
    let notesPerPage=25;
    async function LoadTextSylabus(){
        try {
            let response=await fetch(window.location.origin+'/api/api_s/sylabus/assets/text');
            if (response.status===200) {
                notes = (await response.json()) || [];
            }
            addNotes(getCurrentPage());
            container.querySelector('select').innerHTML = null;
            let pages = Math.round(notes.length / notesPerPage);
            for (let i = 0; i <= pages; i += 1) {
                let option = document.createElement('option');
                option.value = i+1;
                option.innerText = `Page ${i+1}`;
                container.querySelector('select').appendChild(option);
            }
            container.querySelector('select').addEventListener('change', function (event) {
                event.preventDefault();
                currentNotesPage = container.querySelector('select').selectedOptions[0].value;
                currentNotesPage = Number(currentNotesPage);
                addNotes(getCurrentPage());
            })
        } catch (error) {
            console.log(error);
        }
    }
    function getCurrentPage() {
        let starting = (currentNotesPage - 1) * notesPerPage ;
        let ending = currentNotesPage * notesPerPage;
        let note = [];
        for (let i = starting - 1; i < ending -1; i++) {
            if (!!notes[i]) note.push(notes[i]);
        }
        return note;
    }
    function addNotes(notes=[]) {
        container.querySelector('.notes-grid').innerHTML=``;
            notes.forEach(function (note,index) {
                let noteCard=document.createElement('div');
                let title=document.createElement('h3');
                let content= document.createElement('p');

                noteCard.className='note-card';
                title.className='note-title';
                content.className='note-content';
               
                title.textContent=note.title.length <= 50 ?note.title:note.title.substring(0,50); 
                content.textContent=note.content.length <= 90 ?note.content: note.content.substring(0,80);
                noteCard.setAttribute('data-id', index);
                noteCard.append(title);
                noteCard.append(content);
                
                function openPopup(event=new Event('click')){
                    event.preventDefault();
                    const modalOverlay = container.querySelector('.modal-overlay');
                    modalOverlay.querySelector('input').value = note.title;
                    modalOverlay.querySelector('textarea').value = note.content;
                    modalOverlay.style.display='flex';
                    modalOverlay.querySelector('.char-count').innerText = note.content.length;
                    modalOverlay.querySelector('.btn-close').onclick=function(event) {
                        event.preventDefault();
                        modalOverlay.style.display = 'none';
                    }
                    return;
                }
                noteCard.onclick=openPopup;
                container.querySelector('.notes-grid').appendChild(noteCard);
                
            });
    }
    let observer = new IntersectionObserver(async function (entry) {
        try {
            if (entry[0].isIntersecting === false || seen) return;
            seen=true;         
            LoadTextSylabus()
        } catch (error) {
            console.log(error);
        }
    });
    observer.observe(container);

    
   
   
}