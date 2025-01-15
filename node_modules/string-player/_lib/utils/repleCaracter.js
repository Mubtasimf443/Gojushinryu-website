/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { validate } from "../Validator.js";


export function repleCaracter(txt) {
    if (!txt) throw new Error('Element is Undefined')
    let text = txt;
    let erorBoudary = 0;
    let noError = true;
    for (let i = 1; i > erorBoudary; i++) {
        noError = true;
        if (typeof text === 'number') return erorBoudary = i + 10;
        if (text.includes("'")) {
            text = text.replace("'", '&#39;');
            noError = false;
        }
        if (text.includes('"')) {
            text = text.replace('"', '&#34;')
            noError = false;
        }
        if (text.includes('`')) {
            text = text.replace("`", '&#96;');
            noError = false;
        }
        if (text.includes("(")) {
            text = text.replace("(", '&#40;');
            noError = false;
        }
        if (text.includes(")")) {
            text = text.replace(")", '&#41;');
            noError = false;
        }
        if (text.includes("{")) {
            text = text.replace("{", '&#123;');
            noError = false;
        }
        if (text.includes('}')) {
            text = text.replace('}', '&#125;')
            noError = false;
        }
        if (text.includes('[')) {
            text = text.replace("[", '&#91;');
            noError = false;
        }
        if (text.includes("]")) {
            text = text.replace("]", '&#93;');
            noError = false;
        }
        if (text.includes("$")) {
            text = text.replace("$", '&#36;');
            noError = false;
        }
        if (noError) {
            erorBoudary = i + 100;
        }
    }
    return text
}


export function repleCrAll(array=[]) {
    if (validate.isNotA.array(array)) throw new Error("array is not a Array");
    for (let index = 0; index < array.length; index++) {
       if (!array[index]) throw new Error("array is emty in the index of "+index);
       if (validate.isNotA.string(array[index])) throw new Error("array mush need to have all string and in index number " + index +' is not a string'); 
    }
    let repleArray=[];
    for (let i = 0; i < array.length; i++) {
        repleArray.push(repleCaracter(array[i]));
    }
    return repleArray;
}