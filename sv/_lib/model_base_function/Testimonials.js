/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */


import formidable from "formidable";
import { Alert, log } from "../utils/smallUtils.js";
import path from 'path'
import { fileURLToPath } from 'url'
import { repleCaracter } from "../utils/replaceCr.js";
import { UploadImageToCloudinary } from "../Config/cloudinary.js";
import Awaiter, { waidTillFileLoad } from "awaiter.js";
import Testimonials from "../models/testinmonials.js";
import mergesort from '../utils/algorithms.js'
import catchError, { namedErrorCatching } from "../utils/catchError.js";
import { type } from "os";
import { ImageUrl } from "../models/imageUrl.js";
import { existsSync } from "fs";
import { isnota, repleCrAll } from "string-player";


//var
const __filename = fileURLToPath(import.meta.url);
let dirname = path.dirname(__filename);


export async function createTestimonials(req, res) {
  try {
    let DontSuffortMime = false;
    let options = {
      uploadDir: path.resolve(dirname, '../../temp/images'),
      maxFiles: 11,
      allowEmptyFiles: false,
      maxFileSize: 4 * 1024 * 1024,
      filter: (file) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/webp') return true
        DontSuffortMime = true
        return false
      },
      filename: () => Date.now() + '_' + Math.floor(Math.random() * 10000) + '.jpg'
    };

     formidable(options).parse(req, async (error, feilds, files) => {
      try {
        if (DontSuffortMime === true) throw 'error , Donot soffourt this type of files '

        if (error) {
          log({ error });
          return res.status(500).json({ error: 'Unknown error' });
        }

        if (!feilds.appreciator) return res.sendStatus(400);
        if (!feilds.appreciation) return res.sendStatus(400);
        if (!feilds.appreciation_position) return res.sendStatus(400);
        if (!files.images) return res.sendStatus(400);
        if (files.images.length !== 1) return res.sendStatus(400);

        let appreciator = await repleCaracter(feilds.appreciator[0]);
        let appreciation = await repleCaracter(feilds.appreciation[0]);
        let appreciation_position = await repleCaracter(feilds.appreciation_position[0]);
        let imagePath = files.images[0].filepath;

        [appreciator, appreciation, appreciation_position] = repleCrAll([appreciator, appreciation, appreciation_position]);

        let thumb = await UploadImageToCloudinary(imagePath)
          .then(({ image, error }) => {
            if (image) return image.url
            if (error) throw 'cloudianry error'
          });

        await Testimonials.create({
          appreciator,
          appreciation,
          appreciator_image_url: thumb,
          appreciation_position
        });
        res.sendStatus(201);
        return;

      } catch (error) {
        log({ error: 'server error ' })
        console.error(error)
        res.sendStatus(400)
      }
    })
  } catch (error) {
    console.log({ error });
    return res.sendStatus(500)
  }
}


export async function getTestimonials(req, res) {
  try {
    let data = await Testimonials.find({}).sort({ date: -1 });
    return res.status(200).json({ data })
  } catch (error) {
    console.log({ error });
    return res.sendStatus(500)
  }
}


export async function deleteTestimonials(req, res) {
  try {
    let id = req.body.id;
    if (!id) return res.sendStatus(400)
    if (id.toString() === 'NaN') return res.sendStatus(400);
    await Testimonials.findOneAndDelete({ date: id })
      .catch((error) => console.error(error));
    return res.sendStatus(200)
  } catch (error) {
    console.log({ error });
    return res.sendStatus(500)
  }
}

export async function testinmonialsForHomePage(req, res) {
  try {
    let data = await Testimonials.find({}).sort({ date: -1 });
    return res.status(200).json({ data })
  } catch (error) {
    console.log({ error });
    return res.sendStatus(500)
  }
}


export async function createTestimonialsWithoutImage(req, res) {
  try {
    let {
      appreciator,
      appreciation,
      appreciation_position,
    } = req.body,
    appreciator_image_url_id=Number(req.body.appreciator_image_url_id);

    if (!appreciator) namedErrorCatching('perameter_error','appreciator is emty string or undefined');
    if (!appreciator_image_url_id) namedErrorCatching('perameter_error','appreciator_image_url_id is emty string or undefined');
    if (!appreciation_position) namedErrorCatching('perameter_error','appreciation_position is emty string or undefined');
    if (!appreciation) namedErrorCatching('perameter_error','appreciation is 0 or undefined');

    if (typeof appreciator !=='string') namedErrorCatching('perameter_error','appreciator is not a string');
    if (typeof appreciation !=='string') namedErrorCatching('perameter_error','appreciation is not a string');
    if (typeof appreciation_position !=='string') namedErrorCatching('perameter_error','appreciation_position is not a string');
    if (appreciator_image_url_id.toString()==='NaN') namedErrorCatching('perameter_error','appreciator_image_url_id is not a Number');

    if (appreciator.length > 100 || appreciator.length < 4) namedErrorCatching('perameter_error', 'appreciator length is too big or short, minumum length should be 4 and max should be 100');
    if (appreciation.length >  2500 || appreciation.length  <  50) namedErrorCatching('perameter_error', 'appreciation length is too big or short, minumum length should be 100 and max should be 2500');
    if (appreciation_position.length>  100 || appreciation_position.length < 4) namedErrorCatching('perameter_error', 'appreciation_position length is too big or short, minumum length should be 4 and max should be 100');
    if (appreciator_image_url_id.toString().length > 100 || appreciator_image_url_id.toString().length<5) namedErrorCatching('perameter_error', 'appreciator_image_url_id length is too big or short, minumum length should be 5 and max should be 100');

    let imagePath = await ImageUrl.findOne({ id: appreciator_image_url_id }).then(
      function (img) {
        if (!img) namedErrorCatching('perameter_error', `no image exist in the id of ${appreciator_image_url_id}`);
        if (existsSync(img.urlpath) === false) namedErrorCatching('perameter_error', `no image exist in the path  of ${img.urlpath}`);
        return img.urlpath;
      }
    );

    let thumb = await UploadImageToCloudinary(imagePath).then(
      function (data) {
        if (data.error) namedErrorCatching('cloudianry error', data.error);
        if (data.image?.url) return data.image?.url;
        if (!data.image?.url) namedErrorCatching('cloudianry error', 'their is no image urls');
      }
    );

    let testinmonial = await Testimonials.create({
      appreciation: appreciation,
      appreciation_position: appreciation_position,
      appreciator_image_url: thumb,
      appreciator: appreciator
    });

    return res.status(201).json(testinmonial);
    
  } catch (error) {
    console.error(error);
    catchError(res, error);
  }
}