/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import {log} from '../../index.js'
import { breakString, space4 } from "../variables.js";

export function breakJsonData(data) {
    if (typeof data === 'object') {
        data = JSON.stringify(data)
    }
    if (typeof data !== 'string') {
        throw {
            name: "breakJsonData error ",
            massage: "the typeof data is not string or pnject , it is " + (typeof data)
        }
    }
    try {
        JSON.parse(data)
    } catch (error) {
        throw {
            name: "breakJsonData error ",
            massage: "data is not valid json"
        }
    }
    if (data.includes('{"')) data = data.replace('{"', `{${breakString + space4}"`);
    if (data.includes('"}')) data = data.replace('"}', `"${breakString}}`);
    for (let i = 5; i > 4; i++) {
        if (data.includes('","')) data = data.replace('","', `",${breakString + space4}"`);
        if (!data.includes('","')) i = 3;
    }
    for (let i = 5; i > 4; i++) {
        if (data.includes('true,"')) data = data.replace('true,"', `true,${breakString + space4}"`);
        if (!data.includes('true,"')) i = 3;
    }
    for (let i = 5; i > 4; i++) {
        if (data.includes('false,"')) data = data.replace('false,"', `false,${breakString + space4}"`);
        if (!data.includes('false,"')) i = 3;
    }
    for (let i = 5; i > 4; i++) {
        if (data.includes(`":["`)) data = data.replace(`":["`, `":[${breakString + space4}"`);
        if (!data.includes(`":["`)) i = 3;
    }
    for (let i = 5; i > 4; i++) {
        if (data.includes(`"]}`)) data = data.replace(`"]}`, `"${breakString + space4}]${breakString}}`);
        if (!data.includes(`"]}`)) i = 3;
    }
    for (let i = 5; i > 4; i++) {
        if (data.includes(`"],"`)) data = data.replace(`"],"`, `"${breakString + space4}],${breakString + space4}"`);
        if (!data.includes(`"],"`)) i = 3;
    }

    for (let i = 5; i > 4; i++) {
        if (data.includes(']}')) data = data.replace(']}', `]${breakString}}`);
        if (!data.includes(']}')) i = 3;
    }
    for (let i = 5; i > 4; i++) {
        if (data.includes('1}')) data = data.replace('1}', `1${breakString}}`);
        if (!data.includes('1}')) i = 3;
    }
    for (let i = 5; i > 4; i++) {
        if (data.includes('2}')) data = data.replace('2}', `2${breakString}}`);
        if (!data.includes('2}')) i = 3;
    }
    for (let i = 5; i > 4; i++) {
        if (data.includes('3}')) data = data.replace('3}', `3${breakString}}`);
        if (!data.includes('3}')) i = 3;
    }
    for (let i = 5; i > 4; i++) {
        if (data.includes('4}')) data = data.replace('4}', `4${breakString}}`);
        if (!data.includes('4}')) i = 3;
    }
    for (let i = 5; i > 4; i++) {
        if (data.includes('5}')) data = data.replace('5}', `5${breakString}}`);
        if (!data.includes('5}')) i = 3;
    }
    for (let i = 5; i > 4; i++) {
        if (data.includes('6}')) data = data.replace('6}', `6${breakString}}`);
        if (!data.includes('6}')) i = 3;
    }
    for (let i = 5; i > 4; i++) {
        if (data.includes('7}')) data = data.replace('7}', `7${breakString}}`);
        if (!data.includes('7}')) i = 3;
    }
    for (let i = 5; i > 4; i++) {
        if (data.includes('8}')) data = data.replace('8}', `8${breakString}}`);
        if (!data.includes('8}')) i = 3;
    }
    for (let i = 5; i > 4; i++) {
        if (data.includes('9}')) data = data.replace('9}', `9${breakString}}`);
        if (!data.includes('9}')) i = 3;
    }
    for (let i = 5; i > 4; i++) {
        if (data.includes('0}')) data = data.replace('0}', `0${breakString}}`);
        if (!data.includes('0}')) i = 3;
    }
    return data;
}