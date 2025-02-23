/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/
{
    let container =document.querySelector(`.image_syllabus`);
    let seen =false;
    let currentImagePage=1; 
    let images=[];
    let imgPerPage=20;
    async function loadImages() {
        try {
            const response = await fetch(window.location.origin + '/api/api_s/sylabus/assets/image'); // Adjust API endpoint
            images = await response.json();
            addImages(getImages());
            let select = document.querySelector('select');
            select.innerHTML=null;
            for (let i = 1; i <= images.length / imgPerPage; i++) {
                const element = document.createElement('option');
                element.value =i;
                element.innerHTML = 'Page ' + i;
                select.appendChild(select);
            }
            select.addEventListener('change', function (e) {
                currentImagePage = select.selectedOptions[0].value;
                currentImagePage = Number(currentImagePage);
                addImages(getImages());
                return;
            })
        } catch (error) {
            console.error('Error loading images:', error);
        }
    }
    let observer = new IntersectionObserver(async function (entry) {
        try {
            if (entry[0].isIntersecting === false || seen) return;
            seen=true;         
            loadImages()
        } catch (error) {
            console.log(error);
        }
    });
    observer.observe(container);

    function addImages(images=[]) {
        const imageContainer = document.getElementById('image-container');
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
            const downloadBtn = document.createElement('a');
            downloadBtn.href = image.content;
            downloadBtn.textContent = 'Download';
            downloadBtn.classList.add('download-btn');
            downloadBtn.setAttribute('download', image.title);

            // Append elements
            imgWrapper.appendChild(img);
            imgWrapper.appendChild(downloadBtn);
            imageCard.appendChild(title);
            imageCard.appendChild(imgWrapper);
            imageContainer.appendChild(imageCard);
        });
    }

    function getImages() {
        let starting = (currentImagePage - 1) * 10;
        let ending = currentImagePage * 10;
        let imm=[];
        for (let i = starting; i <= ending; i++) {
            if (!!images[i === 0 ? 0 : i - 1]) imm.push(images[i === 0 ? 0 : i - 1])
        }
        return imm;
    }
}