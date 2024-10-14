/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  InshaAllah 
*/
import formidable from "formidable";
import { Events } from "../models/Event.js";
import { log } from "../utils/smallUtils.js";
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
          let title =await repleCaracter(feilds.title[0]);
          let description =await repleCaracter(feilds.description[0]);
          let author =await repleCaracter(feilds.author[0]);
          let gm_id =await reportError(feilds.gm_id[0])
          log(`//condition check pass`)


          let gm =await GM.findOne({_id :gm_id})
          if (!gm) throw 'Their is no gm ';


          let thumb =await UploadImageToCoudinary(files.thumb[0].filepath).then(({image,error})=> {
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
            gm_writer :gm._id
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
  