
/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/


import { validate } from "./Validator.js";


export default  class ToBe {
    constructor({}={}) {}
    minMax(val='',min =0,max =0 , equal=false){
        if (!validate.isString(val) ) throw new Error('value is not a string , please give a string as a value')
        if (!validate.isNum(min)) throw new Error("min length is not a number");
        if (!validate.isNum(max)) throw new Error("max length is not a number");
        if (equal) return (val.length >= min && val.length <= max);
        return (val.length > min && val.length < max);
    }
    max(val='',max=0,equal=false){
        if (!validate.isString(val) ) throw new Error('value is not a string , please give a string as a value')
        if (!validate.isNum(max)) throw new Error("max length is not a number");
        if (equal) return (val.length<=max);
        return (val.length<max);
    }
    min(val='',min=0,equal=false){
        if (!validate.isString(val) ) throw new Error('value is not a string , please give a string as a value')
        else if (!validate.isNum(min)) throw new Error("min length is not a number");
        else if (equal) return (val.length>=min);
        else return (val.length>min);
    }
    gt(val , min){
        if (!validate.isNum(min)) throw new Error("min length is not a number");
        if (!validate.isNum(val)) throw new Error("val length is not a number");
        return (val > min);
    }
    lt(val , max){
        if (!validate.isNum(max)) throw new Error("max length is not a number");
        if (!validate.isNum(val)) throw new Error("val length is not a number");
        return (val < max);
    }
}

export const tobe=new ToBe({});
export {ToBe}