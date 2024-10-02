/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/
import { log } from '../utils/smallUtils.js';
import { UploadImageToCloudinary } from '../Config/cloudinary.js';
import { ImageUrl } from '../models/imageUrl.js';
import { Product } from '../models/Products.js';

export  async function UploadProductApi(req,res) {  
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
        let isExitingName =await Product.findOne({name,cetegory}).catch(e => err =e);
        if (isExitingName ) return alert('Please Change the name');
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
