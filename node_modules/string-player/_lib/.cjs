/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/
export const breakString=`
`;
export const space4='    ';


exports.MakePriceString= async function MakePriceString(number) {
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
exports.checkTimeString=  function checkTimeString(time) {
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
exports.mekeLinkString= function mekeLinkString(data) {
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
exports.repleCaracter=  async function repleCaracter(txt) {
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
exports.log= function log(value) {
    return console.log(value)
}
exports.GenerateOTP= class GenerateOTP{
    constructor(length) {
        if (typeof length !== 'number') length=6;
        let max='1';
        for (let index = 0; index < length; index++) max=max+'0';
        max=Number(max);
        this.required=max-1;
        this.max=max;
        this.min=max/10-1;
    }
    getPin= () => {
            function generatePin(options) {
               // console.log(options);
                if (options === undefined) options={};
                let {val, min ,max}=options;
                if (typeof min!=='number') min=99999;
                if (typeof max!=='number') max=1000000;
                if (typeof val !== 'number') return generatePin({val:Math.floor(Math.random()*(max-1)) , max,min})
                if ( val > min &&  val < max) return val
                return generatePin({val:Math.floor(Math.random() * 999999) ,max,min})
            };
            return generatePin({max:this.max, min :this.min })
        }
}
exports.makeUrlWithParams=  function makeUrlWithParams(base ,object,hasparams) {
    if (typeof base!=='string') throw 'error,  base is not a string'
    if ( typeof object !=='object') throw 'error, Only Object is allowed'
    if (object instanceof Array===true) throw 'error, Only Object is allowed'
    let array= Object.entries(object)
    for (let i = 0; i < array.length; i++) {
      const el = array[i];
      i===0 && !hasparams ? base=base+'?'+el[0]+'='+el[1]
      :base=base+'&'+el[0]+'='+el[1]
    }
    return base
  }
exports.breakJsonData= function breakJsonData(data) {
    if (data.includes('{"')) data= data.replace('{"',`{${breakString+space4}"`);
    if (data.includes('"}')) data=data.replace('"}',`"${breakString}}`);
    for (let i = 5; i > 4; i++) {
        if (data.includes('","')) data= data.replace('","',`",${breakString+space4}"`);
        if (!data.includes('","')) i=3;
    }
    for (let i = 5; i > 4; i++) {
        if (data.includes('true,"')) data= data.replace('true,"',`true,${breakString+space4}"`);
        if (!data.includes('true,"')) i=3;
    }
    for (let i = 5; i > 4; i++) {
        if (data.includes('false,"')) data= data.replace('false,"',`false,${breakString+space4}"`);
        if (!data.includes('false,"')) i=3;
    }
    
    for (let i = 5; i > 4; i++) {
        if (data.includes(`":["`)) data= data.replace(`":["`,`":[${breakString+space4}"`);  
        if (!data.includes(`":["`)) i=3;          
    }
    for (let i = 5; i > 4; i++) {
        if (data.includes(`"]}`)) data= data.replace(`"]}`,`"${breakString+space4}]${breakString}}`);  
        if (!data.includes(`"]}`)) i=3;          
    }
    for (let i = 5; i > 4; i++) {
        if (data.includes(`"],"`)) data= data.replace(`"],"`,`"${breakString+space4}],${breakString+space4}"`);  
        if (!data.includes(`"],"`)) i=3;          
    } 
    
    for (let i = 5; i > 4; i++) {
        if (data.includes(']}')) data= data.replace(']}',`]${breakString}}`);
        if (!data.includes(']}')) i=3;
    }
    return data; 
}