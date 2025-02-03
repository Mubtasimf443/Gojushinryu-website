/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allah,  By the marcy of Allah,  I will gain success
*/

{
    let container=document.querySelector(`#Image_sylabus`);
    let images=[];
    let seen = false;
    let observer = new IntersectionObserver(async function (entry) {
        try {
            let response = await fetch(window.location.origin + '/api/api_s/sylabus/assets/image');
            if (response.status === 200) {
                images = (await response.json()) || [];
                orgTable()
            }
        } catch (error) {
            console.log(error);
        }

    });
    observer.observe(container);

    async function orgTable(){
        try {
            const imageContainer = container.querySelector('#image-container');
            imageContainer.innerHTML = '';

            images.forEach(image => {
                const imageCard = document.createElement('div');
                imageCard.classList.add('image-card');

                // Title
                const title = document.createElement('h3');
                title.textContent = image.title;
                title.classList.add('image-title');

                // Image wrapper
                const imgWrapper = document.createElement('div');
                imgWrapper.classList.add('image-wrapper');

                // Image
                const img = document.createElement('img');
                img.src = image.content;
                img.alt = image.title;
                img.classList.add('syllabus-image');

                // Download button
                const deleteBtn = document.createElement('button');
                // deleteBtn.href = image.content;
                deleteBtn.textContent = 'Delete';
                deleteBtn.classList.add('delete-btn');
                deleteBtn.setAttribute('asid', image.id)
                deleteBtn.onclick=deleteImageSylabus;
                // Append elements
                imgWrapper.appendChild(img);
                imgWrapper.appendChild(deleteBtn);
                imageCard.appendChild(title);
                imageCard.appendChild(imgWrapper);
                imageContainer.appendChild(imageCard);
            });
        } catch (error) {
            console.error('Error loading images:', error);
        }
    }



    // Forms 

    let form =container.querySelector('form');
    let clrButton = form.querySelector('.clr-btn');
    let addButton = form.querySelector('.add-btn');
    let titleInput = form.querySelector('input[type="text"]');


    addButton.addEventListener('click', addVideo)
    clrButton.addEventListener('click', clearFormInput);
    let isAddingImage = false;
    async function addVideo(e = new Event('click')) {
        try {
            e.preventDefault();
            if (isAddingImage) return;
            isAddingImage = true;
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
            if (!fInput.files[0].type.includes('image/')) {
                return alert('File Must Be a Pdf File')
            } 
            let f = new FormData();
            f.append('title', title);
            f.append('img', fInput.files[0])
            let tempID=Math.random()*10000000;
            images.push({
                title :title,
                tempID,
                content :'/img/spinner.svg',
                id: Math.round(Math.random() * 100)
            });
            clearFormInput();
            orgTable();
            let res= await fetch(window.location.origin + '/api/api_s/sylabus/assets/image', {
                method: 'post',
                body: f
            });
            if (res.status===201){
                for (let i = 0; i < images.length; i++) {
                    if (images[i].tempID===tempID) {
                        images[i]=await res.json();
                        orgTable();
                    }
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            isAddingImage = false;
        }
    }
    function clearFormInput(e = new Event('click')) {
        e.preventDefault();
        form.querySelector('input').value=null;
        let fInput=document.createElement('input');
        fInput.type='file';
        fInput.accept=`image/*`;
        form.querySelector('input[type="file"]').replaceWith(fInput);
    }

    async function deleteImageSylabus(e = new Event('click')){
        e.preventDefault();
        let id =e.target.getAttribute('asid');
        e.target.style.opacity=.65;
        let status=(await fetch(window.location.origin + '/api/api_s/sylabus/assets/image?id='+id , {method :'delete'})).status;
        if (status===204) {
            images =images.filter(function (element) {
                if (element.id != id) {
                    return element;
                }
            });
            orgTable();
        } else {
            e.target.style.opacity=1;
        }
    }

}