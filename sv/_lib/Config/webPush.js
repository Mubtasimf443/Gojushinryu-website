/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
Insha Allah,  By his marcy I will Gain Success 
*/

import { ADMIN_EMAIL, SERVICE_WORKER_PUBLIC_KEY } from '../utils/env.js';
import { Settings } from '../models/settings.js';
import {createRequire} from 'module';

const require = createRequire(import.meta.url);
export async function makePushNotification(subscription, data) {
    if (typeof data !== 'object') throw new Error("Data is not a object , must be a objects");
    let private_key = (await Settings.findOne({})).service_worker_private_key || "";
    const webPush = require('web-push');
    webPush.setVapidDetails(
        "mailto:" + ADMIN_EMAIL,
        SERVICE_WORKER_PUBLIC_KEY,
        private_key
    )
    await webPush.sendNotification(subscription, JSON.stringify(data));
}