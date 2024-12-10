/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah
By Allah's Marcy I will gain success , Insha Allah
*/

import { Router } from "express";


const tiktokRouter=Router();
tiktokRouter.get('/callback', (req,res) => {});
let 
Tiktok_key='sbawlckvhm82juhm5x',
tiktok_secret="GnAFzlruZRyLY6rgmu4L1UDLR0S85AN4";

const redirectionURLFunction = () => `https://www.tiktok.com/v2/auth/authorize?${Tiktok_key}=&response_type=code&scope=user.info.basic&redirect_uri=<redirect_uri>&state=${Math.random().toString(36).substring(2)}`


async function tiktokLoginCallback(request,response){
    try {
        
    } catch (error) {
        console.error(error)
    }
}




export default tiktokRouter