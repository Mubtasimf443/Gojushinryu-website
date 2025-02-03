/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { request } from "express";
import formidable from "formidable";
import path from "path";
import { fileURLToPath } from 'url'
//var
const __filename = fileURLToPath(import.meta.url);
let dirname = path.dirname(__filename);

export function UploadPDFFile(req = request) {
    return new Promise(function (resolve, reject) {
        let DontSuffortMime = false;
        let options = {
            uploadDir: path.resolve(dirname, '../../temp/pdfs'),
            maxFiles: 1,
            allowEmptyFiles: false,
            maxFileSize: 10 * 1024 * 1024,
            filter(file) {
                if (file.mimetype === 'application/pdf') return true
                DontSuffortMime = true
                return false
            },
            filename: () => Date.now() + '_' + Math.floor(Math.random() * 11) + '.pdf'
        };
        if (DontSuffortMime === true) return reject({ DontSuffortMime: true });
        formidable(options).parse(req, function (err, feilds, files) {
            if (err) {
                return reject(err)
            }
            if (!files.pdf) throw 'Pdf file is available';
            if (!files.pdf.length === 0) throw 'Pdf file is available';
            return resolve([files.pdf[0].filepath, feilds]);
        })
    })
}

export function UploadImgFile(req = request) {
    return new Promise(function (resolve, reject) {
        let DontSuffortMime = false;
        let options = {
            uploadDir: path.resolve(dirname, '../../temp/images'),
            maxFiles: 1,
            allowEmptyFiles: false,
            maxFileSize: 5 * 1024 * 1024,
            filter(file) {
                if (
                    file.mimetype === 'image/png'
                    || file.mimetype === 'image/jpeg'
                    || file.mimetype === 'image/jpg'
                    || file.mimetype === 'image/webp') return true
                DontSuffortMime = true
                return false
            },
            filename: () => Date.now() + '_' + Math.floor(Math.random() * 11) + '.jpg'
        };
        if (DontSuffortMime === true) return reject({ DontSuffortMime: true });
        formidable(options).parse(req, function (err, feilds, files) {
            if (err) {
                return reject(err)
            }
            if (!files.img) throw 'Image not is available';
            if (!files.img.length === 0) throw 'Image not is available';
            return resolve([files.img[0].filepath, feilds]);
        })
    })
}
