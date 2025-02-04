/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
Insha Allah,  By your Marcy Ya Allah
*/
{
    let container = document.querySelector('#text_sylabus');
    let notes = [];
    let seen = false;
    let api = window.location.origin + '/api/api_s/sylabus/assets/text';
    let updatingNotes=false;
    let deletingNotes=false;
    let observer = new IntersectionObserver(async function (entries) {
        if (seen || !entries[0].isIntersecting) return;
        let response = await fetch(api);
        if (response.status === 200) notes = (await response.json()) || [];
        LoadNotes();
    });
    observer.observe(container);

    function LoadNotes() {
        const notesGrid = container.querySelector('.notes-grid');
        const modalOverlay = container.querySelector('.modal-overlay');
        const closeBtn = container.querySelector('.btn-close');
        const saveBtn = container.querySelector('.btn-primary');
        const deleteBtn = container.querySelector('.btn-delete');
        const titleInput = container.querySelector('.modal-title');
        const descInput = container.querySelector('.modal-description');
        const charCount = container.querySelector('.char-count');
        let currentNote = null;
        notesGrid.innerHTML = null
        for (let i = 0; i < notes.length; i++) {
            const note = notes[i];
            let card = document.createElement('div');
            let title = document.createElement('div');
            let description = document.createElement('div');
            card.classList.add('note-card');
            title.classList.add('note-title');
            description.classList.add('note-description');
            card.setAttribute('data-id', i);
            title.textContent = note.title?.length < 70 ? note.title : note.title?.substring(0, 70) + '...';
            description.textContent = note.content?.length < 150 ? note.content : note.content?.substring(0, 150) + '...';
            card.append(title);
            card.append(description);
            card.onclick = function (event) {
                event.preventDefault();
                let title = note.title;
                let content = note.content;
                let id = note.id;
                titleInput.value = title;
                descInput.value = content;
                modalOverlay.style.display = 'flex';
                charCount.textContent = note.content.length;
                saveBtn.setAttribute('data-id', id);
                deleteBtn.setAttribute('data-id', id);
                return;
            }

            notesGrid.appendChild(card);
        }

        // Open modal

        // Close modal
        closeBtn.addEventListener('click', () => {
            modalOverlay.style.display = 'none';
        });

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.style.display = 'none';
            }
        });

        // Save note
        saveBtn.addEventListener('click', async function () {
            try {
                if (updatingNotes)return;
                updatingNotes=true;
                saveBtn.style.opacity=.65;
                if (!titleInput.value.trim()) return;
                if (!descInput.value.trim()) return;
                let title, content;
                title = titleInput.value.trim();
                content = descInput.value.trim();
                if (title.length < 1 || title.length > 90) return alert('notes title can be less than 1 charecter and bigger than 90 charecters');
                if (content.length < 51 || content.length >= 20000) return alert('notes Note can be less than 50 charecter and bigger than 20000 charecters');
                let id = saveBtn.getAttribute('data-id');
                let params = new URLSearchParams({ id, title, content }).toString();
                let isChanged = (await fetch(api + '?' + params, { method: 'put' })).status === 202;
                if (isChanged) {
                    notes = notes.map(function (el) {
                        if (el.id == id) {
                            let element ={
                                ...el,
                                title,
                                content,
                            };
                            return element;
                        }
                        else return el;
                    });
                    LoadNotes();
                    modalOverlay.style.display = 'none';
                    return;
                } else {
                    alert('Failed Update The Note');
                    modalOverlay.style.display = 'none';
                    return;
                }
            } catch (error) {
                console.log(error);
            } finally {
                updatingNotes=false;
                saveBtn.style.opacity=1;
            }

        });

        // Delete note
        deleteBtn.addEventListener('click', async function () {
            try {
                if (deletingNotes) return;
                deletingNotes=true;
                deleteBtn.style.opacity=.65;
                if (confirm('Are you sure you want to delete this note?')) {
                    let id = deleteBtn.getAttribute('data-id');
                    let isDeleted = (await fetch(api + '?id=' + id, { method: 'delete' })).status === 204;
                    if (isDeleted) {
                        notes=notes.filter(function (el) {
                           if (el.id !=id) return el; 
                        });
                        LoadNotes();
                        return;
                    } else {
                        alert('Failed to delete notes');
                        modalOverlay.style.display = 'none';
                        return;
                    }
                }
            } catch (error) {
                console.log(error);
            } finally{
                deletingNotes=false;
                deleteBtn.style.opacity=1;
            }
           
        });
        let inpTimeOut;
        // Character count
        descInput.addEventListener('input', function () {
            clearTimeout(inpTimeOut);
            setTimeout(() => {
                charCount.textContent = descInput.value.length;
            }, 500);
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modalOverlay.style.display = 'none';
            }
        });
    }


    let form = container.querySelector('form');
    form.querySelector(`.add-btn`).onclick = addNotes;
    form.querySelector(`.clr-btn`).onclick = clrNotes;
    async function addNotes(event = new Event('click')) {
        try {
            event.preventDefault();
            let title = form.querySelector('input').value.trim();
            let note = form.querySelector('textarea').value.trim();
            if (!title) {
                form.querySelector('input').style.outline = '2px solid red';
                setTimeout(() => {
                    form.querySelector('input').style.outline = 'none';
                }, 3000);
                throw 'Title is missing';
            }
            if (!note) {
                form.querySelector('textarea').style.outline = '2px solid red';
                setTimeout(() => {
                    form.querySelector('textarea').style.outline = 'none';
                }, 3000);
                throw 'note is missing';
            }
            if (title.length < 1 || title.length > 90) return alert('notes title can be less than 1 charecter and bigger than 90 charecters');
            if (note.length < 50 || note.length > 20000) return alert('notes Note can be less than 50 charecter and bigger than 20000 charecters');
            let params = new URLSearchParams({ title: title, content: note }).toString();
            clrNotes();
            let response = await fetch(`${api}?${params}`, { method: 'post' });
            if (response.status === 201) {
                let note = await response.json();
                notes.push(note);
                LoadNotes();
            }

        } catch (error) {
            console.log(error);
        }
    }

    function clrNotes(event = new Event('click')) {
        event.preventDefault()
        form.querySelector('input').value = null;
        form.querySelector('textarea').value = null;
        return;
    }
}