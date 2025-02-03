/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ 
Insha Allah,  Allah is enough for me
*/

import { request, response } from "express";
import catchError, { namedErrorCatching } from "../utils/catchError.js";
import formidable from "formidable";
import { ImageUrl } from "../models/imageUrl.js";

import fs from 'fs'
import { Cloudinary } from "../Config/cloudinary.js";
import Assets from "../models/Assets.js";
import Awaiter from "awaiter.js";
import { isnota, tobe, validate } from "string-player";


export async function findImageAssetsControlPanal(req = request, res = response) {
    try {
        return res.status(200).json((await Assets.find({}, 'url id').where('type').equals('image').sort({ id: -1 })).map(el => ({ url: el.url, id: el.id })));
    } catch (error) {
        catchError(res,error);
    }
}

export async function UploadImageAssets(req = request, res = response) {
    try {
        let id = Number(req.query.id);
        if (id !== 0 && id.toString() !== 'NaN' && id < Date.now()) {
            let urlPath = (await ImageUrl.findOne({ id }))?.urlpath;
            if (!fs.existsSync(urlPath)) namedErrorCatching('Database Error', 'No Image is in the server with the id of '+id);
            let image=await Cloudinary.uploader.upload(urlPath, { resource_type: 'image', public_id: Date.now() + '___' + Math.floor(Math.random() * 100000000) })
            await Awaiter(20);
            let asset = new Assets({ type: 'image', url: image.url });
            await asset.save();
            return res.status(202).json({ url: asset.url, id: asset.id });
        }
        if (id === 0) namedErrorCatching('p error', 'id is 0');
        if (id.toString() === 'NaN' ) namedErrorCatching('p error', 'id is NaN');
        if (id > Date.now() ) namedErrorCatching('p error', 'id is not valid');
     
    } catch (error) {
        catchError(res, error);
    }
}

export async function UploadVideoAssets(req = request, res = response) {
    try {
        let { iframe, title, description } = req.body;

        if (isnota.string(title) || validate.isEmty(title)) namedErrorCatching('p error', 'title is not string or emty');
        if (isnota.string(description) || validate.isEmty(description)) namedErrorCatching('p error', 'description is not string or emty');
        if (typeof iframe !=='string') namedErrorCatching('p error', 'iframe is not string');

        [title, description, iframe] = [title.trim(), description.trim(), iframe.trim()]
        if (!tobe.minMax(title, 5, 100, true)) namedErrorCatching('p error', 'title is too big or too large');
        if (!tobe.minMax(description, 5, 200, true)) namedErrorCatching('p error', 'description is too big or too large');


        if (iframe.length < 20 || iframe.length > 1000) {
            namedErrorCatching('p error', 'iframe is not valid');
        }
        await Awaiter(20);
        let asset = await Assets.create({ iframe: encodeURIComponent(iframe), type: 'video', title, description });
        
        return res.status(202).json({ image: asset.iframe, id: asset.id });
    } catch (error) {
        catchError(res, error);
    }
}


export async function deleteAsset(req = request, res = response) {
    try {
        let id = Number(req.query.id);
        if (id !== 0 && id.toString() !== 'NaN' && id < Date.now()) {
            let a=await Assets.findOne().where('id').equals(id);
            if (a) await Assets.findOneAndDelete().where('id').equals(id);
            res.sendStatus(204);
            return ;
        }
        if (id === 0) namedErrorCatching('p error', 'id is 0');
        if (id.toString() === 'NaN' ) namedErrorCatching('p error', 'id is NaN');
        if (id > Date.now() ) namedErrorCatching('p error', 'id is not valid');
    } catch (error) {
        catchError(res, error);
    }
}

export async function findAssetsVideoControlPanal(req = request, res = response) {
    try {
        res.status(200).json((await Assets.find({ type: 'video' })).map(el => ({ title: el.title, description: el.description, iframe: decodeURIComponent(el.iframe), id: el.id })))
    } catch (error) {
        catchError(res, error);
    }
}






export async function imagesPageImage(req = request, res = response) {
    try {
        let seen=Number(req.query.seen);
        (seen.toString() === 'NaN') && (seen = 0);
        let images = await Assets.find({}, 'url id').where('type').equals('image').sort({ id: -1 }).limit(6).skip(seen);
        if (images.length===0) return res.sendStatus(204);
        return res.status(200).json(images);
    } catch (error) {
        catchError(res, error);
    }
}



export async function videosPageVideos(req = request, res = response) {
    try {
        let seen=Number(req.query.seen);
        (seen.toString() === 'NaN') && (seen = 0);
        let videos = await Assets.find({}, 'iframe title description id').where('type').equals('video').sort({ id: -1 }).limit(6).skip(seen);
        if (videos.length===0) return res.sendStatus(204);
        return res.status(200).json(videos);
    } catch (error) {
        catchError(res, error);
    }
}