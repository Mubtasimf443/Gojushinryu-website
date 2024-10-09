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

export  function makeTimeString(time) {
    if (typeof time != 'string') throw 'not a correct time ' +time
    if ( !time.includes(':')) throw 'not a correct time ' +time
    if ( time.length !== 5) throw 'not a correct time ' +time
    time =time.split(':')
    if ( time.length !== 2) throw 'not a correct time array' 
    if ( Number(time[0]).toString().toLowerCase=='nan') throw 'not a correct time[0] ' +time[0]
    if ( Number(time[1]).toString().toLowerCase=='nan') throw 'not a correct time[1] ' +time[1]
    if (time[0] <0 || time[0]>23) throw 'not a correct time[1] ' +time[0]
    if ( time[1] <0 || time[1]>59) throw 'not a correct time[1] ' +time[1]
    log(time[0] > 11 ? Number(time[0])-11
     : time[0])
    let string =(time[0] > 12 ? Number(time[0])-12 : time[0] ) + ':'  + time[1] + ' ' + (time[0] > 11 ? 'PM': 'AM' );
    return string
}

export function mekeLinkString(data) {
    if (typeof data !== 'string') throw 'Data not a string' +data;
    let limit=9;
    for (let i = 10; i>limit ; i++) {
        if (data.includes(' ')) {
            data =data.replace(' ','-');
        }
        if (!data.includes(' ')) limit=i+100;
    }

    return data
}

