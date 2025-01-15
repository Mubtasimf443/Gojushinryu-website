
/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import isNotA from "./helpers/isNotA.js";
import ValidatorErrors from "./helpers/ValidatorErrors.js";



export default class Validator {
    constructor({giveError}={}) {   
        this.giveError=giveError ?? false;
        this.ErrorFunction=new ValidatorErrors();
    };
    isAllString(array=[],giveError) {
        giveError=giveError || this.giveError || false;
        let index=array.findIndex(
            function(element){
                if (typeof element!=='string') {
                    return element;
                }
            }
        );
        if (index !== -1 && giveError===true) {
            throw {
                name :"validator_error",
                error:{
                    notEmtyIndex:index,
                    functionName :'isAllString',
                }
            }
        }
        return (index === -1 )
    }
    isString(val=''){
        if ( typeof val === 'string' ) return true;
        else return false;
    }
    isEmty(val=''){
        const isString = this.isString;
        if (val === null || val === undefined) return true;
        else if (isString(val)) {
            if (val.trim().length === 0) {
                return true;
            } else {
                return false;
            }
        }
        else return false;
    }
    isAllEmty(array=[]){
        let returningValue=true;
        for (let i = 0; i < array.length; i++) {
            if ( this.isEmty(array[i]) === false )  return false;
            if (i === array.length -1) return true;
        }
    }
    isNotEmty(val=""){
        if (val === undefined || val === null) return false
        if (this.isString(val)) {
            if (val.trim().length === 0) return false
            if (val.trim().length !== 0) return true
        }
        return true
    }
    isAllNotEmty(array=[]){
        const errors=new ValidatorErrors()
        if (Array.isArray(array) ===false) errors.notArrayError('isAllNotEmty', 'array is not a Array');
        if (array.length ===0 ) errors.emtyArrayError(isAllNotEmty);
        for (let i = 0; i < array.length; i++) {
            if (this.isEmty(array[i])) return false;
        }
        return true;
    }
    isBool(val=false){
        return ( typeof val==='boolean')
    }
    isAllBool(array=[]){
        if (array.length === 0) {
            if (this.giveError) {
                throw {
                    name :"validator_error",
                    error:{
                        type:'array is emty',
                        functionName:'isAllBool',
                        emtyArray:true
                    }
                }
            } else return false;
        }
        for (let i = 0; i < array.length; i++) {
            if (this.isBool(array[i]) ===false) return false;
            if (i ===array.length-1) return true;
        }
    }
    isNaN(value) {
        if (typeof value !== 'number') return false;
        if (String(value) ==='NaN') return true;
    }
    isNum(num =1){
        if (typeof num !== 'number') return false;
        else if (this.isNaN(num)) return false;
        else return true;
    }
    isAllNum(array=[]){
        if (array.length===0){
            if (this.giveError) {
                throw {
                    name :"validator_error",
                    error:{
                        functionName: 'isAllString',
                        emtyArray:true
                    }
                }
            }
            else return false;
        }
        for (let i = 0; i < array.length; i++) {        
            if (this.isNum(array[i]) ===false) return false;
            else if (i ===array.length-1) return true;
        }
    }
    isFunc(func=()=>{}){
        return (typeof func==='function')
    }
    isAllFunc(array=[]){
        if (array.length===0){
            if (this.giveError) {
                throw {
                    name :"validator_error",
                    error:{
                        functionName: 'isAllFunc',
                        emtyArray:true
                    }
                }
            }
            else return false;
        }
        for (let i = 0; i < array.length; i++) {
            if (this.isFunc(array[i]) ===false) return false;
            else if (i === array.length-1) return true;
        }
    }
    isArray =Array.isArray;
    isAllArray(array=[]) {
        if (array.length===0){
            if (this.giveError) {
                throw {
                    name :"validator_error",
                    error:{
                        functionName: 'isAllArray',
                        emtyArray:true
                    }
                }
            }
            else return false;
        }
        for (let i = 0; i < array.length; i++) {
            if (this.isArray(array[i]) ===false) return false;
            else if (i ===array.length-1) return true;
        }
    }
    hasAll(value='', array=[]) {
        if (this.isEmty(array)) this.ErrorFunction.emtyError('hasAll' , 'array is emty');
        else if (this.isEmty(value)) this.ErrorFunction.emtyError('hasAll' , 'value is emty');
        else if (!this.isArray(array)) this.ErrorFunction.notArrayError('hasAll', 'array is not an Array')
        else if (!this.isString(value)) this.ErrorFunction.notStringError('hasAll')
        else if (array.length===0) {
            if (this.giveError){
                throw ({
                    name :"validator_error",
                    error:{
                        functionName: 'hasAll',
                        emtyArray:true
                    }
                });
            } else return false;
        }
        array=array.filter(function(element){
            if (element) return element;
        });
        
        for (let i = 0; i < array.length; i++) {
            if (value.includes(array[i])) return true
        }
        return false;
    }
    isNull(val) {
        return (val === null);
    }
    isUndefined(val){
        return (val === undefined);
    }
    isEmail(mail=''){
        if (this.isEmty(mail)) return false;
        if (!this.isString(mail)) return false;
        if (mail.length > 300) return false;
        if (mail.length < 7) return false;
        // console.log(mail.at(0))
        if (this.isNum(Number(mail.at(0)))) return false;
        if (!mail.includes('@'))return false;
        if (!mail.includes('.'))return false;
        if (mail.split('.').length !== 2 )return false;
        if (mail.split('.')[1].length > 15 || mail.split('.')[1].length < 2  )return false;
        if (mail.split('@').length !== 2 ) return false;
        if (this.hasAll(mail, ['%', '<', '>', "$","&",'*','#', '^', '`','"',"'", "!", "~", '|',',', "}", "{",'[',']','(',')'])) return false;
        return true;
    }
    isObject(obj){
        return (typeof obj === 'object');
    }
    json(data){
        try {
            if (typeof JSON.parse(data) === 'object') return true;
            else return false
        } catch (error) { 
            return false  
        }
    }
    
    isNotA=isnotaFunction()
}



const validate=new Validator({});


function isnotaFunction() {
    class isNotA {
        constructor() { }
        string = value => (typeof value !== 'string');
        array = array => (Array.isArray(array) === false);
        boolean = (bool) => (typeof bool !== 'boolean');
        emty = val => (!val ? true : false);
        null = data => (data !== null);
        object = obj => (typeof obj !== 'object');
        func = f => (typeof f !== 'function');
        num = function (number) {
            if (Number(number).toString() === 'NaN') return true;
            return (typeof number !== 'number')
        };
        json(data) {
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
    return (new isNotA())
}

export {Validator,validate};