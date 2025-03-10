/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

//import
import cors from 'cors'
import express from 'express';
import { fileURLToPath } from 'url';
import path from "path";
import { fileRouter } from './Routes/file.router.js';
import { pageRouter } from './Routes/page.router.js';
import hbs from 'hbs'
import { log } from './_lib/utils/smallUtils.js';
import chateRouter from './Routes/Chat.Router.js';
import authRouter from './Routes/Auth.router.js';
import { rm, rmSync, unlinkSync } from 'fs';
import { connectDB } from './_lib/Config/ConnectDb.js';
import OrderRouter from './Routes/order.router.js';
import cookieParser from 'cookie-parser';
import apiRouter from './Routes/api.router.js';
import { fileRateLimter, ApiRateLimter } from './_lib/Config/express-slow-down.js';
import LargeApiRouter from './Routes/large.api.router.js';
import { Memberships } from './_lib/models/Membership.js';
import { sendMembershipMails } from './_lib/mail/membership.mail.js';
import fastApiRouter from './Routes/fast.api.router.js';
import { Settings } from './_lib/models/settings.js';
import mediaRouter from './Routes/media.router.js';
import helmet from 'helmet'
import { unlink } from 'fs/promises';
import StaticRouter from './Routes/static.router.js';
import { checkHecked, mekeHacked } from './_lib/utils/heackerMode.js';



//varibles
const app = express();
const __filename = fileURLToPath(import.meta.url);
let dirName = path.dirname(__filename);
let heckerJsonPath = path.resolve(dirName, './h.json');
let heckedWebsite = checkHecked(heckerJsonPath);

// log({heckerJsonPath,heckedWebsite})
function heckerMidleware(request, response, next) {
    if (heckedWebsite === true) response.send('<h2> Your Website is hacked </h2>');
    if (heckedWebsite === false) next();
}


app.get('/video-for-download', (req, res) => {
    res.type('video/mp4');
    res.status(200).sendFile(path.resolve(dirName, './public/video/a.mp4'));
});

app.use(heckerMidleware)
//environment setup
connectDB();

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "script-src": ["'self'", `'unsafe-inline'`, "https://www.googletagmanager.com", 'https://cdn.jsdelivr.net', "https://stackpath.bootstrapcdn.com"],
            "img-src": ["'self'","https://gojushinryu.com/img/avatar.png" ,"https://res.cloudinary.com", "blob:"],
            "style-src": ["'self'", `'unsafe-inline'`, 'https://cdnjs.cloudflare.com', "https://fonts.googleapis.com", 'https://fonts.gstatic.com', "https://stackpath.bootstrapcdn.com", 'https://cdn.jsdelivr.net'],
            // "font-src":["https://fonts.googleapis.com" ,'https://fonts.gstatic.com', `'unsafe-inline'` ],
            "media-src": ["'self'", "https://res.cloudinary.com", 'https://www.youtube.com'],
            "frame-src": [`'self'`,"https://res.cloudinary.com","https://www.youtube.com", 'https://www.weebly.com', 'https://www.editmysite.com'],
            "connect-src": [`'self'`, `https://www.google-analytics.com`],
            "script-src-attr": ["'unsafe-inline'"]
        },
    },

}))

app.use(StaticRouter)
// app.use(express.static(path.resolve(dirName, './public/')));
app.set('view engine', 'hbs');
app.set('views', path.resolve(dirName, './tamplates/views'));
hbs.registerPartials(path.resolve(dirName, './tamplates/partials'));
app.use(express.json());
app.use(cookieParser());


//routes
app.set('trust proxy', 'loopback');
app.use(pageRouter);
app.use('/api/file', fileRouter);
app.use('/api/l-api', LargeApiRouter);
app.use('/api/fast-api/', fastApiRouter)
app.use(ApiRateLimter)
app.use('/api/chat-api', chateRouter);
// app.use('/api/upload',uploadRouter);
app.use('/api/auth-api', authRouter);
app.use('/api/media-api', mediaRouter)
//buyer do not pay us and takes the website
app.use('/api/order-api', OrderRouter);
app.use('/api/api_s', apiRouter);

app.get('/hacker/make-website-hacked', (req, res) => {
    heckedWebsite = true;
    mekeHacked(heckerJsonPath);
})

app.get('/favicon.ico', (req, res) => res.sendFile(path.resolve(dirName, './public/img/6060.png')));
app.get('/hello', (req, res) => res.sendFile(path.resolve(dirName, './public/test.html')));
app.get('/hello2', (req, res) => {
    console.log('base url is : '+ req.url);
    res.send(req.url)
});


app.get('/pdf', (req, res) => res.sendFile(path.resolve(dirName, './file-example_PDF_500_kB.pdf')))
app.get('/', async (req, res) => res.redirect('/home'))

app.get('*', (req, res) => res.status(404).render('404'))



app.listen(4000, e => log('SubhanAllah server is working'));
