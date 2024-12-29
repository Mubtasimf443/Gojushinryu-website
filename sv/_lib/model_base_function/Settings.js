/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import { log } from 'console';
import {Settings} from '../models/settings.js'
import { namedErrorCatching } from '../utils/catchError.js';

export async function settingsAsString(params) {
    let settings=await Settings.findOne({});
    if (!settings) throw new Error("settings is null");
    if (settings[params]) return settings[params]
    else {
        return undefined
    }
}
export async function settingsAsArray(array) {
    let settings=await Settings.findOne({});
    if (!settings) throw new Error("settings is null");
    let newArray=[];
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        if (!settings[element]) throw new Error("Invalid element "+element);
        newArray.push(settings[element]);
    }
    return newArray
}


export async function settingsAsObject(array) {
    let settings=await Settings.findOne({});
    if (!settings) throw new Error("settings is null");
    let newObject={};
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        newObject[element]=settings[element];
    }
    return newObject
}


export async function setSettings(name ,value) {
    let settings=await Settings.findOne({});
    if (!settings) throw new Error("settings is null");
    settings[name]=value;
    await settings.save();
    return true;
}

export async function getSettings(params) {
    let settings=await Settings.findOne({});
    if (!settings) throw new Error("settings is null");
    return settings;
}



export async function setSettingsAsArray({keys,values}){
    if (!(Array.isArray(keys) && Array.isArray(values))) namedErrorCatching('keys-values-error','keys and values should be a array')
    if (keys.length !== values.length) throw 'keys and length shoud be same';
    let settings=await Settings.findOne({});
    if (!settings) throw new Error("settings is null");
    
    for (let i = 0; i < keys.length; i++) {
        if (!keys[i]) {
            delete keys[i];
            delete values[i];
        }
    }

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i], value= (!values[i] ? null : values[i]);
        settings[key]=value;
    }

    await settings.save().catch(
        function(error) {
            return console.error(error);
        }
    );
}