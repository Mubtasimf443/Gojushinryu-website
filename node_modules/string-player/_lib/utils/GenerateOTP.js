/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import {log} from '../../index.js'

export class GenerateOTP {
    constructor(length) {
        if (typeof length !== 'number') length = 6;
        let max = '1';
        for (let index = 0; index < length; index++) max = max + '0';
        max = Number(max);
        this.required = max - 1;
        this.max = max;
        this.min = max / 10 - 1;
    }
    getPin = () => {
        function generatePin(options) {
            // console.log(options);
            if (options === undefined) options = {};
            let { val, min, max } = options;
            if (typeof min !== 'number') min = 99999;
            if (typeof max !== 'number') max = 1000000;
            if (typeof val !== 'number') return generatePin({ val: Math.floor(Math.random() * (max - 1)), max, min })
            if (val > min && val < max) return val
            return generatePin({ val: Math.floor(Math.random() * 999999), max, min })
        };
        return generatePin({ max: this.max, min: this.min })
    }
}