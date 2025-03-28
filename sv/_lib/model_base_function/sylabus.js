/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import { request, response, Router } from "express";
import catchError, { namedErrorCatching } from "../utils/catchError.js";
import { SyllabusAsset } from "../models/studentSylabus.js";
import { isnota, repleCaracter, repleCrAll, tobe } from "string-player";
import { UploadImgFile, UploadPDFFile } from "../api/formidable.file.post.api.js";
import { Cloudinary } from "../Config/cloudinary.js";

let router=Router();
router.get('/sylabus/assets/text',findText );
router.post('/sylabus/assets/text',postText );
router.put('/sylabus/assets/text',putText );
router.delete('/sylabus/assets/text', deleteText);
router.get('/sylabus/assets/video',findVideoAsset );
router.post('/sylabus/assets/video',postVideoAsset );
router.put('/sylabus/assets/video',putVideoAsset );
router.delete('/sylabus/assets/video', deleteVideoAsset);
router.get('/sylabus/assets/pdf', findPdf);
router.post('/sylabus/assets/pdf', postPdf);
router.put('/sylabus/assets/pdf', putPdf);
router.delete('/sylabus/assets/pdf', deletePDF);
router.get('/sylabus/assets/image', findImages);
router.post('/sylabus/assets/image', postImages);
router.delete('/sylabus/assets/image', deleteImages);


async function findText(req=request, res=response) {
    try {
        let notes = await SyllabusAsset.find({}, 'id title content').where('assetType').equals( 'text');
        notes = notes.map((Element) => ({ title: decodeURI(Element.title), content: decodeURI(Element.content), id: Element.id }))
        return res.status(200).json(notes);
    } catch (error) {
        catchError(res,error)
    }
}

async function postText(req=request, res=response) {
    try {
        let title =req.query.title , content =req.query.content;
        if (!title || !content) namedErrorCatching('p error', 'missing title or content');
        [title , content] =[title.trim(), content.trim()];
        if (!tobe.minMax(title, 1, 200, true)) namedErrorCatching('p error', 'title is too big or too short');
        if (!tobe.minMax(content, 50, 20000, true)) namedErrorCatching('p error', 'content is too big or too short');
        [title, content] = [encodeURI(title), encodeURI(content)];
        let notes = await SyllabusAsset.insertMany([{ title, content, assetType: 'text' }]);
        notes[0].content=decodeURI(notes[0].content);
        return res.status(201).json(notes[0]);
    } catch (error) {
        catchError(res,error)
    }
}


async function putText(req=request, res=response) {
    try {
        let title = req.query.title, content = req.query.content, id = req.query.id;
        id = Number(id);
        if (id === 0 || id.toString() === 'NaN') throw 'id is not a NaN';
        if (!title || !content) namedErrorCatching('p error', 'missing title or content');
        [title , content] =[title.trim(), content.trim()];
        if (!tobe.minMax(title, 1, 200, true)) namedErrorCatching('p error', 'title is too big or too short');
        if (!tobe.minMax(content, 50, 20000, true)) namedErrorCatching('p error', 'content is too big or too short');
        [title, content] = [encodeURI(title), encodeURI(content)];
        await SyllabusAsset.updateOne({ id }, { title, content });
        return res.sendStatus(202);
    } catch (error) {
        catchError(res,error)
    }
}

async function deleteText(req=request, res=response) {
    try {
        let id = req.query.id;
        id = Number(id);
        if (id === 0 || id.toString() === 'NaN') throw 'id is not a NaN';
        if (Date.now() < id) namedErrorCatching('p error', 'id is not correct');
        await SyllabusAsset.deleteOne({id});
        return res.sendStatus(204);
    } catch (error) {
        catchError(res,error);
    }
}

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
        let [pdfPath,feilds,filename] = await UploadPDFFile(req);
        
        let { title } =feilds;
        if (!title || isnota.array(title)) throw 'Missing Title of The Pdf';
        title =title[0]?.trim();
        if (!title)throw 'Missing Title of The Pdf';
        if (title.length >200)throw 'Missing Title of The Pdf';
        let backupAssetLink = (await Cloudinary.uploader.upload(pdfPath, { folder: 'pdfs' , use_filename: true, format: 'pdf', })).url;
        let pdfAsset=await SyllabusAsset.create({
            assetType :'pdf',
            content :'/api/file/temp-pdf/'+ filename,
            title :title ,
            backupAssetLink
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
async function findImages(req = request, res = response) {
    try {
        let images = (await SyllabusAsset.find({}).where('assetType').equals('image'));
        return res.status(200).json(images);
    } catch (error) {
        catchError(res,error);
    }
}
async function postImages(req = request, res = response) {
    try {
        let [imagePath, feilds] = await UploadImgFile(req);
        let title = feilds.title;
        if (Array.isArray(title) ===false || title[0].trim().length===0) namedErrorCatching('p error', 'title is invalid');
        let info = await Cloudinary.uploader.upload(imagePath, { public_id: Date.now().toString(), resource_type: 'image', format: 'jpg' });
        if (info.url ) {
            let pdfAsset=await SyllabusAsset.create({
                assetType :'image',
                content :info.url ,
                title :title[0].trim() ,
            });
            return res.status(201).json(pdfAsset);
        } else throw 'CLoudinary Error , There is no url of cloudinary';
    } catch (error) {
        catchError(res,error);
    }
}
async function deleteImages(req = request, res = response) {
    try {
        let id = req.query.id;
        if (!id) throw 'id is missing';
        id = Number(id);
        if (id === 0 || id.toString() === 'NaN') throw 'id is not a Number';
        await SyllabusAsset.findOneAndDelete()
            .where('id').equals(id)
            .where('assetType').equals('image');

        return res.sendStatus(204);
    } catch (error) {
        catchError(res, error);
    }
}
export default router;
