/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */


import { Router } from "express";
import { log } from "../_lib/smallUtils.js";
import {fileURLToPath} from 'url'
import path from "path";



const __filename = fileURLToPath(import.meta.url);
let dirName = path.dirname(__filename)
let fileRouter = Router();

fileRouter.get('/temp/:name',(req, res) => {
    try {
       return res.status(200).sendFile(path.resolve(dirName,  '../temp/images/' + req.params.name))
    } catch (error) {
        log(error)
        return res.sendStatus(404)
    }
})



export {fileRouter}