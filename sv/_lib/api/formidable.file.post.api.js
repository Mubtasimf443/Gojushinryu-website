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

export function UploadPDFFile(req=request) {
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
        if (DontSuffortMime===true) return reject({DontSuffortMime :true});
        let from=formidable(options).parse(req, function(err, feilds,files) {
            if (err) {
                return reject(err)
            }
            if (!files.pdf) throw 'Pdf file is available';
            if (!files.pdf.length ===0) throw 'Pdf file is available';
            return resolve([files.pdf[0].filepath, feilds]);
        })
    })
}