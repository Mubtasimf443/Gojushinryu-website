/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { validate } from "../Validator.js";


export function makeLinkString(data) {
    if (typeof data !== 'string') throw 'Data not a string' + data;
    let limit = 9;
    for (let i = 10; i > limit; i++) {
        if (data.includes(' ')) {
            data = data.replace(' ', '-');
        }
        if (!data.includes(' ')) limit = i + 100;
    }
    return data
}

export function makeUrlWithParams(base = '', params = {}) {
    if (!validate.isString(base) || !validate.isEmty(base)) throw 'base is not a string';
    if (validate.isEmty(params)) params = {};
    if (!validate.isObject(params) || validate.isArray(params)) throw new Error('Params Must be a object');
    return (base + '?' + (new URLSearchParams(params)).toString());
}


export async function MakePriceString(number) {
    if (Number(number).toString().toLocaleLowerCase === 'nan') throw 'error ,number is a nan';
    let string = number.toString();
    let DotIndex = string.indexOf('.')
    if (DotIndex === -1) return string + '.00';
    let length = string.length;
    let lastLength = length - 1 - DotIndex;
    if (lastLength === 1) return string + '0';
    if (lastLength === 2) return string + '';
    if (lastLength > 2) {
        string = await string.slice(0, DotIndex + 4);
        let lastEl = string[string.length - 1];
        if (Number(lastEl) > 5) {
            string = string.slice(0, DotIndex + 3);
            lastEl = string.at(string.length - 1);
            string = string.slice(0, DotIndex + 2)
            return string + (Number(lastEl) + 1)
        }
        if (Number(lastEl) <= 5) {
            string = string.slice(1, DotIndex + 3)
            return string;
        }
    }
}


export function MakePriceStringSync(number) {
    if (Number(number).toString().toLocaleLowerCase === 'nan') throw 'error ,number is a nan';
    let string = number.toString();
    let DotIndex = string.indexOf('.')
    if (DotIndex === -1) return string + '.00';
    let length = string.length;
    let lastLength = length - 1 - DotIndex;
    if (lastLength === 1) return string + '0';
    if (lastLength === 2) return string + '';
    if (lastLength > 2) {
        string = string.slice(0, DotIndex + 4);
        let lastEl = string[string.length - 1];
        if (Number(lastEl) > 5) {
            string = string.slice(0, DotIndex + 3);
            lastEl = string.at(string.length - 1);
            string = string.slice(0, DotIndex + 2)
            return string + (Number(lastEl) + 1)
        }
        if (Number(lastEl) <= 5) {
            string = string.slice(1, DotIndex + 3)
            return string;
        }
    }
}