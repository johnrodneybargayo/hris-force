// routes/applicants.js
const express = require('express');
const router = express.Router();
const multer = require('multer'); // For handling file uploads
const path = require('path');
const Applicant = require('../models/Applicant');

// Create a storage engine for multer to handle file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST /api/applicants
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const {
      companyId,
      firstName,
      lastName,
      middleName,
      mobileNumber,
      addressLine1,
      addressLine2,
      postcode,
      state,
      area,
      emailId,
      education,
      country,
      stateRegion,
      experience,
      additionalDetails,
      provincialAddress,
      currentAddress,
      phoneNumber,
      emailAddress,
      dateOfBirth,
      placeOfBirth,
      maritalStatus,
      gender,
      courseGraduated,
      yearGraduated,
      school,
      mothersMaidenName,
      fathersName,
      familyMembers,
      contactPerson,
      alternatePhoneNumber,
      relationship,
      workExperiences,
    } = req.body;

    const newApplicant = new Applicant({
      companyId,
      firstName,
      lastName,
      middleName,
      mobileNumber,
      addressLine1,
      addressLine2,
      postcode,
      state,
      area,
      emailId,
      education,
      country,
      stateRegion,
      experience,
      additionalDetails,
      provincialAddress,
      currentAddress,
      phoneNumber,
      emailAddress,
      dateOfBirth,
      placeOfBirth,
      maritalStatus,
      gender,
      courseGraduated,
      yearGraduated,
      school,
      mothersMaidenName,
      fathersName,
      familyMembers,
      contactPerson,
      alternatePhoneNumber,
      relationship,
      workExperiences,
      image: req.file.filename, // Store the filename of the uploaded image in the "image" field
    });

    const savedApplicant = await newApplicant.save();

    res.status(201).json(savedApplicant);
  } catch (error) {
    console.error('Error creating applicant:', error);
    res.status(500).json({ error: 'An error occurred while creating the applicant' });
  }
});

module.exports = router;
