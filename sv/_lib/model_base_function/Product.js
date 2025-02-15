/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import { repleCaracter, validate } from "string-player";
import { Product } from "../models/Products.js";
import catchError from "../utils/catchError.js";
import { Alert, log, Success } from "../utils/smallUtils.js";
import { request, response } from 'express'
import { UploadImgFile } from "../api/formidable.file.post.api.js";
import { Cloudinary } from "../Config/cloudinary.js";
import { isValidObjectId } from "mongoose";

export async function findProductPageNavigation(req, res) {
  try {
    let prods = (await Product.find({}));
    const arr=[];
    for (let i = 0; i < prods.length; i++) {
      const { id, _id, thumb, name, description, sizeDetails, SizeAndPrice, images, cetegory } = prods[i];
      arr.push({ id, thumb, _id, name, description, sizeDetails, SizeAndPrice, images, cetegory })
    }
    return res.render('shop', { Product: arr });

  } catch (e) {
    console.error(e);
    res.status(500).render('massage_server', {
      title: 'Failed, Try Again',
      body: `We Failed To Find Products  due to Server Problem related To database,  Please Try Again. <br > Thank You `
    })
  }
};
export const FindProduct = async (req, res) => {
  try {
    let product = await Product.find({}, 'id _id thumb name description sizeDetails SizeAndPrice images cetegory');
    product = product.map(function (element) {
      element = element.toObject();
      element.thumb = decodeURIComponent(element.thumb);
      for (let i = 0; i < element.images.length; i++) element.images[i] = decodeURIComponent(element.images[i]);
      return element;
    });
    res.status(200).json({ success: true, product: product });
    return;
  } catch (e) {
    res.status(500).json({ error: 'Failed to Give you the products' })
  }
}
export async function findProductDetails(req, res) {
  try {
    if (Number(req.params.id).toString() === 'NaN') return res.render('massage_server', { title: 'Can not find the product', body: 'there is no such product Matching This Name ' });
    let prod = await Product.findOne({ id: req.params.id });
    if (!prod) return res.status(404).render('massage_server', { title: 'Can not find the product', body: 'there is no such product Matching This Name ' });
    let { name, description, thumb, images, cetegory, id, SizeAndPrice } = prod;
    let metaname = (name.length > 80 ? name.substring(0, 80) : name), metaDescription = (description.length > 120 ? description.substring(0, 120) : description);
    return res.status(201).render('product-detail', { name, description, thumb, images, cetegory, id, SizeAndPrice, metaname, metaDescription });
  } catch (error) {
    console.error(error)
    return res.status(400).render('massage_server', { title: 'Can not find the product', body: 'there is no such product Matching This Name ' });
  }
}
export async function productDetailsFormQuery(req, res) {
  try {
    if (Number(req.query.id) === 0 || validate.isNaN(Number(req.query.id))) throw 'Give a corect product id, not a NaN';
    let prod = await Product.findOne({ id: req.query.id });
    if (prod === null) throw `their is no product of id : ${req.query.id}`;
    prod=prod.toObject();
    prod.thumb = decodeURIComponent(prod.thumb);
    for (let i = 0; i < prod.images.length; i++) {
      prod.images[i] = decodeURIComponent(prod.images[i]);
    }
    return res.json({ product: prod })
  } catch (error) {
    catchError(res, error);
  }
}
export async function giveProductDetails(req, res) {
  try {
    let { id } = req.body;
    if (!id) return Alert('data is not define', res);
    if (Number(id).toString() === 'NaN') throw 'id is a NaN';
    let prod = await Product.findOne({ id: id })
    if (!prod) throw "their is no product in the id of " + id;
    return res.json(
      {
        prod: {
          _id: prod._id,
          id: prod.name,
          thumb: prod.thumb,
          name: prod.name,
          description: prod.description,
          sizeDetails: prod.sizeDetails,
          SizeAndPrice: prod.SizeAndPrice,
          images: prod.images,
          cetegory: prod.cetegory
        }
      }
    );
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e });
  }

}
export async function DeleteProduct(req, res) {
  let { id } = req.body;
  if (!id) return Alert('Please Give The Correct User InfoCan not Bann User ', res);
  if (Number(id).toString() === 'NaN') return Alert('This id is not valid');
  log({ id })
  Product.findOneAndDelete({ id })
    .then(e => Success(res))
    .catch(e => {
      log(e);
      Alert('Server error')
    })
};
export async function findProductImage(req, res) {
  try {
    let id = req.query.id;
    if (!id) return res.sendStatus(304)
    if (isValidObjectId(id) === false) throw `ObjectId [${id}] is not valid`;
    let image = await Product.findById(id);
    if (!image) return res.sendStatus(304)
    image = image.thumb;

    return res.status(200).send(image)

  } catch (error) {
    log(error);
    return res.sendStatus(304)
  }

}
export async function addProductImage(req = request, res = response) {
  try {
    let id =req.query.id;
    if (id ===undefined || isNaN(id)){
      throw 'Id Is not a Number'
    }
    let product = await Product.findOne().where('id').equals(Number(id));
    if (product === null) {
      throw  new Error('There is No Product From this id : '+id);
    }
    if (product.images.length >=10) {
      throw  new Error('Only 10 Image are allowed');
    }
    let [imgPath, fields] =await UploadImgFile(req);
    if (!imgPath) throw new Error("Server error , Can not Upload Image");
    let url = (await Cloudinary.uploader.upload(imgPath, { public_id: Date.now(), resource_type: 'image' })).url;
    if (url) {
      product.images.push(url);
      await product.save()
    }
    return res.status(200).send(url);
  } catch (error) {
    catchError(res,error);
  }
}
export async function removeProductImage(req = request, res = response) {
  try {
    let image = req.query.image || req.body.image;
    let id = req.query.id;
   
    if (id === undefined || isNaN(id)) {
      throw 'Id Is not a Number';
    }
    if (!image) {
      throw 'Image Is Not Present';
    }
    let product = await Product.findOne().where('id').equals(Number(id));
    if (product === null) {
      throw  new Error('There is No Product From this id : '+id);
    }
    if (product.images.length === 1 ) {
      throw ('can not remove last image from product');
    }

    let images = product.images;
    let imageDoesNotExist = images.findIndex(el => el === image) === -1;
    if (imageDoesNotExist) throw ("Image Does not exist");

    images = images.filter(el => el !== image);
    await Product.findOneAndUpdate({ id: Number(id) }, { images: images });
    
    return res.sendStatus(204);
  } catch (error) {
    catchError(res,error);
  }
}
export async function changeProductTumb(req = request, res = response) {
  try {
    let id =req.query.id;
    if (id ===undefined || isNaN(id)){
      throw 'Id Is not a Number'
    }
    let product = await Product.findOne({} , 'id').where('id').equals(Number(id));
    if (product === null) {
      throw  new Error('There is No Product From this id : '+id);
    }
    let [imgPath, fields] =await UploadImgFile(req);
    if (!imgPath) throw new Error("Server error , Can not Upload Image");
    let url = (await Cloudinary.uploader.upload(imgPath, { public_id: Date.now(), resource_type: 'image' })).url;
    
    await Product.findOneAndUpdate({ id: Number(id) }, { thumb: url });
    return res.status(200).send(url);
  } catch (error) {
    catchError(res,error);
  }
}
export async function UpdateProduct(req = request, res = response) {
  try {
    let id =req.query.id;
    if (id ===undefined || isNaN(id)){
      throw 'Id Is not a Number'
    }
    let product = await Product.findOne({}).where('id').equals(Number(id));
    if (product === null) {
      throw  new Error('There is No Product From this id : '+id);
    }
    let { name, description, cetegory, sizeDetails, SizeAndPrice } = await req.body;
    (name) && (product.name = repleCaracter(name));
    (description) && (product.description = repleCaracter(description));
    (cetegory) && (product.cetegory = repleCaracter(cetegory));
    (sizeDetails) && (product.sizeDetails = repleCaracter(sizeDetails));
    if (Array.isArray(SizeAndPrice) && SizeAndPrice.length >= 1 && SizeAndPrice.length <= 10) {
      for (let i = 0; i < SizeAndPrice.length; i++) {
        const {price , size} = SizeAndPrice[i];
        if (isNaN(price)) throw 'Price is not correct';
        if (size.trim().length=== 0 || size.trim().length >= 100 ) throw ' size is not correct';
        SizeAndPrice[i].price =Number(price);
        SizeAndPrice[i].size =repleCaracter(size);
      }
      product.SizeAndPrice = SizeAndPrice;
    }
    await product.save();
    return res.sendStatus(200);
  } catch (error) {
    catchError(res,error);
  }
}