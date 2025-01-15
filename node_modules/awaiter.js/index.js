/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/
import { log } from 'console';
import fs from 'fs'

 async function Awaiter(time=1000) {
    if ( typeof time!=='number'  ) throw new Error("Awaiting Time is not a number");
    if ( time.toString()==='NaN' ) throw new Error("Awaiting Time can not be NaN");
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            resolve('completed')
        }, time);
    })
}

export async function waidTillFileLoad(options) {
    return new Promise(async (resolve, reject) => {
        if (typeof options !=='object') throw new Error('options is not define')
            let {filePath}=options;
            let waitedTime=0;
            let {checkingTime,maxWaitTime} =options;
            checkingTime=checkingTime ?checkingTime :50;
            if (typeof checkingTime !== 'number' ) {
                if (checkingTime.toString()!== 'NaN') {
                    checkingTime=50;
                }
            } 
            maxWaitTime=maxWaitTime ?maxWaitTime :10000;
            if (!filePath || typeof filePath!=='string') throw new Error('FilePath is not define');  
            let max=1;  
            for (let index = 2; index>max; index++) {
                if (waitedTime===maxWaitTime) {
                    max=index+1000;
                    resolve(false);
                }
                if (fs.existsSync(filePath)===true) {
                    max=index+1000;
                    resolve(true)
                }
                if (!fs.existsSync(filePath)) {
                    waitedTime+=checkingTime;
                    await Awaiter(checkingTime);
                }
            }
    })
}


export default Awaiter