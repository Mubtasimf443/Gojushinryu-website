/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/
{
    let container = document.querySelector("#pdf_sylabus");
    let seen = false;
    let pdfs = [];
    let table = container.querySelector('table');
    let tbody = table.querySelector('tbody');

    let observer = new IntersectionObserver(async function (entry) {
        try {
            let response = await fetch(window.location.origin + '/api/api_s/sylabus/assets/pdf');
            if (response.status === 200) {
                pdfs = (await response.json()) || [];
                orgTable()
            }
        } catch (error) {
            console.log(error);
        }

    });
    observer.observe(container);

    async function orgTable() {
        tbody.innerHTML = null;
        for (let i = 0; i < pdfs.length; i++) {
            const p = pdfs[i];
            let tr = document.createElement('tr');
            tr.setAttribute('asid', p.id);
            {
                let td = document.createElement('td');
                td.innerHTML = p.title;
                tr.appendChild(td);
            }
            {
                let td = document.createElement('td');
                let btn1 = document.createElement('button'),btn2 = document.createElement('button');
                btn1.innerHTML='View Pdf';
                btn1.addEventListener('click', viewButton);
                btn1.setAttribute('asid', p.id);
                btn1.setAttribute('href', encodeURI(p.content));
                btn2.innerHTML = `Delete`;
                btn2.setAttribute('asid', p.id);
                btn2.onclick=deleteButton;
                td.append(btn1);
                td.append(btn2);
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
    }


    async function viewButton(event = new Event('click')) {
        event.preventDefault();
        let href=event.target.getAttribute('href');
        href=decodeURI(href);
        window.open(href);
    }

    async function deleteButton(event = new Event('click')) {
        try {
            event.preventDefault();
            let id = event.target.getAttribute('asid');
            await fetch(window.location.origin + '/api/api_s/sylabus/assets/pdf?id=' + id, { method: 'delete' });
            pdfs=pdfs.filter(function (element) {
                if (element.id != id) return element;
            });
            orgTable();
        } catch (error) {
            console.log(error);
        }
    }
    // Forms 
    let form = container.querySelector('form');
    let clrButton = form.querySelector('.clr-btn');
    let addButton = form.querySelector('.add-btn');
    let titleInput = form.querySelector('input[type="text"]');
    

    addButton.addEventListener('click', addVideo)
    clrButton.addEventListener('click', clearFormInput);
    let isAddingVideo = false;
    async function addVideo(e = new Event('click')) {
        try {
            e.preventDefault();
            if (isAddingVideo) return;
            isAddingVideo = true;
            let title = titleInput.value;
            if (!title.trim()) {
                titleInput.style.outline = '2px solid red';
                titleInput.addEventListener('input', function rm() {
                    titleInput.style.outline = 'none';
                    titleInput.removeEventListener('input', rm);
                });
                throw 'Error , input is null';
            }
            let fInput=form.querySelector(`input[type="file"]`);
            if (fInput.files.length === 0) {
                fInput.style.outline = '2px solid red';
                fInput.addEventListener('change', function rm() {
                    fInput.style.outline = 'none';
                    fInput.removeEventListener('input', rm);
                });
                throw 'Error , input is null';
            } 
            if (fInput.files[0].type !== 'application/pdf') {
                return alert('File Must Be a Pdf File')
            } 
            let f = new FormData();
            f.append('title', title);
            f.append('pdf', fInput.files[0])
            
            let tempID=Math.random()*10000000;
            pdfs.push({
                title :title,
                tempID,
                content :'Undefined',
                id: Math.round(Math.random() * 100)
            });
            clearFormInput();
            orgTable();
            let res= await fetch(window.location.origin + '/api/api_s/sylabus/assets/pdf', {
                method: 'post',
                body: f
            });
            if (res.status===200){
                for (let i = 0; i < pdfs.length; i++) {
                    if (pdfs[i].tempID===tempID) {
                        pdfs[i]=await res.json();
                        orgTable();
                    }
                }
            }
            
        } catch (error) {
            console.log(error);
        } finally {
            isAddingVideo = false;
        }
    }
    function clearFormInput(e = new Event('click')) {
        e.preventDefault();
        form.querySelector('input').value=null;
        let fInput=document.createElement('input');
        fInput.type='file';
        fInput.accept=`application/pdf`;
        form.querySelector('input[type="file"]').replaceWith(fInput);
    }


}