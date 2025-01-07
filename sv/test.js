/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import { log } from 'console';
import {createRequire} from 'module'
import path, { resolve } from 'path';
import { fileURLToPath } from 'url';
import { Product } from './_lib/models/Products.js';
import Awaiter from 'awaiter.js';
import mongoose from 'mongoose';
import { SDATABASE } from './_lib/utils/env.js';
const require =createRequire(import.meta.url);
const __dirname =path.dirname(fileURLToPath(import.meta.url))


await mongoose.connect(SDATABASE)

let data = [
    {
        _id: { '$oid': '673f19fe75cf765c942243e0' },
        id: 1732188670309,
        name: 'Gojushin Ryu Jacket',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem obcaecati sequi voluptate tempore ullam iure voluptates odio sint, reprehenderit eaque autem! Ab voluptas cumque ipsam dignissimos temporibus possimus, aliquid eum!\n',
        cetegory: 'weapons',
        thumb: 'http://res.cloudinary.com/dmuf5ducu/image/upload/v1732188667/1732188666871.jpg',
        images: [
            'http://res.cloudinary.com/dmuf5ducu/image/upload/v1732188667/1732188667603.jpg',
            'http://res.cloudinary.com/dmuf5ducu/image/upload/v1732188668/1732188668122.jpg',
            'http://res.cloudinary.com/dmuf5ducu/image/upload/v1732188668/1732188668638.jpg',
            'http://res.cloudinary.com/dmuf5ducu/image/upload/v1732188669/1732188669150.jpg',
            'http://res.cloudinary.com/dmuf5ducu/image/upload/v1732188669/1732188669863.jpg'
        ],
        date: '21-10-2024',
        selling_country: 'both',
        selling_style: 'per_price',
        price: '60',
        size_and_price: [],
        size: '400gram',
        delivery_charge_in_india: 100,
        delivery_charge_in_canada: 100,
        __v: 0
    }
];



for (let i = 0; i < data.length; i++) {
    if (i===0) {
        let d=data[i]
        await Awaiter(10);
        (new Product({
            name :d.name,
            description :d.description,
            cetegory :d.cetegory,
            thumb :d.thumb,
            images :d.images,
            sizeDetails :d.size ,
            SizeAndPrice: [
                {
                    size : "400gram" ,
                    price : Number(d.price)
                },
            ]
        })).save()
    }
}