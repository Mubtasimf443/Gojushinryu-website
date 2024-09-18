/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */


import { Router } from "express";
import { log } from "../_lib/smallUtils.js";
import {fileURLToPath} from 'url'
import path from "path";



const __filename = fileURLToPath(import.meta.url);
let dirName = path.dirname(__filename)
let fileRouter = Router();

// css files

fileRouter.get('/css/home/:name',(req, res) => {
    try {
       return res.status(200).sendFile(path.resolve(dirName, '../public/css/home/' + req.params.name))
    } catch (error) {
        log(error)
        return res.sendStatus(404)
    }
})


fileRouter.get('/css/about_us/:name',(req, res) => {
    try {
       return res.status(200).sendFile(path.resolve(dirName, '../public/css/about_us/' + req.params.name))
    } catch (error) {
        log(error)
        return res.sendStatus(404)
    }
})



fileRouter.get('/css/pages/:name',(req, res) => {
    try {
       return res.status(200).sendFile(path.resolve(dirName, '../public/css/pages/' + req.params.name))
    } catch (error) {
        log(error)
        return res.sendStatus(404)
    }
})





fileRouter.get('/css/:name', (req, res) => {
    try {
       return res.status(200).sendFile(path.resolve(dirName, '../public/css/' + req.params.name))
    } catch (error) {
        log(error)
        return res.sendStatus(404)
    }
})




fileRouter.get('/img/abs-slide/:name', (req, res) => {
    try {
       return res.status(200).sendFile(path.resolve(dirName, '../public/img/abs-slide/' + req.params.name))
    } catch (error) {
        log(error)
        return res.sendStatus(404)
    }
})



fileRouter.get('/img/:name', (req, res) => {
    try {
       return res.status(200).sendFile(path.resolve(dirName, '../public/img/' + req.params.name))
    } catch (error) {
        log(error)
        return res.sendStatus(404)
    }
})


fileRouter.get('/js/:name', (req, res) => {
    try {
       return res.status(200).sendFile(path.resolve(dirName, '../public/js/' + req.params.name))
    } catch (error) {
        log(error)
        return res.sendStatus(404)
    }
})



fileRouter.get('/icon/:name', (req, res) => {
    try {
       return res.status(200).sendFile(path.resolve(dirName, '../public/icon/' + req.params.name))
    } catch (error) {
        log(error)
        return res.sendStatus(404)
    }
})



fileRouter.get('/video/:name', (req, res) => {
    try {
       return res.status(200).sendFile(path.resolve(dirName, '../public/video/' + req.params.name))
    } catch (error) {
        log(error)
        return res.sendStatus(404)
    }
})




export {fileRouter}