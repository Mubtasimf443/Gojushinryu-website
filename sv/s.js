/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/
import {createRequire} from 'module'
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
const require=createRequire(import.meta.url)
const axios = require('axios');
const fs = require('fs');
const path = require('path');
// Replace these with your actual values
const __filename = fileURLToPath(import.meta.url);
let dirName = path.dirname(__filename);
const PAGE_ACCESS_TOKEN = 'EAAM44A3zcrMBO6LMTpNv6ZCiYDCgqMkFMmyZCLPf2SQ7RfDrZC4hdgDZB96F7T86EuXcNzu50hLEqIiBlENi61pJ3rBD7yLJBc1W0BmRascruLWNVPWtGooOXmo0yKx4ZAgPr7LZCyk7ZAVjZC0Uwob7LgGITn1glovlFMZCxXRvZCMtYpkKIS1SLEzANe6q492JUZD';
const PAGE_ID = '101986066317939';
const VIDEO_PATH = path.join(dirName, './public/12345678910.mp4'); // Update with your video file path


async function uploadVideo() {
    try {
        // Step 1: Open a video upload session

        const startUploadResponse = await axios.post(
            `https://graph.facebook.com/v21.0/${PAGE_ID}/videos`,
            {
                upload_phase: 'start',
                file_size: fs.statSync(VIDEO_PATH).size,
            },
            {
                headers: {
                    Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
                },
            }
        );

        const { upload_session_id } = startUploadResponse.data;
        console.log('Upload session started:', upload_session_id);

        // Step 2: Upload the video file in chunks
        const videoBuffer = fs.readFileSync(VIDEO_PATH);
        const chunkSize = 1024 * 1024 * 4; // 4MB
        let startOffset = 0;

        while (startOffset < videoBuffer.length) {
            const endOffset = Math.min(startOffset + chunkSize, videoBuffer.length);
            const chunk = videoBuffer.slice(startOffset, endOffset);

            await axios.post(
                `https://graph.facebook.com/v21.0/${PAGE_ID}/videos`,
                {
                    upload_phase: 'transfer',
                    start_offset: startOffset.toString(),
                    upload_session_id,
                    video_file_chunk: chunk.toString('base64'), // Convert chunk to Base64
                },
                {
                    headers: {
                        Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
                    },
                }
            );

            startOffset = endOffset;
            console.log(`Uploaded chunk. Progress: ${Math.round((endOffset / videoBuffer.length) * 100)}%`);
        }

        // Step 3: Finalize the upload
        const finalizeResponse = await axios.post(
            `https://graph.facebook.com/v21.0/${PAGE_ID}/videos`,
            {
                upload_phase: 'finish',
                upload_session_id,
            },
            {
                headers: {
                    Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`,
                },
            }
        );

        console.log('Video uploaded successfully:', finalizeResponse.data);

    } catch (error) {
        console.error('Error uploading video:', error.response?.data || error.message);
    }
}

// Call the function
export default uploadVideo