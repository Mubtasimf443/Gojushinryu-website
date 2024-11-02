import Twit from 'twit'
import fs from 'fs'
import {
    TWITER_USER_ACCESS_TOKEN,
    TWITER_USER_ACCESS_TOKEN_SECRET,
    TWITTER_APP_KEY, 
    TWITTER_APP_SECRET
} from '../env.js';


const client = new Twit({
    consumer_key:TWITTER_APP_KEY,
    consumer_secret: TWITTER_APP_SECRET,
    access_token: TWITER_USER_ACCESS_TOKEN,
    access_token_secret: TWITER_USER_ACCESS_TOKEN_SECRET
});


const files = ['image1.png', 'image2.png'];
const status = 'This tweet has multiple images';





export function tweetImages(files, status) {
  let mediaIds = new Array();
  files.forEach(function(file, index) { 
    uploadMedia(file, function(mediaId) {
      mediaIds.push(mediaId);
      if (mediaIds.length === files.length) {
        updateStatus(mediaIds, status);
      }
    });
  });
};



function uploadMedia(file, callback) {
    client.post('media/upload', { media: fs.readFileSync(file).toString("base64") }, function (err, data, response) {
      if (!err) {
        let mediaId = data.media_id_string;
        callback(mediaId);
      } else {
        console.log(`Error occured uploading content\t${err}`);
        process.exit(-1);
      }
    });
  }
  

  
function updateStatus(mediaIds, status) {
    let meta_params = {media_id: mediaIds[0]};
    client.post('media/metadata/create', meta_params, function (err, data, response) {
      if (!err) {
        let params = { status: status, media_ids: mediaIds};
        client.post('statuses/update', params, function (err, data, response) {
          if (err) {
            console.log(`Error occured updating status\t${err}`);
          }
        });
      } else {
        console.log(`Error creating metadata\t${err}`);
        process.exit(-1);
      }
    });
}