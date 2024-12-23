/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import { log } from 'console';
import {Settings} from '../models/settings.js'

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