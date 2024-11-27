/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ ﷺ 
Insha Allah,  Allah is enough for me
*/

import formidable from "formidable";
import { Alert, log } from "../utils/smallUtils.js";
import path from 'path'
import {fileURLToPath} from 'url'
import { repleCaracter } from "../utils/replaceCr.js";
import { UploadImageToCloudinary } from "../Config/cloudinary.js";
import Awaiter, { waidTillFileLoad } from "awaiter.js";
import mergesort from "../utils/algorithms.js";
import CountryRepresentatives from "../models/countryRepresentative.js";

//var
const __filename = fileURLToPath(import.meta.url);
let dirname = path.dirname(__filename);


export async function uploadCountryRepresentativeApi(req,res) {
    try {
        let DontSuffortMime = false;
        let options = {
            uploadDir:
                path.resolve(dirname, '../../temp/images'),
            maxFiles: 11,
            allowEmptyFiles: false,
            maxFileSize: 4 * 1024 * 1024,
            filter: (file) => {
                if (
                    file.mimetype === 'image/png'
                    || file.mimetype === 'image/jpg'
                    || file.mimetype === 'image/jpeg'
                    || file.mimetype === 'image/webp') return true
                DontSuffortMime = true
                return false
            },
            filename: () => Date.now() + '_' + Math.floor(Math.random() * 10000) + '.jpg'
        }
        await formidable(options).parse(req, async (error, feilds, files) => {
            try {
                if (DontSuffortMime === true) throw 'error , Donot soffourt this type of files '
                if (error) {
                    log({ error });
                    return res.status(500).json({ error: 'Unknown error' });
                }
                // log(files)
                // log(feilds);
        
                if (!files.image) throw 'thumb is not define ';
                if (!files.image.length === 0) throw 'thumb is not define '
                if (!feilds.name) throw 'title is is not define '
                if (!feilds.email) throw 'title is is not define '
                if (!feilds.description) throw 'description is is not define '
                if (!feilds.country) throw 'author is is not define '
                if (!feilds.phone) throw 'author is is not define '
                if (!feilds.dob) throw 'event date is is not define '
                let name = await repleCaracter(feilds.name[0]);
                let phone = await repleCaracter(feilds.phone[0]);
                let email = await repleCaracter(feilds.email[0]);
                let country = await repleCaracter(feilds.country[0]);
                let dob = await repleCaracter(feilds.dob[0]);
                let description = await repleCaracter(feilds.description[0]);
                
                //awaiting for 3 seconds
                let awaiter=await Awaiter(3000)


                


                
                let imageUrl = await UploadImageToCloudinary(path.resolve(dirname, '../../temp/images/' + files.image[0].newFilename))
                    .then(({ image, error }) => {
                        if (image) return image.url
                        if (error) throw 'cloudianry error'
                    });
                    

                let countryRepresentative = new CountryRepresentatives({
                    name: name,
                    email: email,
                    dateOfBirth: dob,
                    country: country,
                    phone: phone,
                    decription: description,
                    thumbUrl: imageUrl
                });

                await countryRepresentative.save()
                

                return res.sendStatus(201);
            } catch (error) {
                log({ error })
                res.sendStatus(400)
            }
        })

    } catch (error) {
        console.error(error)
    }
}
