/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ   
Insha Allab,  By the marcy of Allah,  I will gain success
*/

document.addEventListener('click', e => {
    let flagsArray=new Array()
    let flags =document.querySelectorAll('.flag');
    for (let i = 0; i < flags.length; i++) {
        let country= flags[i].querySelector('h2').innerHTML;
        let imageSrc=flags[i].querySelector('img').src.replace(window.location.origin, '');
        let arr=[country, imageSrc];
        flagsArray.push(arr)
    }
    let arr=JSON.stringify(flagsArray);
    navigator.clipboard.writeText(arr)
})