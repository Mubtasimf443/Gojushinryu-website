/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/

{
    let container =document.querySelector(`.pdf_syllabus`);
    let seen =false;
    
    async function loadPDFs() {
        try {
            const response = await fetch(window.location.origin+'/api/api_s/sylabus/assets/pdf'); // Adjust API endpoint
            let pdfs = response.status === 200 ? (await response.json()) : new Array();
            const pdfContainer = document.getElementById('pdf-container');
            pdfContainer.innerHTML = '';

            pdfs.forEach(pdf => {
                const pdfWrapper = document.createElement('div');
                pdfWrapper.classList.add('pdf-wrapper');

                // Create title element
                const title = document.createElement('h3');
                title.textContent = pdf.title;
                title.classList.add('pdf-title');

                // Create iframe for PDF preview
                const iframe = document.createElement('iframe');
                iframe.src = pdf.content;
                iframe.width = '100%';
                iframe.height = '400px';

                // Create download button
                const downloadLink = document.createElement('a');
                downloadLink.href = pdf.content;
                downloadLink.textContent = 'Download PDF';
                downloadLink.classList.add('pdf-download');
                downloadLink.setAttribute('download', pdf.title);

                pdfWrapper.appendChild(title);
                pdfWrapper.appendChild(iframe);
                pdfWrapper.appendChild(downloadLink);
                pdfContainer.appendChild(pdfWrapper);
            });
        } catch (error) {
            console.error('Error loading PDFs:', error);
        }
    }
    let observer = new IntersectionObserver(async function (entry) {
        try {
            if (entry[0].isIntersecting === false || seen) return;
            seen=true;         
            loadPDFs()
        } catch (error) {
            console.log(error);
        }
    });
    observer.observe(container);
   

}