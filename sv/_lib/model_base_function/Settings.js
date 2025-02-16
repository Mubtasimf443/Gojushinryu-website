/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import { log } from 'console';
import {Settings} from '../models/settings.js'
import catchError, { namedErrorCatching } from '../utils/catchError.js';
import { request, response, Router } from 'express';
import { UploadImgFile } from '../api/formidable.file.post.api.js';
import { Cloudinary } from '../Config/cloudinary.js';
import { v4 as uuid } from 'uuid';

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
        if (settings[element] === undefined) throw new Error("Invalid element "+element);
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

const organizationChartsRouter = Router();

organizationChartsRouter.route('/')
    .get(getOrganizationChart)
    .post(postOrganizationChart)
    .delete(deleteOrganizationChart);
async function postOrganizationChart(req = request, res = response) {
    try {
        let [path, fileds] = await UploadImgFile(req);
        let url = (await Cloudinary.uploader.upload(path, { public_id: uuid(), resource_type: 'image' })).url;
        let settings = await Settings.findOne({});
        if (!settings) throw new Error("settings is null");
        settings.organization_charts.push({ url, id: uuid() });
        await settings.save();
        return res.status(200).send({ url, id: settings.organization_charts[settings.organization_charts.length - 1].id });
    } catch (error) {
        catchError(res, error);
    }
}
async function deleteOrganizationChart(req = request, res = response) {
    try {
        let id = req.query.id;
        if (!id.trim()) throw 'Organization chart id is required';
        let settings = await Settings.findOne({});
        if (!settings) throw new Error("settings is null");
        settings.organization_charts = settings.organization_charts.filter(function (element) {
            if (element.id !== id) return element;
        });
        await settings.save();
        res.sendStatus(204);
        return;
    } catch (error) {
        catchError(res, error);
    }
}
async function getOrganizationChart(req = request, res = response) {
    try {
        let { organization_charts } = await Settings.findOne({}, 'organization_charts');
        return res.status(200).json(organization_charts);
    } catch (error) {
        catchError(res, error);
    }
}
export { organizationChartsRouter }