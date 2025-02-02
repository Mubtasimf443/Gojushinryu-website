/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import { request, response, Router } from "express";
import catchError from "../utils/catchError.js";
import { SyllabusAsset } from "../models/studentSylabus.js";
import { isnota, repleCaracter, tobe } from "string-player";
import { UploadPDFFile } from "../api/formidable.file.post.api.js";
import { Cloudinary } from "../Config/cloudinary.js";

let router=Router();

router.get('/sylabus/assets/video',findVideoAsset );
router.post('/sylabus/assets/video',postVideoAsset );
router.put('/sylabus/assets/video',putVideoAsset );
router.delete('/sylabus/assets/video', deleteVideoAsset);
router.get('/sylabus/assets/pdf', findPdf);
router.post('/sylabus/assets/pdf', postPdf);
router.put('/sylabus/assets/pdf', putPdf);
router.delete('/sylabus/assets/pdf', deletePDF);


async function findVideoAsset(req=request, res=response) {
    try {
        let videos = (await SyllabusAsset.find({}, 'title content id').where('assetType').equals('video')).map(el => ({ id: el.id, code: decodeURIComponent(el.content), title: el.title }));
        return res.status(200).json(videos);
    } catch (error) {
       catchError(res,error)
    }
}
async function postVideoAsset(req=request, res=response) {
    try {
        let {title , code }=req.body;
        if (!title || !code) throw 'title, code is missing';
        if (!title.trim()) throw 'title is missing';
        if (!code.trim()) throw 'code is missing';
        if (!tobe.max(title , 100, true)) throw 'title is too big';
        if (!tobe.max(code , 10000, true)) throw 'code is too big';
        title = repleCaracter(title);
        code = encodeURIComponent(code);
        let videoAsset=await SyllabusAsset.create({
            assetType :'video',
            content :code ,
            title :title ,
        });
        return res.status(200).json({ id: videoAsset.id, title: videoAsset.title, code: decodeURIComponent(videoAsset.content) });
    } catch (error) {
        catchError(res,error)
    }
}
async function putVideoAsset(req = request, res = response) {
    try {
        let { id, code } = req.body;
        if (!id || !code) throw 'id, code is missing';
        id = Number(id);
        if (id === 0 || id.toString() === 'NaN') throw 'id is not  a NaN';
        if (!code.trim()) throw 'code is missing';
        if (!tobe.max(code, 10000, true)) throw 'code is too big';
        let videoAsset = await SyllabusAsset.findOne({})
            .where('id').equals(id)
            .where('assetType').equals('video');
        
        if (videoAsset===null ) throw 'asset not found';
        videoAsset.content=encodeURIComponent(code);
        await videoAsset.save();
        return res.status(200).json({});
    } catch (error) {
        catchError(res, error)
    }
}
async function deleteVideoAsset(req = request, res = response) {
    try {
        let  id = req.query.id;
        if (!id) throw 'id is missing';
        id = Number(id);
        if (id === 0 || id.toString() === 'NaN') throw 'id is not a Number';
        await SyllabusAsset.findOneAndDelete()
            .where('id').equals(id)
            .where('assetType').equals('video');
        return res.sendStatus(204);
    } catch (error) {
        catchError(res,error);
    }
}
async function findPdf(req = request, res = response) {
    try {
        let pdfs = (await SyllabusAsset.find({}).where('assetType').equals('pdf'));
        return res.status(200).json(pdfs);
    } catch (error) {
        catchError(res,error)
    }
}


async function postPdf(req = request, res = response) {
    try {
        let [pdfPath,feilds] = await UploadPDFFile(req);
        
        let { title } =feilds;
        if (!title || isnota.array(title)) throw 'Missing Title of The Pdf';
        title =title[0]?.trim();
        if (!title)throw 'Missing Title of The Pdf';
        if (title.length >200)throw 'Missing Title of The Pdf';
        let info = await Cloudinary.uploader.upload(pdfPath, { public_id: Date.now().toString()});
        let pdfAsset=await SyllabusAsset.create({
            assetType :'pdf',
            content :info.url ,
            title :title ,
        });
        return res.status(200).json(pdfAsset);
    } catch (error) {
        catchError(res,error)
    }
}

async function putPdf(req = request, res = response) {
    try {
        
    } catch (error) {
        catchError(res,error)
    }
}

async function deletePDF(req = request, res = response) {
    try {
        let  id = req.query.id;
        if (!id) throw 'id is missing';
        id = Number(id);
        if (id === 0 || id.toString() === 'NaN') throw 'id is not a Number';
        await SyllabusAsset.findOneAndDelete()
            .where('id').equals(id)
            .where('assetType').equals('pdf');
        return res.sendStatus(204);
    } catch (error) {
        catchError(res,error)
    }
}



export default router;
