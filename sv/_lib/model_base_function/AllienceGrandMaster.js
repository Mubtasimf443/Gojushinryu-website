/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ 
Insha Allah,  Allah is enough for me
*/

import { request, Router } from "express";
import {AllienceGrandMaster} from "../models/AllienceGrandMaster.js";
import { response } from "express";
import catchError from "../utils/catchError.js";
import { Cloudinary } from "../Config/cloudinary.js";
import { UploadImgFile } from "../api/formidable.file.post.api.js";

const router = Router();
router.route('/').get(findGrandMaster).post(postGrandMaster);
router.route('/:id').post(uploadAllienceGrandMasterRelatedImage).put(putGrandMaster).delete(deleteGrandMaster);

async function findGrandMaster(req=request, res=response) {
    try {
        res.statusCode=200;
        res.json((await AllienceGrandMaster.find({})))
        return;
    } catch (error) {
        catchError(res, error)
    }
}

async function deleteGrandMaster(req = request, res = response) {
    try {
        const deletedMaster = await AllienceGrandMaster.findByIdAndDelete(req.params.id);
        if (!deletedMaster) {
            return res.status(404).json({ message: "Grand Master not found" });
        }
        res.status(200).json({ message: "Grand Master deleted successfully" });
        return;
    } catch (error) {
        catchError(res, error);
    }
}

async function postGrandMaster(req = request, res = response) {
    try {
        let { name, image , organizationLogo , OrganizationLink , title , info } = req.body;
        for (let i = 0; i < 6; i++) {
            const element = [name, image, organizationLogo, OrganizationLink, title, info][i];
            const elementNames = ["name", "image", "organizationLogo","OrganizationLink", "title", "info"];
            if (!element?.trim()) {
                return res.status(400).json({ message: elementNames[i] + ' is emty' });
            }
            if (i === 1 || i === 2 || i === 3) {
                if (!isValidUrl(element)){
                    res.status(400).json({ message: elementNames[i] + ' is not a Image' });
                    return;
                }
            }
        }
        let _id= (await AllienceGrandMaster.create({
            name: name,
            image: image,
            organizationLogo: organizationLogo,
            OrganizationLink: OrganizationLink,
            title: title,
            info: info,
            infoHtml: info.replaceAll('\n', '<br>')
        }))._id;
        return res.status(201).send(_id)
    } catch (error) {
        catchError(res, error)
    }
}


async function putGrandMaster(req = request, res = response) {
    try {
        let { name, image , organizationLogo , OrganizationLink , title , info } = req.body;
        for (let i = 0; i < 6; i++) {
            const element = [name, image, organizationLogo, OrganizationLink, title, info][i];
            const elementNames = ["name", "image", "organizationLogo","OrganizationLink", "title", "info"];
            if (!element?.trim()) {
                return res.status(400).json({ message: elementNames[i] + ' is emty' });
            }
            if (i === 1 || i === 2 || i === 3) {
                if (!isValidUrl(element)){
                    res.status(400).json({ message: elementNames[i] + ' is not a Image' });
                    return;
                }
            }
        }
        await AllienceGrandMaster.findByIdAndUpdate( req.params.id,{
            name: name,
            image: image,
            organizationLogo: organizationLogo,
            OrganizationLink: OrganizationLink,
            title: title,
            info: info,
            infoHtml: info.replaceAll('\n', '<br>')
        });
        return res.sendStatus(201)
    } catch (error) {
        catchError(res, error)
    }
}


function isValidUrl(string = '') {
    if (!string.includes('http://') && !string.includes('https://')) return false;
    if (string.at(0) !== 'h' && string.at(1) !== 't' && string.at(2) !== 't' && string.at(3) !== 'p') return false;
    if (string.at(4) !== 's' && string.at(4) !== ':') return false;
    if (string.at(4) === 's') {
        if (string.substring(5, 8) !== '://') return false;
        if (!string.substring(8).includes('.')) return false;
    }
    if (string.at(4) === ':') {
        if (string.substring(5, 7) !== '//') return false;
    }
    return true;
}


async function uploadAllienceGrandMasterRelatedImage(req = request, res = response) {
    try {
        if (req.params.id === 'image') {
            let [path] = await UploadImgFile(req);
            let url = (await Cloudinary.uploader.upload(path, { public_id: Date.now(), folder: 'allience_grand_master_related_image' })).url;
            return res.status(200).send(url);
        } else {
            return res.status(404).json({ message: 'Api Not Found' })
        }
    } catch (error) {
        catchError(res, error)
    }
}
export async function allienceGrandMasterInfo(req, res) {
    try {
        if (isNaN(req.params.id)) return res.status(404).send('Page Not Found');
        let master = await AllienceGrandMaster.findOne({}).where('createdAt').equals(Number(req.params.id));
        if (!!master) {
            res.status(200).render('grand-master-info', {
                name :master.name ,
                title : master.title,
                metaDescription: master.info.length <= 120 ? master.info : master.info.slice(0, 120),
                image : master.image,
                organizationLogo : master.organizationLogo,
                OrganizationLink :master.OrganizationLink,
                info :master.infoHtml
            });
            return ;
        } else {
            return res.status(404).send('Page Not Found');
        }
    } catch (error) {
        console.error(error);
        try { res.render('500') } catch (error) { console.error(error); }
    }
}
export { router as AllienceGrandMasterRouter };
