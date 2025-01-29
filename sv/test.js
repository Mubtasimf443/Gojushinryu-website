/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/



function isValidUrl(string='') {
    if (!string.includes('http://') && !string.includes('https://')) return false;
    if (string.at(0) !== 'h' && string.at(1) !== 't' && string.at(2) !== 't' && string.at(3) !== 'p') return false;
    if (string.at(4) !== 's' &&string.at(4) !== ':' ) return false;
    if (string.at(4) === 's'){
        if (string.substring(5, 8) !== '://') return false;
        if (!string.substring(8).includes('.')) return false;
    }
    if (string.at(4) === ':'){
        if (string.substring(5, 7) !== '//') return false;
    }
    return true;
}

console.log(isValidUrl('https://www.freecodecamp.org/news/check-if-a-javascript-string-is-a-url/'));
console.log(isValidUrl('http://localhost:4000/courses'));