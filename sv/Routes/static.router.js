/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */
/* By Allah's Marcy I will gain success , Insha Allah*/

import express from "express";
import { Router } from "express";
import path from 'path'
import { log } from "string-player";
import {fileURLToPath} from 'url'
import { dayCatch7, longCatch24 ,shortCatch15,shortCatch30} from "../_lib/midlewares/catching.js";
import morgan from "morgan";


const __dirname=path.dirname(fileURLToPath(import.meta.url));
const StaticRouter =Router();


StaticRouter.use('/img',longCatch24 , express.static(path.resolve(__dirname,'../public/img/')))
StaticRouter.use('/css', express.static(path.resolve(__dirname,'../public/css/')))
StaticRouter.use('/js', express.static(path.resolve(__dirname,'../public/js/')))
StaticRouter.use('/icon',longCatch24 ,express.static(path.resolve(__dirname,'../public/icon/')))
StaticRouter.use('/pages',dayCatch7 ,express.static(path.resolve(__dirname,'../public/pages/')))
StaticRouter.use('/video',dayCatch7 , express.static(path.resolve(__dirname,'../public/video/')))



export default StaticRouter