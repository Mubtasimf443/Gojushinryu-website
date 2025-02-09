/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import { request, response, Router } from "express";
import Saminars from "../models/Saminar.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Mongoose } from "mongoose";
import { mailer } from "../utils/mailer.js";
import { ADMIN_EMAIL, FROM_EMAIL } from "../utils/env.js";
const router = Router()



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
    const { title, description, imageUrl, location, instructor, date } = req.body;
    [title, description, imageUrl, location, instructor, date] = [title, description, imageUrl, location, instructor, date].map(el => (typeof el === 'string' ? el.trim() : el))
    // Validation
    if (!title || !description || !imageUrl || !location || !instructor || !date) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const seminar = new Saminars({
        title,
        description,
        imageUrl,
        location,
        instructor,
        date,
    });

    try {
        const newSeminar = await seminar.save();
        res.status(201).json({ success: true, message: 'Seminar created successfully', data: newSeminar });
    } catch (err) {
        res.status(400).json({ success: false, message: 'Failed to create seminar', error: err.message });
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

// ✅ PUT - Update an existing seminar
router.put('/:id', getSeminar, async (req, res) => {
  const { title, description, imageUrl, location, instructor, date } = req.body;

  // Update only provided fields
  if (title) res.seminar.title = title;
  if (description) res.seminar.description = description;
  if (imageUrl) res.seminar.imageUrl = imageUrl;
  if (location) res.seminar.location = location;
  if (instructor) res.seminar.instructor = instructor;
  if (date) res.seminar.date = date;

  try {
    const updatedSeminar = await res.seminar.save();
    res.json({ success: true, message: 'Seminar updated successfully', data: updatedSeminar });
  } catch (err) {
    res.status(400).json({ success: false, message: 'Failed to update seminar', error: err.message });
  }
});

// ✅ DELETE - Remove a seminar
router.delete('/:id', getSeminar, async (req, res) => {
  try {
    await res.seminar.deleteOne();
    res.json({ success: true, message: 'Seminar deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete seminar', error: err.message });
  }
});

const SaminarRouter=router;
export default SaminarRouter;
