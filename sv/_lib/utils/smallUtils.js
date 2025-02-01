/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */

export const log = (value) => console.log(value)
export  function Alert(params,res) {
    return res.json({error :params})
}
export function Success(res) {
     return res.json({success :true})
    
}



export function isValidUrl(string = '') {
    if (!string || typeof string !== 'string') return false;
    string=string.trim();
    if (string.length < 10) return false
    let array=['h','t','t','p'];
    for (let i = 0; i <= 3; i++) {
        if (string.at(i) !== array[i]) return false;
    }
    if (string.at(4) !== 's' && string.at(4) !== ':') return false;
    if (string.at(4) === 's') {
        if (string.substring(5, 8) !== '://') return false;
        if (!string.substring(8).includes('.')) return false;
    }
    if (string.at(4) === ':') {
        if (string.substring(5, 7) !== '//') return false;
    }
    return true;
}












