/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ 
Insha Allah,  Allah is enough for me
*/

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