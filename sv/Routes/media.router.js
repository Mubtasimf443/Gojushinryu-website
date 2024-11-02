/*  بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah */
/* By Allah's Marcy I will gain success , Insha Allah*/

import { Router } from "express";
import YouTubeRouter from "../_lib/media/router.js/youtube.router.js";

let mediaRouter =Router();
mediaRouter.use('/youtube', YouTubeRouter)

export default mediaRouter