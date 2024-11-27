/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/

document.addEventListener('click', e => {
    let h2 =document.querySelectorAll('h2');
    let arr=new Array();
    for (let i = 0; i < h2.length; i++) arr.push(h2[i].innerText)
    arr = arr.map(el => {
        return `<option value="${el}">${el}</option>`
    });
    arr=arr.join(`
        `);
    navigator.clipboard.writeText(arr);
    console.log(arr);
    
})