/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/
import { log, Success } from '../utils/smallUtils.js';
import { UploadImageToCloudinary } from '../Config/cloudinary.js';
import { ImageUrl } from '../models/imageUrl.js';
import { Product } from '../models/Products.js';
import { isnota, repleCrAll, validate } from 'string-player';

export async function UploadProductApi(req, res) {
    try {
        // console.log(req.body);
        function alert(params) {
            return res.status(400).json({ error: params })
        }

        let {
            name,
            description,
            thumb,
            cetegory,
            images,
            SizeAndPrice,
            sizeDetails,
        } = req.body;

        let testArray = [name, description, thumb, cetegory, sizeDetails];
        let index = await testArray.findIndex(el => !el);
        // console.log(index);

        if (index !== -1) return alert('please give all the data');

        if (validate.isArray(images) === false || images?.length === 0) return alert('Please upload image for the product');

        let err;

        if (validate.isArray(SizeAndPrice) === false) return alert('Invalid size and price');
        if (SizeAndPrice.length === 0) return alert('Invalid size and price');


        [name, description, cetegory, sizeDetails] = repleCrAll([name, description, cetegory, sizeDetails]);

        for (let i = 0; i < SizeAndPrice.length; i++) {
            if (isnota.object(SizeAndPrice[i])) return alert(`Invalid size and price in SizeAndPrice[${i}]`);
            if (validate.isUndefined(SizeAndPrice[i].size)) return alert(`Invalid size and price in SizeAndPrice[${i}].size`);
            if (isnota.string(SizeAndPrice[i].size)) return alert(`Invalid size and price in SizeAndPrice[${i}].size`);
            if (validate.isUndefined(SizeAndPrice[i].price)) return alert(`Invalid size and price in SizeAndPrice[${i}].price`);
            if (isnota.num(SizeAndPrice[i].price)) return alert(`Invalid size and price in SizeAndPrice[${i}].price`);
            let object = {
                price: SizeAndPrice[i].price,
                size: SizeAndPrice[i].size
            };
            SizeAndPrice[i] = object;
        }

        let isExitingName = await Product.findOne({ name, cetegory }).catch(e => err = e);

        if (isExitingName) return alert('Please Change the name');



        thumb = await uploadTumb(thumb, err);
        if (err) return alert('please change the thumb');
        let newImageArray = await uploadImages(images, err)
        if (err) return alert('Please Do not use corrupted image');


        await Product.create({
            id: Date.now(),
            name,
            description,
            cetegory,
            thumb,
            images: newImageArray,
            date: new Date(Date.now()).getDate() + '-' + new Date().getMonth() + '-' + new Date().getFullYear(),
            SizeAndPrice,
            sizeDetails
        })
            .catch(
                function (e) {
                    console.error(e);
                    err = 'Failed to save database';
                    return;
                }
            );
        if (err) return alert(err);
        return res.status(201).json({
            success: true
        })
    } catch (error) {

        return console.error(error);
    }
}



async function uploadTumb(uploadTumb, error) {
    try {
        let imagePath = await getImagePath(uploadTumb, error);
        if (!imagePath) {
            return undefined;
        }
        let isuploaded = await UploadImageToCloudinary(imagePath);
        if (isuploaded.error) {
            error = isuploaded.error;
            return undefined;
        }
        if (isuploaded.image) return isuploaded.image.url;
    } catch (err) {
        console.error(err);
        error = err;
    }
}

async function getImagePath(url, error) {
    let img = await ImageUrl.findOne({ url });
    if (validate.isNull(img)) {
        error = 'Their is no thumbneil , please try again';
        return undefined;
    }
    return img.urlpath;
}

async function uploadImages(images, error) {
    try {
        let nImgArray = [];
        for (let i = 0; i < images.length; i++) {
            const path = await getImagePath(images[i], error);
            if (!path) return undefined;
            let isuploaded = await UploadImageToCloudinary(path);
            if (isuploaded.error) {
                error = isuploaded.error;
                return;
            }
            if (isuploaded.image?.url) {
                nImgArray.push(isuploaded.image.url);
            }
        }
        return nImgArray;
    } catch (err) {
        console.error(err);
        error = err;
    }
}