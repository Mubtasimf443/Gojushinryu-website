
/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/


export default class ValidatorErrors {
    constructor() {  
    }
    emtyArrayError(functionName){
        throw ({
            name :"validator_error",
            error:{
                functionName: functionName,
                emtyArray:true
            }
        });
    }
    notStringError(functionName,message){
        let errorObject={
            name :"validator_error",
            error:{
                functionName: functionName,
                notString:true
            }
        };
        if (message) errorObject.error['message']=message;
        throw errorObject;
    }
    emtyError(functionName,message){
        let errorObject={
            name :"validator_error",
            error:{
                functionName: functionName,
                emty:true
            }
        };
        if (message) errorObject.error['message']=message;
        throw errorObject;
    }

    notArrayError(functionName,message){
        let errorObject={
            name :"validator_error",
            error:{
                functionName: functionName,
                notArray:true
            }
        };
        if (message) errorObject.error['message']=message;
        throw errorObject;
    }
}
 