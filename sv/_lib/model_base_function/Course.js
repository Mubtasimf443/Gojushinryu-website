/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import Course from "../models/Course.js";
import { Alert, log } from "../utils/smallUtils.js";



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
export async function CreateACourseApi() {    
  try {
  let {
    name, description, dateArray,courseType,price,seniorTime,joniourTime, thumb, images
  }
  = req.body;
  let testArray = [name, description,price, dateArray,courseType,,seniorTime,joniourTime,thumb, images
  ];
  let TestIndex = await testArray.findIndex(el => !el);
  if (TestIndex !== -1) return Alert('Please give All the Data ',res);
 
  if (!images) return alert('Image Is not define');
  if (images.length === 0) return alert('Images Are Required');
  Course.create({ 
    id:Date.now(), 
    name, description, dateArray,courseType,price,seniorTime,joniourTime, thumb, images
  })
  .then(data => res.status(201).json({success :true}))
  .catch(e => {
     Alert('failed to create Course, It happens when You use same name at 2 course', res )
   })
  } catch (e) {
    res.status(500).json({
      error: 'Server Error'
    })
  }

}
export async function UpdateCourseDates() {
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


