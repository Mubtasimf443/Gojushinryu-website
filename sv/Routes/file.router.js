/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */


import { Router } from "express";
import { log } from "../_lib/utils/smallUtils.js";
import {fileURLToPath} from 'url'
import path from "path";
import { ApiRateLimter, fileRateLimter } from "../_lib/Config/express-slow-down.js";
import express from "express";
import { existsSync, fstat } from "fs";
import morgan from "morgan";
import Awaiter from "awaiter.js";
import slowDown from "express-slow-down";



const __filename = fileURLToPath(import.meta.url);
let dirName = path.dirname(__filename)
let fileRouter = Router();

let mSlowdown=slowDown({
    delayAfter :330,
    windowMs :20*1000,
    delayMs :function (hits) {
        hits=hits-330;
        hits =hits*100;
        return hits;
    }
});

let lSlowdown=slowDown({
    windowMs :3 *1000,
    delayAfter :6,
    delayMs :function(hits) {
        hits=hits-6;
        hits=hits*500;
        return hits;
    }
});


fileRouter.use(express.static(path.resolve(dirName,'../public/')));
fileRouter.use(morgan('dev'));
fileRouter.get('/temp/:name',async (req, res) => {
    try {
        let location=path.resolve(dirName,  '../temp/images/' + req.params.name);
        if (existsSync(location)) return res.status(200).sendFile(location);
        if (!existsSync(location)) return res.sendStatus(204)
    } catch (error) {
        console.error(error);
        return res.sendStatus(204)
    }
})


fileRouter.get('/temp-video/:name',lSlowdown, async(req, res) => {
    try {
        let location=path.resolve(dirName,  '../temp/video/' + req.params.name);
        if (existsSync(location)) return res.status(200).sendFile(location);
        if (!existsSync(location)) return res.sendStatus(204);
    } catch (error) {
        console.error(error);
        return res.sendStatus(204)
    }
})


fileRouter.get('/temp-pdf/:name', lSlowdown, async(req, res) => {
    try {
        let location=path.resolve(dirName,  '../temp/pdfs/' + req.params.name);
        if (existsSync(location)) return res.status(200).sendFile(location);
        if (!existsSync(location)) return res.sendStatus(204);
    } catch (error) {
        console.error(error);
        return res.sendStatus(204)
    }
})
export {fileRouter}