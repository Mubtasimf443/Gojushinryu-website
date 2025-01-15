/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import {log} from '../../index.js'

export function checkTimeString(time) {
    if (typeof time != 'string') throw 'not a correct time ' + time
    if (!time.includes(':')) throw 'not a correct time ' + time
    if (time.length !== 5) throw 'not a correct time ' + time
    time = time.split(':')
    if (time.length !== 2) throw 'not a correct time array'
    if (Number(time[0]).toString().toLowerCase == 'nan') throw 'not a correct time[0] ' + time[0]
    if (Number(time[1]).toString().toLowerCase == 'nan') throw 'not a correct time[1] ' + time[1]
    if (time[0] < 0 || time[0] > 23) throw 'not a correct time[1] ' + time[0]
    if (time[1] < 0 || time[1] > 59) throw 'not a correct time[1] ' + time[1]
    // log( time[0] > 11 ? Number(time[0]) - 11 : time[0])
    let string = (time[0] > 12 ? Number(time[0]) - 12 : time[0]) + ':' + time[1] + ' ' + (time[0] > 11 ? 'PM' : 'AM');
    return string
}