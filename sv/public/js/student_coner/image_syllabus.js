/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/
{
    let container =document.querySelector(`.image_syllabus`);
    let seen =false;

    async function loadImages() {
        try {
            const response = await fetch(window.location.origin + '/api/api_s/sylabus/assets/image'); // Adjust API endpoint
            const images = await response.json();
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
}