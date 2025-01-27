/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/

import {config} from 'dotenv'
import path, { resolve } from 'path'
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "./jobs.env") });

export const TEST_DATABASE =process.env.TEST_DATABASE;
export const DATABASE =process.env.DATABASE;
export const FACEBOOK_APP_ID =process.env.FACEBOOK_APP_ID;
export const FACEBOOK_APP_SECRET =process.env.FACEBOOK_APP_SECRET;
export const FACEBOOK_REDIRECT_URI =process.env.FACEBOOK_REDIRECT_URI;
export const YOUTUBE_KEY =process.env.YOUTUBE_KEY;
export const YOUTUBE_SECRET =process.env.YOUTUBE_SECRET;
export const YOUTUBE_REDIRECT_URI =process.env.YOUTUBE_REDIRECT_URI;
export const LINKEDIN_KEY =process.env.LINKEDIN_KEY;
export const LINKEDIN_SECRET =process.env.LINKEDIN_SECRET;
export const LINKEDIN_REDIRECT_URI =process.env.LINKEDIN_REDIRECT_URI;
export const TIKTOK_KEY=process.env.TIKTOK_KEY;
export const TIKTOK_SECRET=process.env.TIKTOK_SECRET;
export const TIKTOK_REDIRECT_URI=process.env.TIKTOK_REDIRECT_URI;
export const MAIL_HOST =process.env.MAIL_HOST
export const MAIL_PORT =process.env.MAIL_PORT
export const MAIL_USER =process.env.MAIL_USER
export const MAIL_PASS=process.env.MAIL_PASS
export const ADMIN_EMAIL =process.env.ADMIN_EMAIL
export const ADMIN_PHONE =process.env.ADMIN_PHONE
export const FROM_EMAIL=process.env.FROM_EMAIL
export const WEBSITE_ORIGIN=process.env.WEBSITE_ORIGIN
export const ORGANIZATION_NAME=process.env.ORGANIZATION_NAME