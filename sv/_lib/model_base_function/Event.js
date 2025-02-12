/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  InshaAllah 
*/
import formidable from "formidable";
import { Events } from "../models/Event.js";
import { Alert, log } from "../utils/smallUtils.js";
import path from 'path'
import { fileURLToPath } from 'url'
import { repleCaracter } from "../utils/replaceCr.js";
import { UploadImageToCloudinary } from "../Config/cloudinary.js";
import { GM } from "../models/GM.js";
import { checkOrCreateTempDir } from "../utils/dir.js";
import Awaiter, { waidTillFileLoad } from "awaiter.js";
import mergesort from "../utils/algorithms.js";


//var
const __filename = fileURLToPath(import.meta.url);
let dirname = path.dirname(__filename);

export async function UploadEventApi(req, res) {
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
       
        //condition check 
        if (!files.thumb) throw 'thumb is not define ';
        if (!files.images) throw 'thumb is not define ';
        if (!files.images.length === 0) throw 'thumb is not define '
        if (!feilds.title) throw 'title is is not define '
        if (!feilds.description) throw 'description is is not define '
        if (!feilds.author) throw 'author is is not define '
        if (!feilds.gm_id) throw 'author is is not define '
        if (!feilds.eventDate) throw 'event date is is not define '
        if (!feilds.organizerCountry) throw 'organizerCountry is is not define '
       

        let title = await repleCaracter(feilds.title[0]);
        let description = await repleCaracter(feilds.description[0]);
        let author = await repleCaracter(feilds.author[0]);
        let gm_id = await repleCaracter(feilds.gm_id[0])
        let eventDate = feilds.eventDate[0];
        let organizerCountry = await repleCaracter(feilds.organizerCountry[0]);
      

        eventDate = Number(eventDate);
       

        if (eventDate.toString() === 'NaN') return Alert('event date is not correct', res)
       
        log(`//condition check pass`)
        let gm = await GM.findOne({ _id: gm_id })
        if (!gm) throw 'Their is no gm ';

        let thumb = await UploadImageToCloudinary(path.resolve(files.thumb[0].filepath)).then(({ image, error }) => {
          if (image) return image.url
          if (error) throw 'cloudianry error'
        });
        let images = [];


        for (let i = 0; i < files.images.length; i++) {
          const image = await UploadImageToCloudinary(path.resolve(dirname, '../../temp/images/' + files.images[0].newFilename))
            .then(({ image, error }) => {
              if (image) return image.url
              if (error) throw 'cloudianry error'
            });
          images.push({ image })
        }
        
        await Events.create({
          title,
          description,
          author,
          thumb,
          images,
          gm_writer: gm._id,
          eventDate,
          organizerCountry,
        })

        return res.sendStatus(201);
      } catch (error) {
        log({ error })
        res.sendStatus(400)
      }
    })
  } catch (e) {
    log({ error: 'server error ' + e })
    res.sendStatus(400)
  }

}




export async function getGmEvents(req, res) {
  try {
    let { gm_id } = req.body;
    if (!gm_id) throw 'error gm-id is not correct'
    gm_id = await repleCaracter(gm_id)
    let events = await Events.find({ gm_writer: gm_id }).sort({ Date: -1 });
    return res.status(200).json({ events });
  } catch (error) {
    log({ error })
    return res.sendStatus(400)
  }
}




export async function deleteEvent(req, res) {
  try {
    let { date } = req.body;
    console.log(req.body);
    if (!date) throw 'date is not defined';
    if (typeof date !== 'number') throw 'date is not a number';
    if (date.toString().toLowerCase() === 'nan') throw 'date is  a NaN';
    let event = await Events.findOneAndDelete({ Date: date });
    if (event) return res.sendStatus(200)
  } catch (error) {
    console.error({ error });
    return res.sendStatus(200)
  }


}




export async function eventPageNavigation(req, res) {
  try {
    let events = await Events.find({}).sort({Date :-1});
    for (let i = 0; i < events.length; i++) {
      let { title, thumb, eventDate, organizerCountry, description } = events[0];
      events.push({
        title: title.length > 120 ? title.substring(0, 120) : title,
        thumb: thumb,
        organizerCountry,
        date: new Date(eventDate).getDate(),
        month: new Date(eventDate).toLocaleString('en-us', {month :'long'}),
        description: description.length === 103 ? description : description.substring(0, 103)
      });
      events.shift();
    }
    return res.render('events', { events: events })
  } catch (error) {
    log({ error })
    return res.render('events')
  }
}

export async function adminEventUplaodAPI(req, res) {
  try {
    let DontSuffortMime = false;
    let options = {
      uploadDir: path.resolve(dirname, '../../temp/images'),
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
        //condition check 
        if (!files.thumb) throw 'thumb is not define ';
        if (!files.images) throw 'thumb is not define ';
        if (!files.images.length) throw 'thumb is not define ';
        if (!feilds.title) throw 'title is is not define ';
        if (!feilds.description) throw 'description is is not define ';
        if (!feilds.eventDate) throw 'event date is is not define ';
        if (!feilds.organizerCountry) throw 'organizerCountry is is not define ';
        let title = await repleCaracter(feilds.title[0]);
        let description = await repleCaracter(feilds.description[0]);
        let eventDate = feilds.eventDate[0];
        let organizerCountry = await repleCaracter(feilds.organizerCountry[0]);
        eventDate = Number(eventDate);
        if (eventDate.toString() === 'NaN') return Alert('event date is not correct', res);
        let thumb = await UploadImageToCloudinary(files.thumb[0].filepath).then(({ image, error }) => {
          if (image) return image.url;
          if (error) throw new Error('cloudianry error');
        })

        let images = [];

        for (let i = 0; i < files.images.length; i++) {
          const image = await UploadImageToCloudinary(files.images[i].filepath)
            .then(({ image, error }) => {
              if (image) return image.url
              if (error) throw new Error('cloudianry error');
            });
          images.push({ image })
        }

        await Events.create({
          title,
          description,
          author: "SENSEI VARUN JETTLY",
          thumb,
          images,
          eventDate,
          admin_writen: true,
          organizerCountry
        })

        return res.sendStatus(201);
      } catch (error) {
        log({ error })
        res.sendStatus(400)
      }
    })
  } catch (e) {
    log({ error: 'server error ' + e })
    res.sendStatus(400)
  }
}



export async function eventsHome(req, res) {
  try {
    return res.status(200).json({ data: (await Events.find({},'title description eventDate thumb organizerCountry').sort({ Date: -1 }).limit(2)) });
  } catch (error) {
    console.error(error)
    return res.sendStatus(500)
  }
}