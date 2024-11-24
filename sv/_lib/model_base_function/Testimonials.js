/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */


import formidable from "formidable";
import { Alert, log } from "../utils/smallUtils.js";
import path from 'path'
import {fileURLToPath} from 'url'
import { repleCaracter } from "../utils/replaceCr.js";
import { UploadImageToCloudinary } from "../Config/cloudinary.js";
import Awaiter, { waidTillFileLoad } from "awaiter.js";
import Testimonials from "../models/testinmonials.js";



//var
const __filename = fileURLToPath(import.meta.url);
let dirname = path.dirname(__filename);


export async function createTestimonials(req,res) {
    try {        
      let DontSuffortMime = false;
      let options =  {
        uploadDir : path.resolve(dirname , '../../temp/images') ,
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
        };

        await formidable(options).parse(req, async (error,feilds , files) => {
            try {
              if (DontSuffortMime ===true) throw 'error , Donot soffourt this type of files '

              if (error) { 
                log({error});
                return res.status(500).json({error :'Unknown error'});
              }

              if (!feilds.appreciator) return res.sendStatus(400);
              if (!feilds.appreciation) return res.sendStatus(400);
              if (!feilds.appreciation_position) return res.sendStatus(400);
              if (!files.images) return res.sendStatus(400);
              if (files.images.length!==1 ) return res.sendStatus(400);

              let appreciator =await repleCaracter(feilds.appreciator[0]);
              let appreciation =await repleCaracter(feilds.appreciation[0]);
              let appreciation_position =await repleCaracter(feilds.appreciation_position[0]);
              let imagePath = files.images[0].filepath;

             
              console.log('waiting time starts from'+ new Date().toLocaleTimeString());
          
              // await Awaiter()
              // console.log('waiting time ends from'+ new Date().toLocaleTimeString());
            
            
              let thumb =await UploadImageToCloudinary(imagePath)
              .then(({image,error})=> {
                if (image) return image.url
                if (error) throw 'cloudianry error'
               });

               await Testimonials.create({
                appreciator,
                appreciation,
                appreciator_image_url:thumb,
                appreciation_position
               });
               res.sendStatus(201);
               return;
              
            } catch (error) {
                log({error :'server error ' })
                console.error(error)
                res.sendStatus(400)
            }
        })
    } catch (error) {
        console.log({error});
        return res.sendStatus(500)        
    }
}


export async function getTestimonials(req,res) {
  try {
    let data=await Testimonials.find({});
    return res.status(200).json({
      data 
    })
  } catch (error) {
    console.log({error});
    return res.sendStatus(500)     
  } 
}


export async function deleteTestimonials(req,res) {
  try {
    let id=req.body.id;
    if (!id) return res.sendStatus(400)
    if (id.toString() === 'NaN') return res.sendStatus(400);
    await Testimonials.findOneAndDelete({date :id})
    .catch( (error) => console.error(error) );
    return res.sendStatus(200)
  } catch (error) {
    console.log({error});
    return res.sendStatus(500)  
  }
}

export async function testinmonialsFoeHomePage(params) {
  try {
    let data=await Testimonials.find({});
    if (data.length===0) return res.sendStatus(400);
    if (data.length===1 || data.length===2) {
      return res.status(200).json({
        data
      })
    }
    let dates =data.map(el => el.date);
    dates=mergesort(dates);
    let responsneArray=[];
    for (let i = dates.length-1; i > dates.length-3; i--) {
      const element = dates[i];
      let obj=data.find(el => el.date === element);
      responsneArray.push(obj)
    }
    return res.status(200).json({
      data:responsneArray
    })
  } catch (error) {
    console.log({error});
    return res.sendStatus(500)  
  }
}