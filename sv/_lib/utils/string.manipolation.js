/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { log } from "./smallUtils.js";


export async function MakePriceString(number) {
    if (Number(number).toString().toLocaleLowerCase==='nan') {
        log({number});
        throw 'error ,number is a nan'
    }
    let string= number.toString();
    let DotIndex= string.indexOf('.')

    if (DotIndex===-1) return string +'.00';
    let length = string.length ;
    let lastLength= length-1 -DotIndex;
    if (lastLength ===1) return string  + '0';
    if (lastLength ===2) return string  + '';
    if (lastLength > 2) {
    //    for (let i = DotIndex+2; i < string.length; i++) {
    //     log({i,string})
    //     string=string.slice(0,string.length-1) ;
    //     length = string.length ;
    //    } 

       string=await string.slice(0,DotIndex+4) ;
       let lastEl= string[string.length-1];
       log({lastEl})
       if (Number(lastEl )>5) {
        string= string.slice(0,DotIndex +3);
         lastEl= string.at(string.length-1);
        string= string.slice(0,DotIndex +2)
        return string+(Number(lastEl) +1)
       }
       if (Number(lastEl )<=5) {
        string= string.slice(1,DotIndex +3)
        return string;
       }
    }


}