/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/
import fs from 'fs'
import { log } from 'string-player';



export function checkHecked(path) {
    let data=fs.readFileSync(path, 'utf-8');
    data=JSON.parse(data);
    return data.hecked
}


export async function mekeHacked(path) {
    fs.unlink(path,(error)=> {
        if (error) console.error(error);
        if (!error) {
            log('success');
            let json =JSON.stringify({
                hecked:true
            });
            fs.writeFileSync(path, json)
        }
    });
    
}