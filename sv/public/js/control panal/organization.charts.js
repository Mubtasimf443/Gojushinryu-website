/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/

{
    let containar = document.querySelector('#assets-organizaition-charts-gallary');
    let images = containar.querySelector('.images');
    let input = containar.querySelector('#input-organization-charts');
    let imagesArr = [];
    let origin = window.location.origin + '/api/api_s/organization-chart';
    let seen = false;

   

    const popup = document.querySelector(`.settings-container-main`).querySelector('#imagePopup');
    const popupImage = popup.querySelector('#popupImage');
    const popupCloseBtn = popup.querySelector('#closePopup');


    let observer = new IntersectionObserver(async function (entries) {
        if (entries[0].isIntersecting && !seen) {
            seen = true;
            let response = await fetch(origin);
            if (response.status === 200) {
                imagesArr = (await response.json());
                orgTable()
            }
        }
    });


    observer.observe(images);
    function orgTable() {
        images.innerHTML = null;
        for (let i = 0; i < imagesArr.length; i++) {
            const el = imagesArr[i];
            images.innerHTML += (`<div class="image-box" image-box-id="${el.id}"><img src="${el.url}" alt="spinner"  ><div class="remove" title="delete chart" remove-id="${el.id}">&times;</div></div> `);
        }
        images.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('click', function (e) {
                e.preventDefault();
                popupImage.src = e.target.getAttribute('src');
                popup.style.display = 'block';
            });
        })
        images.querySelectorAll('.remove').forEach(function (el) {
            el.addEventListener('click', removeImage);
        })
    }

    
    async function removeImage(e = new Event('click')) {
        e.preventDefault();
        if (confirm('Do you want to delete this Organization chart ?') === false) return;
        let id = e.target.getAttribute('remove-id');
        let div=e.target.parentElement;
        div.style.opacity=.65;
        let res = await fetch(origin + `?id=${id}`, { method: 'delete' });
        if (res.status === 204) {
            await new Promise((resolve, reject) => { setTimeout(() => { resolve(true) }, 200) });
            div.remove();
        }
        imagesArr = imagesArr.filter(function (el) {
            if (el.id != id) return el;
        });
    }

    input.addEventListener('change', async function () {
        let array = input.files;
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            if (element.type === 'image/jpg' || element.type === 'image/jpeg' || element.type === 'image/png' || element.type === 'image/webp') {
                let form = new FormData();
                form.append('img', element);
                await new Promise((resolve, reject) => setTimeout(() => (resolve(true)), 10))
                let loader_id = Date.now();
                images.innerHTML += (`<div class="image-box" loader_id="${loader_id}" ><img src="/img/spinner.svg" alt="spinner"  loader_id="${loader_id}"><div class="remove">&times;</div></div> `)
                uplaodImageAndSetImage(form, loader_id);
            }
        }
    });


    async function uplaodImageAndSetImage(form, loader_id) {
        let response = await fetch(origin, { method: "POST", body: form });
        if (response.status === 200) {
            let data = await response.json();
            let div = images.querySelector(`[loader_id="${loader_id}"]`);
            let img = div.querySelector('img');
            img.src = data.url;
            if (res.status === 202) {
                let details = await res.json();
                div.removeAttribute('loader_id');
                img.removeAttribute('loader_id');
                let remove = div.querySelector('.remove');
                div.setAttribute('image-box-id', data.id);
                img.src = details.url;
                imagesArr.push(details);
                
                remove.setAttribute('remove-id', data.id);
                remove.addEventListener('click', removeImage);
                img.onclick = function(event) {
                    event.preventDefault();
                    popupImage.src = event.target.src;
                    popup.style.display = 'block';
                }
            }
        }
    }


    popupCloseBtn.addEventListener('click' , function (event) {
        event.preventDefault();
        popup.style.display = 'none';
    })
}
