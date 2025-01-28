/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ 
Insha Allah,  Allah is enough for me
*/

import { repleCaracter, validate } from "string-player";
import Bugs from "../models/Bugs.js";



export async function createABugDb(type , description) {
    try {
        let bug= await Bugs.create({ type,description });
        return bug.uniqueId;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function bugFromAnErron(error, type) {
    try {
        console.error(error);
        type = type || 'Unkown Error';
        if (validate.isObject(error)) {
            type = type || 'Unkown Error';
            if (error.type || error.name ) {
                type = error.type || error.name;
            }
            let description =JSON.stringify(error);
            await Bugs.create({ type, description })
            return;
        } 
        if (validate.isString(error)) {
            await Bugs.create({ type, description: JSON.stringify({ error }) })
            return;
        }
    } catch (error) {
        console.error(error);
    }
}