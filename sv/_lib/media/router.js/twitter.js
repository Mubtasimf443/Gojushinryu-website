/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  Insha Allah
By Allah's Marcy I will gain success , Insha Allah
*/

import { Router } from "express";
import { log } from "string-player";
// import { BASE_URL, TWITER_USER_ACCESS_TOKEN, TWITER_USER_ACCESS_TOKEN_SECRET, TWITTER_APP_KEY, TWITTER_APP_SECRET } from "../../utils/env.js";
import fs, { existsSync } from 'fs'
const twitterRouter =Router();
import crypto from 'crypto'
import  OAuth  from "oauth-1.0a";
import fetch from "node-fetch";
import axios from "axios";
import cryptoJS from 'crypto-js'
