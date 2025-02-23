/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ
InshaAllah, By his Marcy I will Gain Success 
*/

{
    let container =document.querySelector(`.pdf_syllabus`);
    let seen =false;
    let currentPage = 1;
    let pdfs=[];
    async function loadPDFs() {
        try {
            const response = await fetch(window.location.origin+'/api/api_s/sylabus/assets/pdf'); // Adjust API endpoint
            pdfs = response.status === 200 ? (await response.json()) : new Array();
            currentPage = 1;
            let p = getCurrentPdfs();
            addPdfs(p);
        } catch (error) {
            console.error('Error loading PDFs:', error);
        }
    }
    let observer = new IntersectionObserver(async function (entry) {
        try {
            if (entry[0].isIntersecting === false || seen) return;
            seen=true;         
            loadPDFs();
        } catch (error) {
            console.log(error);
        }
    });
    observer.observe(container);
    function getCurrentPdfs() {
        let p = [];
        for (let i = (currentPage - 1) * 10; i < currentPage  * 10; i++) {
            const element = pdfs[i];
            if (element) p.push(element);
            return p;
        }
    }
    function addPdfs(pdfs=[]) {
        const pdfContainer = document.getElementById('pdf-container');
        const pdfWrapper = document.createElement('div');
        pdfContainer.innerHTML = '';
        pdfs.forEach(pdf => {

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
        return ;
    }

    container.querySelector('select').addEventListener('select', function (event) {
        currentPage=container.querySelector('select').selectedOptions[0].value;
        currentPage = Number(currentPage);
        addPdfs(getCurrentPdfs())
    })
}