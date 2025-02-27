/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
Insha Allah,  By his marcy I will Gain Success 
*/

import { connect } from "mongoose";
import { SDATABASE } from "./_lib/utils/env.js";

import {writeFileSync} from 'fs'
import { Settings } from "./_lib/models/settings.js";

await connect(SDATABASE)
let service_worker_private_key =( await Settings.findOne({})).service_worker_private_key;
console.log({service_worker_private_key});
process.exit()