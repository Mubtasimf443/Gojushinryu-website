/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import { request, response, Router } from "express";
import Saminars from "../models/Saminar.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Mongoose } from "mongoose";
import { mailer } from "../utils/mailer.js";
import { ADMIN_EMAIL, FROM_EMAIL } from "../utils/env.js";
import catchError, { namedErrorCatching } from "../utils/catchError.js";
import { UploadImgFile } from "../api/formidable.file.post.api.js";
import { Cloudinary } from "../Config/cloudinary.js";
const router = Router();



// Middleware to find a seminar by ID
async function getSeminar(req = request, res = response, next) {
    let seminar;
    try {
        if (!isValidObjectId(req.params.id)) return res.sendStatus(400);
        seminar = await Saminars.findById(req.params.id);
        if (!seminar) {
            return res.status(404).json({ success: false, message: 'Seminar not found' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
    res.seminar = seminar;
    next();
}

// ✅ GET all seminars
router.get('/', async (req, res) => {
  try {
    const seminars = await Saminars.find().sort({ date: -1 }); // Sorted by date
    res.json({ success: true, count: seminars.length, data: seminars });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
  }
});

// ✅ GET a single seminar by ID
router.get('/:id', getSeminar, (req, res) => {
  res.json({ success: true, data: res.seminar });
});

// ✅ POST - Create a new seminar
router.post('/', async (req, res) => {
  try {
      let [filePath , feilds] =await UploadImgFile(req);
      let {title, description, location, date, time }=feilds;
      [title, description, location, date, time] = [title, description, location, date, time].map(function (el, i) {
        if (Array.isArray(el) === false) {
          throw new Error('All fields are required and feild id ' + (i + 1));
        }
        if (!el[0]?.trim()) {
          throw new Error('All fields are required and feild id ' + (i + 1));
        }
        return el[0].trim();
      });
      let imageUrl = (await Cloudinary.uploader.upload(filePath, { public_id:  Date.now(), resource_type: 'image' })).url;
      await Saminars.create({ imageUrl, title, location, date, time, description });
      return res.sendStatus(201);
    
  } catch (error) {
    catchError(res,error)
  }
});

// ✅ PUT - Update an existing seminar
router.put('/:id', async function (req,res) {
  try {
    if (!isValidObjectId(req.params.id) ) {
      namedErrorCatching('p-error', 'id is not corect')
    }
    if (req.headers['content-type'] === 'application/json') {
      const { title, description, location, date, time } = req.body;
      if (!title || !description || !location || time.length !== 5 || !date) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }
      await Saminars.findByIdAndUpdate(req.params.id, { title, location, date, time, description });
      return res.sendStatus(202)
    }
    let [filePath, feilds] = await UploadImgFile(req);
    let { title, description, location, date, time } = feilds;
    [title, description, location, date, time] = [title, description, location, date, time].map(function (el, i) {
      if (Array.isArray(el) === false) throw new Error('All fields are required and feild id ' + (i + 1));
      if (!el[0]?.trim()) throw new Error('All fields are required and feild id ' + (i + 1));
      return el[0].trim();
    });
    let imageUrl = (await Cloudinary.uploader.upload(filePath, { public_id: type ? type : Date.now(), resource_type: 'image' })).url;
    await Saminars.findByIdAndUpdate(req.params.id, { imageUrl, title, location, date, time, description });
    return res.sendStatus(202);
  } catch (error) {
    catchError(res,error);
  }
});

router.post('/apply', async function applyForSeminar(req, res) {
  try {
    const { name, email, phone, message } = req.body;

    // ✅ Input Validation
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ success: false, message: 'Please enter a valid name.' });
    }
  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }
  
    const phonePattern = /^\+?[0-9]{7,15}$/;
    if (!phonePattern.test(phone)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid phone number.' });
    }
  
    if (message.length < 50 || message.length > 1000) {
      return res.status(400).json({ success: false, message: 'Message must be between 50 and 200 characters.' });
    }
  
    const mailOptions = {
      from: FROM_EMAIL,
      to: ADMIN_EMAIL, // Send email to admin
      subject: `📌 New Seminar Application from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #ffaa1c;">🥋 New Seminar Application</h2>
          <p style="font-size: 16px; line-height: 1.5;">
            A student has applied for a seminar. Below are the details:
          </p>
          <hr>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background: #f8f8f8; padding: 10px; border-left: 4px solid #ffaa1c;">
            ${message}
          </blockquote>
          <p style="text-align: center; margin-top: 20px;">
            <a href="mailto:${email}" style="background: #ffaa1c; color: #fff; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reply to Applicant</a>
          </p>
          <hr>
          <p style="font-size: 12px; color: #666; text-align: center;">
            This email was generated automatically from the GojushinRyu website.
          </p>
        </div>
      `
    };
    await mailer.sendMail(mailOptions);
    res.status(201).json({ success: true, message: 'Application submitted successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email. Please try again later.' });
  }
})

// ✅ DELETE - Remove a seminar
router.delete('/:id', getSeminar, async (req, res) => {
  try {
    await res.seminar.deleteOne();
    res.status(204).json({ success: true, message: 'Seminar deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete seminar', error: err.message });
  }
});

const SaminarRouter=router;
export default SaminarRouter;
