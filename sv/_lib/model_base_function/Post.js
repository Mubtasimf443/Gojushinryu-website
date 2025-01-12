/* بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  */
/* Insha Allah,  Allah loves s enough for me */

import formidable from "formidable";
import { log } from "../utils/smallUtils.js";
import { repleCaracter } from "../utils/replaceCr.js";
import { UploadImageToCloudinary } from "../Config/cloudinary.js";
import { Posts } from "../models/Post.js";
import path from "path";
import { BASE_URL } from "../utils/env.js";
import {fileURLToPath} from 'url'
import { checkOrCreateTempDir } from "../utils/dir.js";



//var
const __filename = fileURLToPath(import.meta.url);
let dirname = path.dirname(__filename);

export async function postPageNavigation(req,res) {
    try {
        let posts=await Posts.find({});
        
        for (let i = 0; i < posts.length; i++) {
            const {title,description,thumb,dateAsNumber,date} = posts[i];
            posts.push({
                title :(title.length >100 ? title.substring(0,100) :title),
                description :(description.length >140 ? description.substring(0,140) : description),
                date :new Date(date).toDateString() ,
                link :BASE_URL +'/media/post/'+dateAsNumber,
                thumb,
            });
            posts.shift()
        }
        
        return res.render('post',{posts})
    } catch (error) {
        console.log({error});
        
        return res.render('post')
    }
}


export async function uplaodPostAPiFucntion(req,res) {
    try {
        let DontSuffortMime=false;
        checkOrCreateTempDir()
        let options =  {
            uploadDir :path.resolve(dirname , '../../temp/images') ,
            maxFiles : 11,
            allowEmptyFiles:false,
            maxFileSize:10*1024*1024,
            filter :(file) => {
                if (
                    file.mimetype === 'image/png' 
                    || file.mimetype === 'image/jpg' 
                    || file.mimetype === 'image/jpeg'   
                    || file.mimetype === 'image/webp' )  return true
                    DontSuffortMime =true
                    return false 
                },
            filename : () => Date.now() +'_' + Math.floor(Math.random()*1000) + '.jpg'
        };

        await formidable(options).parse(req,async (formidableError,feilds,files) => {
            if (formidableError) {
                log({formidableError});
                return res.sendStatus(400)
            }
            try {
                if (DontSuffortMime) throw 'Can not suffort mime';
                let {title,description}=feilds;
                if (!title || !description) throw 'title and description  is not defined';
                if (!title.length || !description.length ) throw 'title and description  is not defined';
                let {images,thumb}=files;
                console.log(files);
                
                if (!thumb || !images) throw 'thumb and images is not defined';
                if (!thumb.length || !images.length) throw 'thumb and images is not defined';
                title=await repleCaracter(title[0])
                description=await repleCaracter(description[0])
                let post = {
                    title,
                    description,
                    thumb:'',
                    images:[],
                }
                thumb=await UploadImageToCloudinary(thumb[0].filepath)
                .then(({image,error}) => {
                    if (error) return false
                    return image.url
                })
                if (!thumb) throw 'error ,failed uplaod thumb'
                post.thumb=thumb;
               
                for (let i = 0; i < images.length; i++) {
                    let url = await UploadImageToCloudinary(images[i].filepath)
                    .then(({image,error}) => {
                        if (error) return false
                        return image.url
                    });
                    if (!url) throw 'error failed to upload ' +(i+1)+' image' 
                    post.images.push(url)
                }


                await Posts.create(post);
                return res.sendStatus(201)
            } catch (error) {
                log({error})
                return res.sendStatus(500)
            }
        }) 
    } catch (error) {
        console.log({
            error
        });
        
        return res.sendStatus(500)
    }
}



export async function givePostDetailsFunction(req,res) {
    try {
        let {id} =req.params;
        if (Number(id).toString().toLowerCase()==='nan') throw 'error :- id is not a number';
        id =Number(id);
        let post =await Posts.findOne({
            dateAsNumber:id
        })
        if (!post) throw 'error :- post is null' 
        let {title ,description,date,thumb,images,dateAsNumber}=post;
        return res.render('post-detail',{
            title ,
            description,
            date:new Date(dateAsNumber).toDateString(),
            thumb,
            images,
            dateAsNumber, 
            metaDescription : description.length < 150 ? description :description.substring(0,150)
        })
    } catch (error) {
        console.error({error});
        
    }
}