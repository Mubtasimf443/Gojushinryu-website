/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { log } from "./smallUtils.js";

export default async function replaceCarecter(text,errorNum) {
    if (errorNum===false) return text
    if (typeof errorNum ==='number') {
        if (errorNum===1) return replaceCarecter( await text.replace("'",'&#39;'));
        if (errorNum===2) return replaceCarecter( await text.replace('"','&#34;'));
        if (errorNum===3) return replaceCarecter( await text.replace("`",'&#96;'));
        if (errorNum===4) return replaceCarecter( await text.replace("(",'&#40;'));
        if (errorNum===5) return replaceCarecter( await text.replace(")",'&#41;'));
        if (errorNum===6) return replaceCarecter( await text.replace("{",'&#123;'));
        if (errorNum===7) return replaceCarecter( await text.replace("}",'&#125;'));
        if (errorNum===8) return replaceCarecter( await text.replace("[",'&#91;'));
        if (errorNum===9) return replaceCarecter( await text.replace("]",'&#93;'));
        if (errorNum===10) return replaceCarecter( await text.replace("$",'&#36;'));
    }
    if (!errorNum) {
        if (typeof text === "number") return replaceCarecter(text,false);
        if (typeof text === 'object') throw new Error('Object Can not be used');
        if (text.includes("'")) return replaceCarecter(text ,1)
        if (text.includes('"')) return replaceCarecter(text ,2)
        if (text.includes('`')) return replaceCarecter(text ,3)
        if (text.includes("(")) return replaceCarecter(text ,4)
        if (text.includes(")")) return replaceCarecter(text ,5)
        if (text.includes("}")) return replaceCarecter(text ,6)
        if (text.includes("{")) return replaceCarecter(text ,7)
        if (text.includes("]")) return replaceCarecter(text ,8)
        if (text.includes("[")) return replaceCarecter(text ,9)
        if (text.includes("$")) return replaceCarecter(text ,10)
        return replaceCarecter(text,false)
    }
}



export async function repleCaracter(txt) {
    if (!txt) throw new Error('Element is Undefined')
    let text=txt;
    let erorBoudary =0;       
    let noError =true;
    for (let i=1; i>erorBoudary ;i++) {
        noError =  true;
        if (typeof text === 'number') return erorBoudary =i+10;
        if (text.includes("'")) {
            text = await text.replace("'",'&#39;') ;
            noError=await false;
        }
        if (text.includes('"')) {
            text= await text.replace('"','&#34;')
            noError=await false;
        }
        if (text.includes('`')) {
            text = await text.replace("`",'&#96;') ;
            noError=await false;
        }
        if (text.includes("(")) {
            text = await text.replace("(",'&#40;') ;
             noError=await false;
        }
        if (text.includes(")")) {
            text = await text.replace(")",'&#41;') ;
            noError=await false;
        }
        if (text.includes("{")) {
            text = await text.replace("{",'&#123;') ;
             noError=await false;
        }
        if (text.includes('}')) {
            text=  await text.replace('}','&#125;')
             noError=await false;
        }
        if (text.includes('[')) {
            text = await text.replace("[",'&#91;') ;
            noError=await false;
        }
        if (text.includes("]")) {
            text = await text.replace("]",'&#93;') ;
             noError=await false;
        }
        if (text.includes("$")) {
            text =  await text.replace("$",'&#36;') ;
            noError=await false;
        }
        if (noError) {
            erorBoudary=i +100;     
        }   
    }
    return text
}  