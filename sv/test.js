import { log } from "string-player";
import {connectDB} from './_lib/Config/ConnectDb.js'
import CountryRepresentatives from "./_lib/models/countryRepresentative.js";
import { mailer } from "./_lib/utils/mailer.js";
import { ADMIN_EMAIL, FROM_EMAIL } from "./_lib/utils/env.js";
/*
بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ  
InshaAllah, By his marcy I will Gain Success 
*/
await connectDB();

const express = require('express');
const formidable = require('formidable');
const tf = require('@tensorflow/tfjs');
const mobilenet = require('@tensorflow/tfjs-models').mobilenet;

const app = express();
const port = 3000;

// Load the pre-trained MobileNet model
let model;
async function loadModel() {
  model = await mobilenet.load();
  console.log('MobileNet model loaded');
}

loadModel(); // Initialize the model loading

// Middleware for parsing multipart/form-data requests
app.post('/upload', (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = "./uploads";
  form.keepExtensions = true;
  form.maxFileSize = 10 * 1024 * 1024; // 10 MB

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(500).send({ message: 'Error uploading file' });
    }

    console.log("File uploaded successfully:", files);
    const uploadedFile = files.file;

    // Pre-process the image for the model
    const img = tf.browser.fromPixels(uploadedFile.path);
    const resizedImg = tf.image.resizeBilinear(img, [224, 224]); // MobileNet input size
    const normalizedImg = resizedImg.toFloat().div(255);
    const batchedImg = normalizedImg.expandDims(0);

    // Make predictions using the pre-trained MobileNet model
    model.classify(batchedImg).then(predictions => {
      const { className, probability } = predictions[0];
      console.log(`Prediction: ${className} (${probability.toFixed(2)})`);

      // Simple classification as "dog" or "cat" based on the pre-trained model's output
      const classification = className.includes('dog') ? 'dog' : className.includes('cat') ? 'cat' : 'unknown';
      res.send({ classification, confidence: probability.toFixed(2) });
    }).catch(err => {
      console.error("Error making prediction:", err);
      res.status(500).send({ message: 'Error making prediction' });
    });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
