/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import { validate } from "string-player";
import { Product } from "../models/Products.js";
import catchError from "../utils/catchError.js";
import { repleCaracter } from "../utils/replaceCr.js";
import { Alert, log, Success } from "../utils/smallUtils.js";


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

    id = await repleCaracter(id);

    let image = await Product.findById(id);
    if (!image) return res.sendStatus(304)
    image = image.thumb;

    return res.status(200).send(image)

  } catch (error) {
    log(error);
    return res.sendStatus(304)
  }

}