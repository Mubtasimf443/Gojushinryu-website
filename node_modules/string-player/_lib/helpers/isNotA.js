
/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

export class isNotA {
    constructor() {}
    string = value => (typeof value !== 'string');
    array = array => (Array.isArray(array) === false);
    boolean = (bool) => (typeof bool !== 'boolean');
    emty = val => (!val ? true : false);
    null = data=> (data !== null);
    object=obj=> (typeof obj !== 'object');
    func= f => (typeof f !== 'function');
    num =function (number) {
        if (Number(number).toString() === 'NaN') return true;
        return (typeof number !== 'number')
    };
    json(data){
        try {
            if (typeof JSON.parse(data) === 'object') return false;
            else return true
        } catch (error) { 
            return true  
        }
    }
    undefined(val) {
        return (val !== undefined);
    }
}
export default isNotA;
export const isnota=new isNotA()