/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  InshaAllah 
*/
import formidable from "formidable";
import { Events } from "../models/Event.js";
import { Alert, log } from "../utils/smallUtils.js";
import path from 'path'
import {fileURLToPath} from 'url'
import { repleCaracter } from "../utils/replaceCr.js";
import { UploadImageToCloudinary } from "../Config/cloudinary.js";
import { GM } from "../models/GM.js";


//var
const __filename = fileURLToPath(import.meta.url);
let dirname = path.dirname(__filename);

export async function UploadEventApi(req, res) {
    try {
      log('uploading')
      let DontSuffortMime = false;
      let options =  {
        uploadDir :
            path.resolve(dirname , '../../temp/images') ,
        maxFiles : 11,
        allowEmptyFiles:false,
        maxFileSize:4*1024*1024,
        filter :(file) => {
        if (
        file.mimetype === 'image/png' 
        || file.mimetype === 'image/jpg' 
        || file.mimetype === 'image/jpeg'   
        || file.mimetype === 'image/webp' )  return true
        DontSuffortMime =true
        return false 
        },
        filename : () => Date.now() +'_' + Math.floor(Math.random()*10000) + '.jpg'
      }
      formidable(options).parse(req, async (error,feilds , files) => {
        try {
          if (DontSuffortMime ===true) throw 'error , Donot soffourt this type of files '
          if (error) { 
            log({error});
            return res.status(500).json({error :'Unknown error'});
          }
          // log(files)
          // log(feilds);


          //condition check 
          if (!files.thumb) throw 'thumb is not define ';
          if (!files.images) throw 'thumb is not define ';
          if (!files.images.length) throw 'thumb is not define '
          if (!feilds.title) throw 'title is is not define '
          if (!feilds.description) throw 'description is is not define '
          if (!feilds.author) throw 'author is is not define '
          if (!feilds.gm_id) throw 'author is is not define '
          if (!feilds.eventDate) throw 'event date is is not define '
          let title =await repleCaracter(feilds.title[0]);
          let description =await repleCaracter(feilds.description[0]);
          let author =await repleCaracter(feilds.author[0]);
          let gm_id =await repleCaracter(feilds.gm_id[0])
          let eventDate =feilds.eventDate[0];
          eventDate =Number(eventDate);
          if (eventDate.toString() ==='NaN') return Alert('event date is not correct',res)

          log(`//condition check pass`)
          let gm =await GM.findOne({_id :gm_id})
          if (!gm) throw 'Their is no gm ';
          let thumb =await UploadImageToCloudinary(files.thumb[0].filepath).then(({image,error})=> {
            if (image) return image.url
            if (error) throw 'cloudianry error'
          })
          let images=[];


          for (let i = 0; i < files.images.length; i++) {
            const image = await UploadImageToCloudinary(files.images[i].filepath)
            .then(({image,error})=> {
              if (image) return image.url
              if (error) throw 'cloudianry error'
            });
            images.push({image})
          }

          log('//image uplaoded')

          let event=await Events.create({
            title, 
            description ,
            author, 
            thumb,
            images ,
            gm_writer :gm._id,
            eventDate,
          })

          return res.sendStatus(201);
        } catch (error) {
          log({error})
          res.sendStatus(400)
        }
      })
  } catch (e ) {
    log({error :'server error '+ e})
    res.sendStatus(400)
  }

}
  



export async function getGmEvents(req,res) {
  try {
    let {gm_id}  =req.body;
    if (!gm_id) throw 'error gm-id is not correct'
    gm_id =await repleCaracter(gm_id)
    let events=await Events.find({gm_writer :gm_id});
    return res.status(200).json({events});
  } catch (error) {
    log({error})
    return res.sendStatus(400)
  }
}




export async function deleteEvent(req,res) {
  try {
    let {date}=req.body;
    console.log(req.body);
    
    if (!date) throw 'date is not defined';
    if (typeof date !== 'number') throw 'date is not a number';
    if (date.toString().toLowerCase() === 'nan') throw 'date is  a NaN';
    let event =await Events.findOneAndDelete({Date:date});
    if (event) return res.sendStatus(200)
  } catch (error) {
    console.error({error});
    return res.sendStatus(200)
  }


}




export async function eventPageNavigation(req,res) {
  try {
    let events = await Events.find({});
    // console.log(events);
    
    for (let i = 0; i < events.length; i++) {
      let {title,description,thumb,eventDate,gm_writer} = events[0];
      events.push({
        title : title.length >120 ?title.substring(0,120) :title,
        description : description.length >220 ?description.substring(0,220) :description,
        thumb:thumb,
        day :new Date(eventDate).getDate(),
        month :(e => {
          let m=new Date(eventDate).getMonth();
          if (m === 0) return 'Jan'
          if (m === 1) return 'Feb'
          if (m === 2) return 'Mar'
          if (m === 3) return 'Apr'
          if (m === 4) return 'May'
          if (m === 5) return 'June'
          if (m === 6) return 'July'
          if (m === 7 ) return 'Aug'
          if (m === 8) return 'Sep'
          if (m === 9) return 'Oct'
          if (m === 10) return 'Nov'
          if (m === 11) return 'Dec'
        })(),
        year:new Date(eventDate).getFullYear()
      });

      events.shift();
    }
  
     log({events})
    return res.render('events',{events:events})
  } catch (error) {
    log({error})
    return res.render('events')
  }
}