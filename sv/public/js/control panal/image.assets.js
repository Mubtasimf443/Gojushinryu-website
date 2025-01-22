/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/

{
    let containar = document.querySelector('#assets_container');
    let images = containar.querySelector('.images');
    let input = containar.querySelector('#upl-image-as-assets');
    let imagesArr = [];
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
        let response = await fetch(window.location.origin + '/api/api_s/upload-image-for-25-minutes', { method: "POST", body: form });
        if (response.status === 201) {
            let data = await response.json();
            let div = images.querySelector(`[loader_id="${loader_id}"]`);
            if (div) {
                let img = div.querySelector('img');
                img.src = data.link;
                let res = await fetch(window.location.origin + '/api/api_s/assets/image?id=' + data.image_id, { method: 'POST' });
                if (res.status === 202) {
                    let details = await res.json();
                    div.removeAttribute('loader_id');
                    img.removeAttribute('loader_id');
                    let remove = div.querySelector('.remove');
                    div.setAttribute('image-box-id', details.id);
                    img.src = details.url;
                    imagesArr.push(details);
                    remove.setAttribute('remove-id', details.id);
                    remove.addEventListener('click', removeImage);
                }
            }
        }
    }

    let seen = false;
    let observer = new IntersectionObserver(async function (entries) {
        if (entries[0].isIntersecting && !seen) {
            seen = true;
            let response = await fetch(window.location.origin + '/api/api_s/assets/image/control-panal');
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
            images.innerHTML += (`<div class="image-box" image-box-id="${el.id}"><img src="${el.url}" alt="spinner"  ><div class="remove" remove-id="${el.id}">&times;</div></div> `);
        }
        images.querySelectorAll('.remove').forEach(function (el) {
            el.addEventListener('click', removeImage);
        })
    }

    async function removeImage(e = new Event('click')) {
        e.preventDefault();
        let id = e.target.getAttribute('remove-id');
        let div=e.target.parentElement;
        div.style.opacity=.65;
        let res = await fetch(window.location.origin + `/api/api_s/assets?id=${id}`, { method: 'delete' });
        if (res.status === 204) {
            await new Promise((resolve, reject) => { setTimeout(() => { resolve(true) }, 200) });
            div.remove();
        }
        imagesArr = imagesArr.filter(function (el) {
            if (el.id != id) return el;
        });
    }

}