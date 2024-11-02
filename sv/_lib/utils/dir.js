/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import path from 'path';
import {fileURLToPath} from 'url';
import fs from 'fs'
import { log } from 'console';
const __filename = fileURLToPath(import.meta.url);
let dirName = path.dirname(__filename);
import {createRequire} from 'module'

export function checkOrCreateTempDir() {
    let a =path.join(dirName , '../../temp/images');
    a=fs.existsSync(a);
    log({a})
    if (!a) {
        try {
            fs.mkdirSync(path.resolve(dirName, '../../temp'))
            fs.mkdirSync(path.resolve(dirName, '../../temp/images'));
            return true
        } catch (error) {
            console.error({error});
            return false
        }   
    }
}

export const giveDir=(P) =>{
    function child(params) {
        const require=createRequire(import.meta.url);
        let {fileURLToPath}=require('url');
        let __fileName=fileURLToPath(import.meta.url);
        return P.dirname(__fileName);
    }
    return child()
}