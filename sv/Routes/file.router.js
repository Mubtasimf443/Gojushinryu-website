/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */


import { Router } from "express";
import { log } from "../_lib/utils/smallUtils.js";
import {fileURLToPath} from 'url'
import path from "path";
import { ApiRateLimter, fileRateLimter } from "../_lib/Config/express-slow-down.js";
import express from "express";



const __filename = fileURLToPath(import.meta.url);
let dirName = path.dirname(__filename)
let fileRouter = Router();

fileRouter.use(fileRateLimter);
fileRouter.use(express.static(path.resolve(dirName,'../public/')));
fileRouter.get('/temp/:name',(req, res) => {
    try {
        log(req.params.name)
        let location=path.resolve(dirName,  '../temp/images/' + req.params.name);
        log({location})
        return res.status(200).sendFile(location)
    } catch (error) {
        log(error)
        return res.sendStatus(404)
    }
})



export {fileRouter}