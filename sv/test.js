/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

let pdf = [];
let currentPage = 9;
let pdfPerPage=10;
for (let i = 0; i <= 95; i++) {
    pdf.push(i)
}


function getPagePdf() {
    let p = [];
    let pdfStart= (currentPage -1 ) * 10;
    let pdfEnd= currentPage  * 10;
    for (let i = pdfStart; i < pdfEnd; i++) {
        if (!!pdf[i]) p.push(pdf[i]);
    }
    return p;
}


console.log(getPagePdf())
