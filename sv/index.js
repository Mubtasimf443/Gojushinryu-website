/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

//import
import express from 'express';
import {fileURLToPath} from 'url';
import path from "path";
import { fileRouter } from './Routes/file.router.js';
import { pageRouter } from './Routes/page.router.js';
import hbs from 'hbs'
import { log } from './_lib/smallUtils.js';
import chateRouter from './Routes/Chat.Router.js';
import uploadRouter from './Routes/upload.router.js';
import authRouter from './Routes/Auth.router.js';

//varibles
const app = express();
const __filename = fileURLToPath(import.meta.url);
let dirName = path.dirname(__filename);


//environment setup
app.set('view engine', 'hbs');
app.set('views', path.resolve(dirName , './tamplates/views'));
hbs.registerPartials(path.resolve(dirName ,'./tamplates/partials'));
app.use(express.json());


//routes
app.use(fileRouter);
app.use(pageRouter);
app.use('/api/chat',chateRouter);
app.use('/api/upload',uploadRouter);
app.use('/api/auth/',authRouter)


app.listen(4000, e=> log('SubhanAllah server is working'))