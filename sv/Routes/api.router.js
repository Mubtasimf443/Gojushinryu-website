/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */
import { ADMIN_EMAIL, FROM_EMAIL, JWT_SECRET_KEY, MAIL_USER } from '../_lib/env.js';
import {mailer} from '../_lib/mailer.js'
import { Router, urlencoded } from "express"
import { Alert, log } from '../_lib/smallUtils.js';
import { Contact_us_api_Function } from '../_lib/api/Contact_Form_Api.js';
import { UplaodImageApi } from '../_lib/api/UplaodImageApi.js';
import { ChangeuserData, changeUserPasswordAPI } from '../_lib/api/Change.userData.js';
import { UplaodImageApiIn25Minutes } from '../_lib/api/UplaodImageApiIn25Minutes.js';
import { UploadImageToCloudinary } from '../_lib/Config/cloudinary.js';
import { ImageUrl } from '../_lib/models/imageUrl.js';
import { Product } from '../_lib/models/Products.js';
import jwt from 'jsonwebtoken' ;
import { Admin } from '../_lib/models/Admin.js';
import AdminCheckMidleware from '../_lib/midlewares/AdminCheckMidleware.js';


//variables
let apiRouter =Router()

apiRouter.post('/contact' , Contact_us_api_Function)
apiRouter.post('/upload-image-for-10-minutes',UplaodImageApi)
apiRouter.post('/upload-image-for-25-minutes',UplaodImageApiIn25Minutes);
apiRouter.put('/UpdateUserData',ChangeuserData);
apiRouter.put('/Update-User-Password',changeUserPasswordAPI);
apiRouter.post('/upload-product',AdminCheckMidleware,
    async function UploadProductApi(req,res) {  
    function alert(params) {
      return res.json({error:params})
    }
    log('request recieved')
    log(req.body.images)
    let {
        name,
        description,
        thumb,
        cetegory,
        images,
        selling_country,
        selling_style ,
        selling_price_canada ,
        selling_price_india,
        selling_amount,
        size_and_price, 
        delivery_charge_in_india ,
        delivery_charge_in_canada
    } =req.body;
    let testArray=[ name, description,thumb,images, selling_country,cetegory,selling_style , selling_price_canada , selling_price_india,delivery_charge_in_india ,delivery_charge_in_canada] ;
    let index= await testArray.findIndex(el => !el );
    console.log(index);
    if (index !== -1 ) return alert('please give all the data') ;
    if (images.length === 0) return alert('Please upload image for the product');
    let err;
 
    if (selling_style !== 'per_price' && selling_style !== 'per_size' ) return alert('Bugs in the code ,please contact developer')
    //images 
    thumb=  await ImageUrl.findOne({url :thumb})
    .then( async ({urlpath}) => urlpath ?urlpath :false) 
    .catch(e => {log(e); err=e;return undefined});
    if (err || !thumb) return alert('please change the thumb');
    thumb = await UploadImageToCloudinary(thumb)
    .then(({image,error})=>  {
        if (error) {
            log(error)
            err =error;
            return
        }
        if (image) {
            console.log('thumb uploaded to cloudinary');
            return image.url
        }
    })
    .catch(e =>{
        err=e;
        return undefined
    }) ;

    if (err) return alert('please change the thumb');
    let newImageArray =[];
    for (let index = 0; index < images.length; index++) {
       
        if (!err) {
            log(`image index ${index}`)
            let Urlelement = images[index];
            let urlpath = await ImageUrl.findOne({ url : Urlelement})
            .then(data => {
                if (data) return data.urlpath
                if (!data) return false
            })
            .catch(e => {log(e); err=e})
            if (!err || urlpath) {
            if (urlpath) {
                await UploadImageToCloudinary(urlpath)
                .then(({image,error}) => {
                    if (error) {
                        err=error;
                        log(err);
                        return
                    }
                    if (image) {                        
                        newImageArray =[...newImageArray, image.url]
                    }
                    }
                )
                .catch(e => { log(e); err=e})
            }
            }
        }
    }
    if (err) return alert('Please Do not use corrupted image');
    log('//creating database');
    log(newImageArray)
    await Product.create({
        id :Date.now(),
        name,
        description,
        cetegory,
        thumb,
        images :newImageArray,
        date:new Date( Date.now()).getDate() + '-' +new Date().getMonth() + '-'  + new Date().getFullYear()  ,
        selling_country,
        selling_style ,
        selling_price_canada ,
        selling_price_india,
        size_and_price, 
        delivery_charge_in_india ,
        delivery_charge_in_canada,

    })
    .then(e => {
        log('//database created')
        res.status(201).json({success:true})
    })
    .catch(e => {
    alert('Database can not be created');
    log(e)
    }) 
}
)


export default apiRouter