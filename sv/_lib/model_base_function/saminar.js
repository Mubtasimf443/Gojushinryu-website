/*بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ  ﷺ*/
/* Insha Allah,  Allah loves s enough for me */

import { request, response, Router } from "express";
import Saminars from "../models/Saminar.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Mongoose } from "mongoose";
import { mailer } from "../utils/mailer.js";
import { ADMIN_EMAIL, FROM_EMAIL, LinksHbs, noindex_meta_tags } from "../utils/env.js";
import catchError, { namedErrorCatching } from "../utils/catchError.js";
import { UploadImgFile } from "../api/formidable.file.post.api.js";
import { Cloudinary } from "../Config/cloudinary.js";
import { validate } from "string-player";
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
    let [filePath, feilds] = await UploadImgFile(req);
    let { title, description, location, date, time } = feilds;
    [title, description, location, date, time] = [title, description, location, date, time].map(function (el, i) {
      if (Array.isArray(el) === false) {
        throw new Error('All fields are required and feild id ' + (i + 1));
      }
      if (!el[0]?.trim()) {
        throw new Error('All fields are required and feild id ' + (i + 1));
      }
      return el[0].trim();
    });
    let imageUrl = (await Cloudinary.uploader.upload(filePath, { public_id: Date.now(), resource_type: 'image' })).url;
    await Saminars.create({ imageUrl, title, location, date, time, description });
    return res.sendStatus(201);

  } catch (error) {
    catchError(res, error)
  }
});

// ✅ PUT - Update an existing seminar
router.put('/:id', async function (req, res) {
  try {
    if (!isValidObjectId(req.params.id)) {
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
    catchError(res, error);
  }
});
router.post('/apply', async function applyForSeminar(req = request, res) {
  try {
    const validateFormData = (data) => {
      const requiredFields = [
        'fullName',
        'email',
        'address',
        'city',
        'province',
        'country',
        'postalCode',
        'phone',
        'seminar',
        'source',
        'reason',
        'signature',
      ];

      for (const field of requiredFields) {
        if (!data[field]?.trim()) {
          throw { isValid: false, message: `Missing required field: ${field}` };
        }
      }
    };
  
    const sendAdminEmail =async (formData) => {
      const mailOptions = {
        from:FROM_EMAIL,
        to:ADMIN_EMAIL,
        subject: `New Seminar Application: ${formData.fullName} - ${formData.seminar}`,
        html: `
          <div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif; color: #333;">
              <header style="background-color: #ffffff; padding: 20px; border-bottom: 3px solid #ffaa1c;">
                  <img src="https://gojushinryu.com/img/i2.png" alt="School Logo" style="max-width: 150px;">
              </header>
  
              <main style="padding: 30px 20px;">
                  <h2 style="color: #ffaa1c; margin-bottom: 25px;">New Seminar Application Received</h2>
                  
                  <div style="margin-bottom: 30px;">
                      <h3 style="color: #444; margin-bottom: 15px;">Applicant Information</h3>
                      <table style="width: 100%; border-collapse: collapse;">
                          <tr>
                              <td style="padding: 8px; border: 1px solid #eee; width: 30%;"><strong>Full Name:</strong></td>
                              <td style="padding: 8px; border: 1px solid #eee;">${formData.fullName}</td>
                          </tr>
                          <tr>
                              <td style="padding: 8px; border: 1px solid #eee;"><strong>Contact Email:</strong></td>
                              <td style="padding: 8px; border: 1px solid #eee;">${formData.email}</td>
                          </tr>
                          <tr>
                              <td style="padding: 8px; border: 1px solid #eee;"><strong>Phone Number:</strong></td>
                              <td style="padding: 8px; border: 1px solid #eee;">${formData.phone}</td>
                          </tr>
                          <tr>
                              <td style="padding: 8px; border: 1px solid #eee;"><strong>Address:</strong></td>
                              <td style="padding: 8px; border: 1px solid #eee;">
                                  ${formData.address}<br>
                                  ${formData.city}, ${formData.province}<br>
                                  ${formData.country}, ${formData.postalCode}
                              </td>
                          </tr>
                      </table>
                  </div>
  
                  <div style="margin-bottom: 30px;">
                      <h3 style="color: #444; margin-bottom: 15px;">Seminar Details</h3>
                      <table style="width: 100%; border-collapse: collapse;">
                          <tr>
                              <td style="padding: 8px; border: 1px solid #eee; width: 30%;"><strong>Selected Seminar:</strong></td>
                              <td style="padding: 8px; border: 1px solid #eee;">${formData.seminar}</td>
                          </tr>
                          <tr>
                              <td style="padding: 8px; border: 1px solid #eee;"><strong>Application Date:</strong></td>
                              <td style="padding: 8px; border: 1px solid #eee;">${formData.date}</td>
                          </tr>
                      </table>
                  </div>
  
                  <div style="margin-bottom: 30px;">
                      <h3 style="color: #444; margin-bottom: 15px;">Additional Information</h3>
                      <p style="margin-bottom: 10px;"><strong>Referral Source:</strong><br>${formData.source}</p>
                      <p style="margin-bottom: 10px;"><strong>Motivation:</strong><br>${formData.reason}</p>
                      <p style="color: ${formData.medical ? '#d32f2f' : '#666'};">
                          <strong>Medical Notes:</strong><br>
                          ${formData.medical || 'No medical conditions reported'}
                      </p>
                  </div>
  
                  <div style="margin-top: 25px; padding: 15px; background-color: #f9f9f9;">
                      <h4 style="color: #444; margin-bottom: 10px;">Participant/Parent Signature</h4>
                      <img src="${formData.signature}" alt="Signature" style="max-width: 250px; border: 1px solid #ddd; padding: 5px;">
                  </div>
              </main>
  
              <footer style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 0.9em; color: #666;">
                  <p>This application was submitted through the School of Traditional Martial Arts website<br>
                  <span style="color: #ffaa1c;">${new Date().toLocaleDateString()}</span></p>
              </footer>
          </div>
          `
      };
      const info=await mailer.sendMail(mailOptions);
      console.log('Saminar Application Admin send to :', info.messageId );
      
    }
    const sendConfirmationEmail =async (formData) => {
      const mailOptions = {
        from: FROM_EMAIL,
        to: formData.email.trim(),
        subject: `Application Received: ${formData.seminar}`,
        html: `
          <div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif; color: #333;">
              <header style="background-color: #ffffff; padding: 20px; border-bottom: 3px solid #ffaa1c;">
                  <img src="https://gojushinryu.com/img/6060.png" alt="School Logo" style="max-width: 150px;">
              </header>
  
              <main style="padding: 30px 20px;">
                  <h2 style="color: #ffaa1c; margin-bottom: 25px;">Thank You for Your Application!</h2>
                  
                  <div style="margin-bottom: 25px;">
                      <p>Dear ${formData.fullName},</p>
                      <p>We have successfully received your application for:</p>
                      <div style="background-color: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #ffaa1c;">
                          <h3 style="margin: 0; color: #444;">${formData.seminar}</h3>
                      </div>
                  </div>
  
                  <div style="margin-bottom: 30px;">
                      <h3 style="color: #444; margin-bottom: 15px;">Next Steps</h3>
                      <ul style="padding-left: 20px;">
                          <li>Our admissions team will review your application</li>
                          <li>You'll receive a response within 3-5 business days</li>
                          <li>Prepare required documentation (if applicable)</li>
                      </ul>
                  </div>
  
                  <div style="margin-bottom: 30px; padding: 15px; background-color: #fff8e1;">
                      <h4 style="color: #444; margin-bottom: 10px;">Important Notes</h4>
                      <p>✓ Keep this email for your records<br>
                      ✓ Ensure your contact information is current<br>
                      ✓ Check your spam folder if you don't hear from us</p>
                  </div>
  
                  <p style="margin-top: 25px;">For questions, contact our admissions office:<br>
                  <strong style="color: #ffaa1c;">admissions@martialartsschool.com</strong></p>
              </main>
  
              <footer style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 0.9em; color: #666;">
                  <p>School of Traditional Martial Arts<br>
                  123 Discipline Way, Master's City, MC 12345<br>
                  Tel: (555) 123-4567 | Email: info@martialartsschool.com</p>
                  <div style="margin-top: 10px;">
                      <a href="#" style="color: #ffaa1c; text-decoration: none; margin: 0 10px;">Website</a>
                      <a href="#" style="color: #ffaa1c; text-decoration: none; margin: 0 10px;">Facebook</a>
                      <a href="#" style="color: #ffaa1c; text-decoration: none; margin: 0 10px;">Instagram</a>
                  </div>
              </footer>
          </div>
          `,
      };
      let info=await mailer.sendMail(mailOptions);
      console.log('Saminar Application Confirmation Id :', info.messageId);
    };
    let data=req.body;
    if (!validate.isEmail(data.email)) {
      throw 'Email is not Valid';
    }
    validateFormData(data);
    await sendAdminEmail(data);
    await sendConfirmationEmail(data);
    return res.sendStatus(200)
  } catch (error) {
    catchError(res, error);
  }
})




router.get('/application/recieved', function (req, res) {
  try {
    let style = (`
      <style>
        /* Global Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Arial', sans-serif;
        }

        body {
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }

        /* Success Container */
        .success-container {
            background-color: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 600px;
            width: 100%;
        }

        .success-container h1 {
            color: #ffaa1c;
            font-size: 2.5em;
            margin-bottom: 20px;
        }

        .success-container p {
            font-size: 1.1em;
            color: #555;
            margin-bottom: 25px;
            line-height: 1.6;
        }

        .success-container .icon {
            font-size: 4em;
            color: #4caf50; /* Green for success */
            margin-bottom: 20px;
            animation: bounce 1s infinite;
        }

        @keyframes bounce {
            0%, 100% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(-10px);
            }
        }

        .success-container .cta-buttons {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 30px;
        }

        .success-container .cta-buttons a {
            text-decoration: none;
            padding: 12px 25px;
            border-radius: 6px;
            font-size: 1em;
            font-weight: bold;
            transition: background-color 0.3s, transform 0.2s;
        }

        .success-container .cta-buttons .btn-primary {
            background-color: #ffaa1c;
            color: white;
        }

        .success-container .cta-buttons .btn-secondary {
            background-color: transparent;
            border: 2px solid #ffaa1c;
            color: #ffaa1c;
        }

        .success-container .cta-buttons a:hover {
            transform: translateY(-2px);
        }

        .success-container .cta-buttons .btn-primary:hover {
            background-color: #e69900;
        }

        .success-container .cta-buttons .btn-secondary:hover {
            background-color: #ffaa1c;
            color: white;
        }

        /* Footer */
        .footer {
            margin-top: 40px;
            font-size: 0.9em;
            color: #777;
        }

        .footer a {
            color: #ffaa1c;
            text-decoration: none;
        }

        .footer a:hover {
            text-decoration: underline;
        }

        /* Responsive Design */
        @media (max-width: 600px) {
            .success-container {
                padding: 20px;
            }

            .success-container h1 {
                font-size: 2em;
            }

            .success-container p {
                font-size: 1em;
            }

            .success-container .cta-buttons {
                flex-direction: column;
                gap: 10px;
            }

            .success-container .cta-buttons a {
                width: 100%;
            }
        }
    </style>
      `);
    let html = (`
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Successful - School of Traditional Martial Arts</title>
    ${LinksHbs + noindex_meta_tags + style}
</head>
<body>
    <div class="success-container">
        <!-- Success Icon -->
        <div class="icon">✓</div>

        <!-- Success Message -->
        <h1>Application Submitted Successfully!</h1>
        <p>Thank you for applying to our seminar. Your application has been received, and our team will review it shortly. You will receive a confirmation email with further details.</p>

        <!-- Call-to-Action Buttons -->
        <div class="cta-buttons">
            <a href="/" class="btn-primary">Return to Home</a>
            <a href="/contact" class="btn-secondary">Contact Us</a>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Need assistance? <a href="/contact">Contact our support team</a>.</p>
        </div>
    </div>
</body>
</html>

    `);
    return res.status(200).send(html)
  } catch (error) {
    catchError(res, error)
  }
});



// ✅ DELETE - Remove a seminar
router.delete('/:id', getSeminar, async (req, res) => {
  try {
    await res.seminar.deleteOne();
    res.status(204).json({ success: true, message: 'Seminar deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete seminar', error: err.message });
  }
});




const SaminarRouter = router;
export default SaminarRouter;
