/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import { UploadImageToCloudinaryFromImageUrl } from "../Config/cloudinary.js";
import Course from "../models/Course.js";
import { ImageUrl } from "../models/imageUrl.js";
import { repleCaracter } from "../utils/replaceCr.js";
import { Alert, log, Success } from "../utils/smallUtils.js";
import { makeTimeString, mekeLinkString } from "../utils/string.manipolation.js";



export async function FindCourseApi(req, res) {
  try {
    let CourseArray = await Course.find({});
    res.render('course',{
      courses:CourseArray
    });
  } catch (e) {
    res.status(500).render('massage_server', {
      title: 'Failed, Try Again',
      body :`We Failed To Find Products  due to Server Problem related To database,  Please Try Again. <br > Thank You `
    })
  } 
};

export async function giveCourseJsonApi(r, res) {
  try {
    let CourseArray = await Course.find();
    res.json({
      courses:CourseArray
    });
  } catch (e) {
    log(e)
  } 
};

export async function CreateACourseApi(req,res) {    
  try {
    let courseData={};
    let {thumb,images,title,description,price,dates,courseDuration, juniorEndTime,juniorStartTime,seniorStartTime,seniorEndTime} =req.body ;
    let testArray =[thumb,courseDuration,images.length,title,description,price,dates.length, juniorEndTime,juniorStartTime,seniorStartTime,seniorEndTime]
    let emtyDataIndex =testArray.findIndex(el => !el) 
    if (emtyDataIndex !==-1) throw 'emty data index  is ' + emtyDataIndex
    
    
    log('//emty test pass')
    //purify
    courseData.title =await repleCaracter(title);
    courseData.description =await repleCaracter(description);
    courseData.courseDuration=await repleCaracter(courseDuration);
    if (Number(price).toString().toLowerCase()==='nan') throw 'price is not a number ' +price;
    if (!(images instanceof Array)) throw "images is not a array" +images;
    if (!(dates instanceof Array)) throw "date is not a array" +dates ;
    courseData.dates=dates;
    courseData.price=price;
    courseData.juniorStartTime=makeTimeString(juniorStartTime); 
    courseData.juniorEndTime=makeTimeString(juniorEndTime); 
    courseData.seniorStartTime=makeTimeString(seniorStartTime); 
    courseData.seniorEndTime=makeTimeString(seniorEndTime); 
    courseData.url= mekeLinkString(courseData.title.toLowerCase());
  
    
    log('//purify')
    //cloudinary
    courseData.thumb = await UploadImageToCloudinaryFromImageUrl(thumb)
    .then(({error,image}) => {
      if (error) throw error
      return image.url
    }) 



    log('//cloudinary thumb uploaded ')


    courseData.images=[];
    for (let i = 0; i < images.length; i++) {
      let url = images[i];
      url = await UploadImageToCloudinaryFromImageUrl(url).then(({error,image}) => {
        if (error) throw error
        return image.url
      }) 
      courseData.images.push(url)
      log('//cloudinary image uploaded ' +(i+1))

    }

    let check= await Course.findOne({title : courseData.title});
    if (check) return res.status(400).json({error :'Please do not use same name'})
    await Course.create(courseData).then(e => res.status(201).json({success:true}))
  } catch (e){ 
    log(e)
    return Alert('failed to upload Data' ,res)
  }
}
export async function UpdateCourseDates(req,res) {
    function alert(error) {
     return res.json({error })
    }
    let { dateArray, id} = req.body;
    if (!dateArray instanceof Array) return alert('Server Error, Please Contact The Developer');
    if (!dateArray.length) return alert('Please Give Date, You Can not Make it Emty');
    if (Number(id).toString() === 'NaN') {
      return alert('Please Avoid To Hack Our Website')
    }
    Course.findOneAndUpdate({id}, {
      dateArray
    })
   .then(e => res.json({
     success :true
   })
   )
   .catch(e => {
     console.log(e);
     res.status(500).json({
       error :'Failed To Update Data'
     })
   })
};
export async function deleteCourseApi(req,res) {
  function alert(error) {
    return res.json({error })
  }
  try {
    let {id} =req.query ;
    if (!id)  throw 'Not a defined'
    if (Number(id).toString() === 'NaN') throw 'Not a number'
    await Course.findOneAndDelete({id:Number(id)});
    return res.sendStatus(200)
  } catch (error) {
    res.sendStatus(400)
  }
  
}